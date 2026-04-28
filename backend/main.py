from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
# Force AI model caches to a local writable directory to avoid permission issues
_base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_cache_dir = os.path.join(_base_dir, ".cache")
os.environ["XDG_CACHE_HOME"] = _cache_dir
os.environ["WHISPER_CACHE_DIR"] = os.path.join(_cache_dir, "whisper")
os.environ["YOLO_CONFIG_DIR"] = os.path.join(_cache_dir, "ultralytics")
os.environ["TORCH_HOME"] = os.path.join(_cache_dir, "torch")

os.makedirs(_cache_dir, exist_ok=True)
os.makedirs(os.environ["WHISPER_CACHE_DIR"], exist_ok=True)
os.makedirs(os.environ["YOLO_CONFIG_DIR"], exist_ok=True)
os.makedirs(os.environ["TORCH_HOME"], exist_ok=True)

import shutil
import time
from typing import List, Optional, Dict
import sys

# Add parent directory to path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.staticfiles import StaticFiles
import pipeline
import config
from modules.utils import ensure_dir
import models
import database
from database import engine, SessionLocal, get_db
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Initialize database
# Ensure required directories exist
ensure_dir("output")
ensure_dir("temp_inputs")
database.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Shorts Creator API")

@app.get("/")
def home():
    return {"status": "healthy", "message": "Virail AI API is running", "worker": "active"}

# Mount output directory as static files
app.mount("/static", StaticFiles(directory="output"), name="static")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication logic (Supabase)
security = HTTPBearer()
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "your-placeholder-secret")
SUPABASE_ALGORITHM = "HS256"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[SUPABASE_ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# For now, we'll make auth optional to not break the current flow until the user provides the secret
async def get_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        return "anonymous"
    try:
        return await get_current_user(credentials)
    except:
        return "anonymous"

class ProjectStatus(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    status: str
    progress: float
    message: str
    results: list[str] = []

class UserSettings(BaseModel):
    name: str
    email: Optional[str] = None

class MarketplacePurchase(BaseModel):
    item_id: str
    item_name: str
    price: float

@app.post("/upload")
async def upload_video(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Create unique project ID and temp directory
    project_id = str(uuid.uuid4())
    temp_dir = os.path.join("temp_inputs", project_id)
    ensure_dir(temp_dir)
    
    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db_project = models.Project(
        id=project_id,
        name=file.filename,
        video_path=file_path,
        status="uploaded",
        progress=0.0,
        message="Video uploaded successfully"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return {"project_id": project_id}

@app.post("/process/{project_id}")
async def start_processing(project_id: str, background_tasks: BackgroundTasks, num_shorts: int = 3, duration: int = 30, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.status = "processing"
    db.commit()
    
    background_tasks.add_task(
        run_pipeline_task, 
        project_id, 
        db_project.video_path, 
        num_shorts, 
        duration
    )
    
    return {"message": "Processing started", "project_id": project_id}

@app.post("/cancel/{project_id}")
async def cancel_processing(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if db_project.status == "processing":
        db_project.status = "cancelled"
        db_project.message = "Operation cancelled by user"
        db.commit()
        
    return {"message": "Cancellation requested"}

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Clean up files
    project_dir = os.path.join("output", project_id)
    if os.path.exists(project_dir):
        shutil.rmtree(project_dir)
    
    temp_dir = os.path.join("temp_inputs", project_id)
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted"}

@app.get("/projects", response_model=list[ProjectStatus])
async def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    
    projects = db.query(models.Project).all()
    completed_projects = [p for p in projects if p.status == "completed"]
    recent_projects = [p for p in completed_projects if p.created_at >= one_week_ago]
    
    total_clips = sum(len(p.results) if p.results else 0 for p in completed_projects)
    clips_this_week = sum(len(p.results) if p.results else 0 for p in recent_projects)
    
    # Estimate minutes used (30s per clip)
    minutes_used = total_clips * 0.5 
    
    return {
        "totalClips": total_clips,
        "clipsThisWeek": clips_this_week,
        "totalScheduled": 0, # Backend doesn't support scheduling yet
        "timeSavedMinutes": total_clips * 30,
        "minutesUsed": int(minutes_used),
        "minutesLimit": 60, # Default limit
        "avgScore": 85 if total_clips > 0 else 0
    }

@app.post("/user/settings")
async def update_settings(settings: UserSettings, db: Session = Depends(get_db)):
    # In a real app, we'd use the current_user's ID
    # For now, we'll update a mock user or the first user in DB
    return {"message": "Settings updated successfully", "name": settings.name}

@app.post("/marketplace/purchase")
async def record_purchase(purchase: MarketplacePurchase, db: Session = Depends(get_db)):
    # Logic to store purchase in DB (e.g., EventLog or a new Purchase table)
    print(f"User purchased {purchase.item_name} for ${purchase.price}")
    return {"message": f"Successfully purchased {purchase.item_name}", "item_id": purchase.item_id}

@app.get("/status/{project_id}", response_model=ProjectStatus)
async def get_status(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

def run_pipeline_task(project_id: str, video_path: str, num_shorts: int, duration: int):
    # We need a new session for the background task
    db = SessionLocal()
    try:
        output_dir = os.path.join("output", project_id)
        ensure_dir(output_dir)
        
        def update_progress(stage, status, progress):
            # Update DB in real-time with "classy" flair
            stage_names = {
                1: "Audio Resonance",
                2: "Linguistic Mapping",
                3: "Visual Appraisal",
                4: "Selection of Excellence",
                5: "Cinematic Synthesis"
            }
            db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
            if db_project:
                # Reload from DB immediately to check for cancellation
                db.refresh(db_project)
                if db_project.status == "cancelled":
                    raise InterruptedError("cancelled_by_user")
                
                db_project.progress = progress
                display_stage = stage_names.get(stage, f"Stage {stage}")
                db_project.message = f"{display_stage} · {status}"
                db.commit()
        
        results = pipeline.run(
            video_path=video_path,
            num_shorts=num_shorts,
            clip_duration=duration,
            output_dir=output_dir,
            interactive=False,
            progress_callback=update_progress
        )
        
        db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if db_project:
            db_project.status = "completed"
            db_project.progress = 1.0
            db_project.message = "Processing completed successfully"
            db_project.results = results
            db.commit()
        
    except InterruptedError as e:
        if str(e) == "cancelled_by_user":
            pass # Keep it as cancelled, do not mark as failed
        else:
            db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
            if db_project:
                db_project.status = "failed"
                db_project.message = f"Error: {str(e)}"
                db.commit()
    except Exception as e:
        db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if db_project:
            db_project.status = "failed"
            db_project.message = f"Error: {str(e)}"
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

import streamlit as st
import os
# Force AI model caches to a local writable directory
_base_dir = os.path.dirname(os.path.abspath(__file__))
_cache_dir = os.path.join(_base_dir, ".cache")
os.environ["XDG_CACHE_HOME"] = _cache_dir
os.environ["WHISPER_CACHE_DIR"] = os.path.join(_cache_dir, "whisper")
os.makedirs(_cache_dir, exist_ok=True)
os.makedirs(os.environ["WHISPER_CACHE_DIR"], exist_ok=True)

import time
import shutil
from pathlib import Path
import pipeline
import config
from modules.utils import ensure_dir

# ─────────────────────────────────────────────────────────────
# Page Configuration & Styling
# ─────────────────────────────────────────────────────────────

st.set_page_config(
    page_title="AI Video Shorts Creator",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Premium CSS for Glassmorphism, Dark Mode, and Vibrant Gradients
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
        background-color: #0e1117;
        color: #e0e0e0;
    }

    .main {
        background: radial-gradient(circle at top right, #1e293b, #0f172a);
    }

    /* Glassmorphism containers */
    .stApp > header {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
    }

    div[data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.95);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Header Styling */
    .main-header {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }

    .sub-header {
        font-size: 1.2rem;
        color: #94a3b8;
        margin-bottom: 2rem;
    }

    /* Progress bar styling */
    .stProgress > div > div > div > div {
        background-image: linear-gradient(90deg, #38bdf8, #c084fc);
    }

    /* Buttons */
    .stButton > button {
        background: linear-gradient(90deg, #4f46e5, #7c3aed);
        color: white;
        border: none;
        padding: 0.6rem 2rem;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    }

    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        background: linear-gradient(90deg, #4338ca, #6d28d9);
    }

    /* File Uploader */
    div[data-testid="stFileUploader"] {
        background: rgba(30, 41, 59, 0.5);
        border: 2px dashed rgba(148, 163, 184, 0.3);
        border-radius: 12px;
        padding: 20px;
    }

    /* Result Card */
    .result-card {
        background: rgba(30, 41, 59, 0.4);
        border-radius: 16px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        margin-bottom: 20px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# Session State & Helpers
# ─────────────────────────────────────────────────────────────

if 'generated_shorts' not in st.session_state:
    st.session_state.generated_shorts = []

def progress_callback(stage, status, progress):
    """Callback for the pipeline to update UI progress."""
    st.session_state.progress_stage = stage
    st.session_state.progress_status = status
    st.session_state.progress_val = progress
    # We use a placeholder for persistent status updates later

# ─────────────────────────────────────────────────────────────
# Sidebar — Configuration
# ─────────────────────────────────────────────────────────────

with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/video-editing.png", width=80)
    st.title("Settings")
    
    num_shorts = st.slider("Number of Shorts", 1, config.MAX_SHORTS, 3)
    clip_duration = st.select_slider("Short Duration (sec)", options=[15, 30, 45, 60], value=30)
    
    whisper_model = st.selectbox(
        "Whisper Model", 
        ["base", "small", "medium", "large", "large-v2"], 
        index=1,
        help="Larger models are more accurate but slower."
    )
    
    caption_style = st.radio("Caption Style", ["word_highlight", "full_line"], index=0)
    
    st.markdown("---")
    st.markdown("### AI Engine")
    st.info(f"Device: {config.DEVICE.upper()}")
    if config.DEVICE == "cuda":
        st.success("GPU Acceleration Enabled")
    else:
        st.warning("Running on CPU")

# ─────────────────────────────────────────────────────────────
# Main UI
# ─────────────────────────────────────────────────────────────

st.markdown('<h1 class="main-header">AI Video Shorts Creator</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">Turn long videos into viral 9:16 shorts automatically.</p>', unsafe_allow_html=True)

uploaded_file = st.file_uploader("📂 Upload your video source (MP4, MKV, MOV)", type=["mp4", "mkv", "mov", "avi"])

if uploaded_file is not None:
    # Set up directories
    temp_input_path = Path("temp_inputs")
    ensure_dir(str(temp_input_path))
    video_path = temp_input_path / uploaded_file.name
    
    with open(video_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    st.video(str(video_path))
    
    col1, col2 = st.columns([1, 4])
    with col1:
        start_btn = st.button("🚀 Create Shorts")
    
    if start_btn:
        output_dir = os.path.join("output", Path(uploaded_file.name).stem)
        ensure_dir(output_dir)
        
        # UI Placeholders for progress
        progress_bar = st.progress(0)
        status_text = st.empty()
        log_expander = st.expander("Detailed Process Logs")
        
        def update_ui(stage, status, progress):
            progress_bar.progress(progress)
            status_text.markdown(f"**Stage {stage}:** {status}")
            log_expander.write(f"[{time.strftime('%X')}] Stage {stage}: {status}")

        try:
            with st.spinner("AI is working its magic... (Stay on this page)"):
                start_time = time.time()
                results = pipeline.run(
                    video_path=str(video_path),
                    num_shorts=num_shorts,
                    clip_duration=clip_duration,
                    output_dir=output_dir,
                    whisper_model=whisper_model,
                    caption_style=caption_style,
                    interactive=False, # No terminal input
                    progress_callback=update_ui
                )
                elapsed = time.time() - start_time
            
            st.session_state.generated_shorts = results
            st.balloons()
            st.success(f"Successfully created {len(results)} shorts in {elapsed:.1f}s!")
            
        except Exception as e:
            st.error(f"Error during processing: {e}")
            st.exception(e)

# ─────────────────────────────────────────────────────────────
# Results Gallery
# ─────────────────────────────────────────────────────────────

if st.session_state.generated_shorts:
    st.markdown("---")
    st.markdown("## 🎬 Generated Shorts")
    
    cols = st.columns(min(len(st.session_state.generated_shorts), 3))
    for i, short_path in enumerate(st.session_state.generated_shorts):
        with cols[i % 3]:
            st.markdown(f'<div class="result-card">', unsafe_allow_html=True)
            st.markdown(f"**Short {i+1}**")
            st.video(short_path)
            with open(short_path, "rb") as file:
                st.download_button(
                    label="Download",
                    data=file,
                    file_name=os.path.basename(short_path),
                    mime="video/mp4",
                    key=f"dl_{i}"
                )
            st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown('<div style="text-align: center; color: #64748b; font-size: 0.8rem;">Powered by Antigravity AI Engine</div>', unsafe_allow_html=True)

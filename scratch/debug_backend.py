
import sys
import os
# Add the backend directory to sys.path
backend_dir = os.path.join(os.getcwd(), 'backend')
sys.path.append(backend_dir)

try:
    import main
    from main import app
    print("App imported successfully")
    
    # We need to trigger the startup logic which builds the OpenAPI schema
    # because that's when FastAPI validates the routes and their models.
    from fastapi.openapi.utils import get_openapi
    
    print("Building OpenAPI schema...")
    get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )
    print("OpenAPI schema built successfully!")
    
except Exception as e:
    import traceback
    traceback.print_exc()

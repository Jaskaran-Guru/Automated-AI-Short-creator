
import sys
import os

backend_dir = os.path.join(os.getcwd(), 'backend')
sys.path.append(backend_dir)

try:
    import main
    from main import app
    print("App imported successfully")


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

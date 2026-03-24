import os
import sys

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database import engine, Base
    import models
    print("Imports successful")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")
except Exception as e:
    import traceback
    traceback.print_exc()

import sys
import os

print("Testing imports...")
try:
    print("Attempting to import torch...")
    import torch
    print(f"torch: {torch.__version__} (CUDA: {torch.cuda.is_available()})")
    
    print("Attempting to import whisper...")
    import whisper
    print("whisper: imported")
    
    print("Attempting to import clip...")
    import clip
    print("clip: imported")
    
    print("Attempting to import ultralytics...")
    from ultralytics import YOLO
    print("ultralytics: imported")
    
    print("Attempting to import librosa...")
    import librosa
    print("librosa: imported")
    
    print("Attempting to import rich...")
    import rich
    print("rich: imported")
    
    print("\nTesting local modules...")
    import config
    print("config: imported")
    from modules import utils
    print("modules.utils: imported")
    from modules import audio_extractor
    print("modules.audio_extractor: imported")
    from modules import transcriber
    print("modules.transcriber: imported")
    from modules import scene_scorer
    print("modules.scene_scorer: imported")
    from modules import scene_selector
    print("modules.scene_selector: imported")
    from modules import video_cutter
    print("modules.video_cutter: imported")
    from modules import caption_renderer
    print("modules.caption_renderer: imported")
    
    print("\nAll modules imported successfully!")
except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

"""
config.py — Central configuration for AI Video Shorts Creator
"""

import os

# DEVICE will be discovered lazily when needed
_DEVICE = None

def get_device():
    global _DEVICE
    if _DEVICE is None:
        try:
            import torch
            _DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
        except (ImportError, Exception):
            # Fallback to CPU if torch is missing or hanging
            _DEVICE = "cpu"
    return _DEVICE

def __getattr__(name):
    if name == "DEVICE":
        return get_device()
    raise AttributeError(f"module {__name__} has no attribute {name}")

# ─────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, ".temp")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

# ─────────────────────────────────────────────
# Whisper
# ─────────────────────────────────────────────
WHISPER_MODEL = "small"          # base | small | medium | large | large-v2
WHISPER_LANGUAGE = None          # None = auto-detect, or "en", "hi", "es" etc.
WHISPER_CACHE_DIR = os.path.join(BASE_DIR, ".cache", "whisper")

# Set XDG_CACHE_HOME to ensure all AI models use a local writable directory
os.environ["XDG_CACHE_HOME"] = os.path.join(BASE_DIR, ".cache")
os.makedirs(os.environ["XDG_CACHE_HOME"], exist_ok=True)

# ─────────────────────────────────────────────
# Scene Scoring Weights  (must sum to 1.0)
# ─────────────────────────────────────────────
SCORE_WEIGHT_CLIP  = 0.40        # CLIP semantic relevance
SCORE_WEIGHT_YOLO  = 0.35        # YOLO visual activity (faces / objects)
SCORE_WEIGHT_AUDIO = 0.25        # Audio energy / loudness

CLIP_MODEL_NAME    = "ViT-B/32"
YOLO_MODEL_NAME    = "yolov8n.pt" # smallest + fastest

# Prompts used for CLIP scoring
CLIP_POSITIVE_PROMPTS = [
    "exciting action scene",
    "interesting interview close-up",
    "emotional dramatic moment",
    "funny comedic scene",
    "beautiful landscape shot",
    "intense thrilling moment",
]
CLIP_NEGATIVE_PROMPTS = [
    "blank screen",
    "boring talking head",
    "dark scene nothing happening",
]

# ─────────────────────────────────────────────
# Video / Shorts
# ─────────────────────────────────────────────
SHORT_WIDTH  = 1080
SHORT_HEIGHT = 1920
SHORT_FPS    = 30

# ─────────────────────────────────────────────
# Caption / Subtitle Style
# ─────────────────────────────────────────────
CAPTION_FONT      = "Arial"
CAPTION_FONT_SIZE = 22          # in ASS points (scales with resolution)
CAPTION_COLOR     = "&H00FFFFFF"   # white  (ASS BGR hex)
CAPTION_HIGHLIGHT = "&H0000FFFF"   # yellow highlight (ASS BGR hex)
CAPTION_OUTLINE   = "&H00000000"   # black outline
CAPTION_BOLD      = True
CAPTION_STYLE     = "word_highlight"  # word_highlight | full_line

# Position: bottom-third of the frame
CAPTION_MARGIN_V   = 80         # pixels from bottom

# ─────────────────────────────────────────────
# Pipeline
# ─────────────────────────────────────────────
MIN_GAP_BETWEEN_CLIPS = 5       # seconds — avoid overlapping selections
FRAME_SAMPLE_RATE     = 1       # sample 1 frame per second for scoring
MAX_SHORTS            = 20

# ─────────────────────────────────────────────
# FFmpeg binary (auto-detected; override if needed)
# ─────────────────────────────────────────────
FFMPEG_BIN  = "ffmpeg"
FFPROBE_BIN = "ffprobe"

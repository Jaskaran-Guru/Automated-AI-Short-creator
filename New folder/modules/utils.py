from __future__ import annotations
import os
import sys
from typing import List, Optional, Any
import logging
import shutil
import subprocess
from pathlib import Path

# ── Console & Logger (No-Rich Fallback) ────────────────────────
class SimpleConsole:
    def print(self, *args, **kwargs):
        import re
        msg = str(args[0]) if args else ""
        # Strip potential rich tags
        msg = re.sub(r"\[/?.*?\]", "", msg)
        print(msg)
    def rule(self, text=""):
        print(f"\n{'─'*10} {text} {'─'*10}")

console = SimpleConsole()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="[%X]",
    handlers=[logging.StreamHandler(sys.stdout)]
)
log = logging.getLogger("shorts")


# ── Progress Bar Factory (No-Rich Fallback) ────────────────────
def make_progress() -> Any:
    class SimpleProgress:
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def add_task(self, description, **kwargs): 
            print(f"Starting: {description}")
            return 0
        def update(self, *args, **kwargs): pass
        def advance(self, *args, **kwargs): pass
    return SimpleProgress()


# ── Temp Directory Management ─────────────────────────────────
def ensure_dir(path: str) -> str:
    """Create directory if it doesn't exist, return path."""
    os.makedirs(path, exist_ok=True)
    return path


def clean_temp(temp_dir: str) -> None:
    """Remove the temp directory tree."""
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir, ignore_errors=True)
        log.info(f"Cleaned temp directory: {temp_dir}")


# ── FFmpeg / FFprobe Helpers ──────────────────────────────────
def check_ffmpeg(ffmpeg_bin: str = "ffmpeg", ffprobe_bin: str = "ffprobe") -> None:
    """Verify ffmpeg and ffprobe are on PATH; raise if not found."""
    for binary in (ffmpeg_bin, ffprobe_bin):
        if shutil.which(binary) is None:
            print(f"ERROR: '{binary}' not found on PATH.")
            print("Please install FFmpeg: https://ffmpeg.org/download.html")
            sys.exit(1)
    log.info("FFmpeg ✓")


def run_ffmpeg(args: list, desc: str = "", capture: bool = False) -> subprocess.CompletedProcess:
    """Run an ffmpeg command, streaming stderr to log on failure."""
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"] + args
    log.debug(f"Running: {' '.join(cmd)}")
    result = subprocess.run(
        cmd,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        log.error(f"FFmpeg failed [{desc}]:\n{result.stderr}")
        raise RuntimeError(f"FFmpeg error during: {desc}")
    return result


def run_ffprobe(args: list) -> subprocess.CompletedProcess:
    """Run an ffprobe command and return the result."""
    cmd = ["ffprobe", "-v", "quiet"] + args
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return result


# ── File Utilities ────────────────────────────────────────────
def stem(path: str) -> str:
    """Return the stem (filename without extension) of a path."""
    return Path(path).stem


def seconds_to_hms(seconds: float) -> str:
    """Convert float seconds to HH:MM:SS.mmm string."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}"


def format_duration(seconds: float) -> str:
    """Human-readable duration string."""
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m}m {s}s" if m else f"{s}s"

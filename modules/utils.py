"""
modules/utils.py — Shared helpers: logging, progress bars, temp file management
"""

import os
import sys
import logging
import shutil
import subprocess
from pathlib import Path
from rich.console import Console
from rich.logging import RichHandler
from rich.progress import (
    Progress, SpinnerColumn, BarColumn,
    TextColumn, TimeElapsedColumn, TaskProgressColumn
)

# ── Console & Logger ──────────────────────────────────────────
console = Console()

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(console=console, rich_tracebacks=True, markup=True)]
)
log = logging.getLogger("shorts")


# ── Progress Bar Factory ──────────────────────────────────────
def make_progress() -> Progress:
    return Progress(
        SpinnerColumn(),
        TextColumn("[bold cyan]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        TimeElapsedColumn(),
        console=console,
    )


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
            console.print(
                f"[bold red]ERROR:[/bold red] '{binary}' not found on PATH.\n"
                "Please install FFmpeg: https://ffmpeg.org/download.html\n"
                "And add it to your system PATH, then restart the terminal."
            )
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

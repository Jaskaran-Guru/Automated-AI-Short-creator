from __future__ import annotations
import os
import shutil
from typing import List

from modules.utils import log, run_ffmpeg, ensure_dir
from modules.transcriber import WordEntry, words_to_ass, words_in_window
import config


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────

def render_captions(
    clip_path:   str,
    output_path: str,
    words:       List[WordEntry],
    clip_start:  float,
    clip_end:    float,
    ass_dir:     str,
    style:       str = config.CAPTION_STYLE,
) -> str:
    """
    Burn animated captions onto *clip_path* and write to *output_path*.

    Parameters
    ----------
    clip_path   : path to  trimmed/cropped  vertical clip (no subtitles yet)
    output_path : destination file with captions burned in
    words       : full word list from Whisper
    clip_start  : original start time of this clip (seconds, for timestamp offset)
    clip_end    : original end time of this clip (seconds)
    ass_dir     : folder where temporary .ass files will be stored
    style       : 'word_highlight' | 'full_line'

    Returns
    -------
    output_path
    """
    ensure_dir(os.path.dirname(output_path))
    ensure_dir(ass_dir)

    basename   = os.path.splitext(os.path.basename(clip_path))[0]
    ass_path   = os.path.join(ass_dir, f"{basename}.ass")

    # ── Build ASS file relative to the clip's timeline ──────
    clip_words = words_in_window(words, clip_start, clip_end)

    if not clip_words:
        log.warning(f"No words found in clip window [{clip_start:.1f}s – {clip_end:.1f}s]; "
                    "copying clip without captions.")
        shutil.copy2(clip_path, output_path)
        return output_path

    words_to_ass(
        words=clip_words,
        ass_path=ass_path,
        words_per_line=6 if style == "word_highlight" else 10,
        clip_start=clip_start,
    )

    # ── Escape path for FFmpeg filter on Windows ─────────────
    # Forward slashes and escaped colons are required inside vf filter strings
    ass_escaped = ass_path.replace("\\", "/").replace(":", "\\:")

    vf = f"ass='{ass_escaped}'"

    run_ffmpeg([
        "-i", clip_path,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "21",
        "-c:a", "copy",
        "-movflags", "+faststart",
        output_path,
    ], desc=f"burn_captions {os.path.basename(output_path)}")

    log.info(f"  ✓ Captioned: {output_path}")
    return output_path

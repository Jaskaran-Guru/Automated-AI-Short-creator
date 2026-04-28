from __future__ import annotations
import os
import re
from typing import List, Dict, Optional
from dataclasses import dataclass

# import whisper (lazy loaded)

from modules.utils import log, ensure_dir, seconds_to_hms
import config


# ─────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────

@dataclass
class WordEntry:
    word:  str
    start: float   # seconds
    end:   float   # seconds


# ─────────────────────────────────────────────────────────────
# Transcription
# ─────────────────────────────────────────────────────────────

def transcribe(
    audio_path: str,
    model_name: str = config.WHISPER_MODEL,
    language: Optional[str] = config.WHISPER_LANGUAGE,
) -> List[WordEntry]:
    """
    Run Whisper on the extracted audio WAV and return a flat list of WordEntry.

    Parameters
    ----------
    audio_path : path to 16 kHz mono WAV
    model_name : whisper model size
    language   : BCP-47 language code or None for auto-detect

    Returns
    -------
    words : list of WordEntry with millisecond-accurate timestamps
    """
    import whisper
    log.info(f"Loading Whisper model '{model_name}' on {config.DEVICE} …")
    log.info(f"Whisper cache directory: {config.WHISPER_CACHE_DIR}")
    ensure_dir(config.WHISPER_CACHE_DIR)
    model = whisper.load_model(model_name, device=config.DEVICE, download_root=config.WHISPER_CACHE_DIR)

    log.info("Transcribing audio (word timestamps enabled) …")
    result = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,
        verbose=False,
        fp16=(config.DEVICE == "cuda"),
    )

    words: List[WordEntry] = []
    for segment in result.get("segments", []):
        for w in segment.get("words", []):
            text = w.get("word", "").strip()
            if text:
                words.append(WordEntry(
                    word=text,
                    start=float(w["start"]),
                    end=float(w["end"]),
                ))

    log.info(f"Transcription complete ✓  ({len(words)} words detected)")
    return words


# ─────────────────────────────────────────────────────────────
# SRT Export
# ─────────────────────────────────────────────────────────────

def _srt_ts(seconds: float) -> str:
    """Convert seconds → SRT timestamp HH:MM:SS,mmm"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"


def words_to_srt(words: List[WordEntry], srt_path: str, words_per_line: int = 8) -> str:
    """
    Group words into caption lines and write an SRT file.
    Returns srt_path.
    """
    ensure_dir(os.path.dirname(srt_path))

    # Group into chunks of N words
    groups = [words[i:i+words_per_line] for i in range(0, len(words), words_per_line)]

    lines = []
    for idx, group in enumerate(groups, start=1):
        start = group[0].start
        end   = group[-1].end
        text  = " ".join(w.word for w in group)
        lines.append(f"{idx}\n{_srt_ts(start)} --> {_srt_ts(end)}\n{text}\n")

    with open(srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    log.info(f"SRT written → {srt_path}")
    return srt_path


# ─────────────────────────────────────────────────────────────
# ASS Export (with karaoke word-highlight via \kf tags)
# ─────────────────────────────────────────────────────────────

ASS_HEADER = """\
[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{font},{size},{primary},&H000000FF,{outline},&H00000000,{bold},0,0,0,100,100,0,0,1,2,1,2,10,10,{marginv},1
Style: Highlight,{font},{size},{highlight},&H000000FF,{outline},&H00000000,{bold},0,0,0,100,100,0,0,1,2,1,2,10,10,{marginv},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

def _ass_ts(seconds: float) -> str:
    """Convert seconds → ASS timestamp H:MM:SS.cc"""
    h  = int(seconds // 3600)
    m  = int((seconds % 3600) // 60)
    s  = seconds % 60
    cs = int((s % 1) * 100)   # centiseconds
    return f"{h}:{m:02d}:{int(s):02d}.{cs:02d}"


def words_to_ass(
    words: List[WordEntry],
    ass_path: str,
    words_per_line: int = 6,
    clip_start: float = 0.0,    # offset if exporting for a sub-clip
) -> str:
    """
    Write an ASS subtitle file with per-word karaoke highlighting.

    Each word is highlighted in yellow as it is spoken; the rest of the line
    stays white. This is achieved with ASS \\kf (fill karaoke) tags.

    Parameters
    ----------
    words      : word list (can be pre-filtered to clip window)
    ass_path   : output file path
    words_per_line : how many words per subtitle line
    clip_start : subtract this many seconds from all timestamps (for sub-clips)

    Returns
    -------
    ass_path
    """
    ensure_dir(os.path.dirname(ass_path))

    header = ASS_HEADER.format(
        w=config.SHORT_WIDTH,
        h=config.SHORT_HEIGHT,
        font=config.CAPTION_FONT,
        size=config.CAPTION_FONT_SIZE,
        primary=config.CAPTION_COLOR,
        highlight=config.CAPTION_HIGHLIGHT,
        outline=config.CAPTION_OUTLINE,
        bold="-1" if config.CAPTION_BOLD else "0",
        marginv=config.CAPTION_MARGIN_V,
    )

    groups = [words[i:i+words_per_line] for i in range(0, len(words), words_per_line)]

    dialogue_lines = []
    for group in groups:
        line_start = group[0].start  - clip_start
        line_end   = group[-1].end   - clip_start

        if line_end <= 0:
            continue

        # Build karaoke text: {\kf<centiseconds>}word
        parts = []
        for w in group:
            duration_cs = max(1, int((w.end - w.start) * 100))
            parts.append(f"{{\\kf{duration_cs}}}{w.word}")

        text = " ".join(parts)
        dialogue_lines.append(
            f"Dialogue: 0,{_ass_ts(max(0, line_start))},{_ass_ts(max(0, line_end))},"
            f"Default,,0,0,0,,{text}"
        )

    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(dialogue_lines))

    log.info(f"ASS subtitles written → {ass_path}")
    return ass_path


# ─────────────────────────────────────────────────────────────
# Clip-scoped helpers
# ─────────────────────────────────────────────────────────────

def words_in_window(words: List[WordEntry], start: float, end: float) -> List[WordEntry]:
    """Return only the words that fall within [start, end]."""
    return [w for w in words if w.end > start and w.start < end]

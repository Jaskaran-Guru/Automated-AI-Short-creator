from __future__ import annotations
import json
import os
from typing import List, Dict, Optional

from modules.utils import log, run_ffprobe, run_ffmpeg, ensure_dir
import config


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────

def list_audio_tracks(video_path: str) -> List[Dict]:
    """
    Return a list of dicts describing each audio track:
        { index, codec, language, channels, title }
    """
    result = run_ffprobe([
        "-print_format", "json",
        "-show_streams",
        "-select_streams", "a",
        video_path
    ])
    data = json.loads(result.stdout or "{}")
    streams = data.get("streams", [])

    tracks = []
    for s in streams:
        tags = s.get("tags", {})
        tracks.append({
            "index":    s.get("index", 0),
            "codec":    s.get("codec_name", "unknown"),
            "language": tags.get("language", "und"),
            "channels": s.get("channels", 2),
            "title":    tags.get("title", ""),
        })
    return tracks


def extract_audio(
    video_path: str,
    output_wav: str,
    track_index: Optional[int] = None,
) -> str:
    """
    Extract an audio track from *video_path* as a 16 kHz mono WAV file.

    Parameters
    ----------
    video_path   : path to source video
    output_wav   : destination .wav path
    track_index  : ffmpeg stream index (from list_audio_tracks); None = first audio

    Returns
    -------
    output_wav path
    """
    ensure_dir(os.path.dirname(output_wav))

    if track_index is None:
        map_arg = "0:a:0"
    else:
        map_arg = f"0:{track_index}"

    log.info(f"Extracting audio track (stream {map_arg}) → {output_wav}")
    run_ffmpeg([
        "-i", video_path,
        "-map", map_arg,
        "-ac", "1",          # mono
        "-ar", "16000",      # 16 kHz (Whisper requirement)
        "-vn",               # no video
        output_wav,
    ], desc="extract audio")

    log.info("Audio extraction complete ✓")
    return output_wav


def select_audio_track(tracks: List[Dict], interactive: bool = True) -> Optional[int]:
    """
    If multiple tracks exist and interactive=True, prompt user to choose.
    Returns the stream index of the chosen track, or None for default (first).
    """
    if not tracks:
        log.warning("No audio tracks found in the video.")
        return None

    if len(tracks) == 1:
        t = tracks[0]
        log.info(f"Single audio track found: [{t['codec']}] lang={t['language']} ch={t['channels']}")
        return t["index"]

    # Multiple tracks
    if not interactive:
        log.info(f"Multiple audio tracks found; auto-selecting first (index {tracks[0]['index']}).")
        return tracks[0]["index"]

    print("\n──── Audio Tracks Found ────")
    for i, t in enumerate(tracks):
        title = f" | {t['title']}" if t["title"] else ""
        print(f"  [{i}] Stream {t['index']} | {t['codec']} | lang={t['language']} | {t['channels']}ch{title}")
    print()

    while True:
        choice = input(f"Select audio track [0-{len(tracks)-1}] (default=0): ").strip()
        if choice == "":
            return tracks[0]["index"]
        if choice.isdigit() and 0 <= int(choice) < len(tracks):
            return tracks[int(choice)]["index"]
        print("  Invalid choice, please try again.")

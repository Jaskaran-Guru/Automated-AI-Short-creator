from __future__ import annotations
import os
from typing import Optional, List

from modules.utils import log, run_ffmpeg, ensure_dir, seconds_to_hms
import config


# ─────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────

def _get_video_dimensions(video_path: str):
    """Return (width, height) of the video via ffprobe."""
    import subprocess, json
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_streams",
        "-select_streams", "v:0",
        video_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data   = json.loads(result.stdout or "{}")
    streams = data.get("streams", [{}])
    w = int(streams[0].get("width",  1920))
    h = int(streams[0].get("height", 1080))
    return w, h


def _compute_crop(
    src_w: int,
    src_h: int,
    target_w: int = config.SHORT_WIDTH,
    target_h: int = config.SHORT_HEIGHT,
    face_cx: Optional[float] = None,   # normalised 0–1
) -> str:
    """
    Build an FFmpeg crop+scale filter string to produce a vertical short.

    Strategy:
    1. Scale source so its height fills target_h (letterbox → pillarbox approach).
    2. Pick a horizontal crop window centred on the detected face (or centre).
    3. If source is already portrait (taller than wide), crop from centre.
    """
    src_ratio    = src_w / src_h
    target_ratio = target_w / target_h   # 9:16 ≈ 0.5625

    if src_ratio >= target_ratio:
        # Landscape or square source → scale to height, then crop width
        scale_h = target_h
        scale_w = int(src_w * (target_h / src_h))

        # Determine horizontal crop offset
        if face_cx is not None:
            # Centre the crop around the face
            face_px   = int(face_cx * scale_w)
            crop_x    = face_px - target_w // 2
            crop_x    = max(0, min(crop_x, scale_w - target_w))
        else:
            crop_x = (scale_w - target_w) // 2

        # FFmpeg filter chain: scale then crop
        return (
            f"scale={scale_w}:{scale_h},"
            f"crop={target_w}:{target_h}:{crop_x}:0"
        )
    else:
        # Portrait source → scale to width, then crop height from centre
        scale_w = target_w
        scale_h = int(src_h * (target_w / src_w))
        crop_y  = (scale_h - target_h) // 2
        return (
            f"scale={scale_w}:{scale_h},"
            f"crop={target_w}:{target_h}:0:{crop_y}"
        )


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────

def cut_and_crop(
    video_path:  str,
    output_path: str,
    start_sec:   float,
    end_sec:     float,
    face_cx:     Optional[float] = None,   # primary face X (normalised)
    add_blur_bg: bool = True,
) -> str:
    """
    Trim *video_path* from start_sec → end_sec and reframe to 9:16 (1080×1920).

    Parameters
    ----------
    video_path  : source video file
    output_path : destination .mp4 file
    start_sec   : clip start in seconds
    end_sec     : clip end in seconds
    face_cx     : normalised horizontal face centre (from YOLO centroids); None = centre crop
    add_blur_bg : if True, adds a blurred full-frame background so no black bars appear

    Returns
    -------
    output_path
    """
    ensure_dir(os.path.dirname(output_path))
    src_w, src_h = _get_video_dimensions(video_path)
    duration = end_sec - start_sec

    log.info(
        f"  Cutting {seconds_to_hms(start_sec)} → {seconds_to_hms(end_sec)} "
        f"({duration:.1f}s)  face_cx={face_cx}"
    )

    crop_filter = _compute_crop(src_w, src_h, face_cx=face_cx)

    if add_blur_bg:
        # Technique: combine blurred full-frame background + sharp cropped foreground
        blur_filter = (
            f"scale={config.SHORT_WIDTH}:{config.SHORT_HEIGHT}:force_original_aspect_ratio=increase,"
            f"crop={config.SHORT_WIDTH}:{config.SHORT_HEIGHT},"
            f"boxblur=20:2"
        )
        vf = (
            f"[0:v]split=2[bg][fg];"
            f"[bg]{blur_filter}[blurred];"
            f"[fg]{crop_filter}[cropped];"
            f"[blurred][cropped]overlay=(W-w)/2:(H-h)/2"
        )
    else:
        vf = crop_filter

    run_ffmpeg([
        "-ss", str(start_sec),
        "-t",  str(duration),
        "-i",  video_path,
        "-vf", vf,
        "-r",  str(config.SHORT_FPS),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar",  "44100",
        "-movflags", "+faststart",
        output_path,
    ], desc=f"cut_crop {os.path.basename(output_path)}")

    log.info(f"  ✓ Saved: {output_path}")
    return output_path

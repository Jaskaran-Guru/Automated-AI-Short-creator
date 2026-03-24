from __future__ import annotations
import os
import io
import subprocess
from typing import List, Optional, Any

# heavy imports moved inside functions

from modules.utils import log, make_progress
import config


# ─────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────

def _load_clip_model():
    import torch
    import clip
    log.info(f"Loading CLIP model '{config.CLIP_MODEL_NAME}' on {config.DEVICE} …")
    model, preprocess = clip.load(config.CLIP_MODEL_NAME, device=config.DEVICE)
    model.eval()

    pos_tokens = clip.tokenize(config.CLIP_POSITIVE_PROMPTS).to(config.DEVICE)
    neg_tokens = clip.tokenize(config.CLIP_NEGATIVE_PROMPTS).to(config.DEVICE)
    with torch.no_grad():
        pos_feats = model.encode_text(pos_tokens).float()
        neg_feats = model.encode_text(neg_tokens).float()
        pos_feats /= pos_feats.norm(dim=-1, keepdim=True)
        neg_feats /= neg_feats.norm(dim=-1, keepdim=True)

    return model, preprocess, pos_feats, neg_feats


def _load_yolo_model():
    from ultralytics import YOLO
    log.info(f"Loading YOLO model '{config.YOLO_MODEL_NAME}' …")
    return YOLO(config.YOLO_MODEL_NAME)


# ─────────────────────────────────────────────────────────────
# Frame extraction via FFmpeg pipe
# ─────────────────────────────────────────────────────────────

def _extract_frames_pipe(video_path: str, fps: int = 1):
    from PIL import Image
    """
    Extract frames at *fps* frames/second using FFmpeg piped JPEG output.
    Returns a list of PIL Images.
    """
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-i", video_path,
        "-r", str(fps),
        "-f", "image2pipe",
        "-vcodec", "mjpeg",
        "-q:v", "5",
        "pipe:1",
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    raw, errs = proc.communicate()

    # JPEG frames are separated by the JPEG SOI/EOI markers
    frames: List[Image.Image] = []
    idx = 0
    while idx < len(raw):
        # Find next SOI (0xFF 0xD8)
        soi = raw.find(b"\xff\xd8", idx)
        if soi == -1:
            break
        # Find EOI (0xFF 0xD9) after SOI
        eoi = raw.find(b"\xff\xd9", soi)
        if eoi == -1:
            break
        jpeg_data = raw[soi:eoi + 2]
        try:
            img = Image.open(io.BytesIO(jpeg_data)).convert("RGB")
            frames.append(img)
        except Exception:
            pass
        idx = eoi + 2

    log.info(f"Extracted {len(frames)} frames at {fps} fps")
    return frames


# ─────────────────────────────────────────────────────────────
# Individual scorers
# ─────────────────────────────────────────────────────────────

def _clip_scores(
    frames: List,
    model,
    preprocess,
    pos_feats,
    neg_feats,
) -> Any:
    import numpy as np
    import torch
    """Score each frame: positive CLIP similarity minus negative similarity."""
    scores = []
    with torch.no_grad():
        for img in frames:
            tensor = preprocess(img).unsqueeze(0).to(config.DEVICE)
            feat   = model.encode_image(tensor).float()
            feat  /= feat.norm(dim=-1, keepdim=True)

            pos_sim = (feat @ pos_feats.T).mean().item()
            neg_sim = (feat @ neg_feats.T).mean().item()
            scores.append(max(0.0, pos_sim - neg_sim))
    return np.array(scores, dtype=np.float32)


def _yolo_scores(frames: List, model) -> Any:
    import numpy as np
    """Score each frame by number of detected faces & prominent objects."""
    scores = []
    for img in frames:
        results = model(img, verbose=False)
        # Count detections; weigh by confidence
        detections = results[0].boxes
        if len(detections) == 0:
            scores.append(0.0)
        else:
            conf_sum = float(detections.conf.sum().item())
            # Normalise to ~[0,1] (saturate at 5 high-conf detections)
            scores.append(min(1.0, conf_sum / 5.0))
    return np.array(scores, dtype=np.float32)


def _audio_energy_scores(audio_path: str, total_seconds: int) -> Any:
    import numpy as np
    import librosa
    """Return per-second RMS energy of the audio, normalised to [0,1]."""
    y, sr = librosa.load(audio_path, sr=None, mono=True)
    frame_length = sr  # 1 second
    hop_length   = sr

    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
    # Trim or pad to match total_seconds
    rms = rms[:total_seconds]
    if len(rms) < total_seconds:
        rms = np.pad(rms, (0, total_seconds - len(rms)))

    max_rms = rms.max()
    if max_rms > 0:
        rms = rms / max_rms
    return rms.astype(np.float32)


# ─────────────────────────────────────────────────────────────
# Face centroid (used by video_cutter for smart crop)
# ─────────────────────────────────────────────────────────────

def get_face_centroids(frames: List, yolo_model) -> List[Optional[float]]:
    """
    For each frame return the X-coordinate of the primary face centroid
    (normalised 0.0–1.0 of frame width), or None if no face detected.
    """
    centroids = []
    for img in frames:
        results = yolo_model(img, verbose=False)
        boxes   = results[0].boxes
        if len(boxes) == 0:
            centroids.append(None)
        else:
            # Take the highest-confidence detection
            best_idx = int(boxes.conf.argmax())
            x1, y1, x2, y2 = boxes.xyxy[best_idx].tolist()
            cx = ((x1 + x2) / 2) / img.width
            centroids.append(cx)
    return centroids


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────

class ScoreResult:
    def __init__(
        self,
        composite:  Any,
        clip_raw:   Any,
        yolo_raw:   Any,
        audio_raw:  Any,
        centroids:  List[Optional[float]],
    ):
        self.composite  = composite
        self.clip_raw   = clip_raw
        self.yolo_raw   = yolo_raw
        self.audio_raw  = audio_raw
        self.centroids  = centroids   # per-second face X position


def score_video(
    video_path: str,
    audio_path: str,
    use_clip:   bool = True,
    use_yolo:   bool = True,
) -> ScoreResult:
    """
    Full scoring pipeline. Returns a ScoreResult with per-second composite scores.

    Falls back gracefully:
    - If CLIP fails (e.g. GPU OOM), disables it and redistributes weight.
    - If YOLO fails, disables it similarly.
    """
    log.info("=== Scene Scoring ===")

    import numpy as np
    import torch
    frames = _extract_frames_pipe(video_path, fps=config.FRAME_SAMPLE_RATE)
    total  = len(frames)

    # ── Audio Energy (always available) ──────────────────────
    log.info("Computing audio energy …")
    audio_scores = _audio_energy_scores(audio_path, total)

    clip_scores  = np.zeros(total, dtype=np.float32)
    yolo_scores  = np.zeros(total, dtype=np.float32)
    centroids    = [None] * total

    w_clip  = config.SCORE_WEIGHT_CLIP  if use_clip  else 0.0
    w_yolo  = config.SCORE_WEIGHT_YOLO  if use_yolo  else 0.0
    w_audio = config.SCORE_WEIGHT_AUDIO

    # ── CLIP ─────────────────────────────────────────────────
    if use_clip:
        try:
            log.info("Computing CLIP scores …")
            clip_model, preprocess, pos_feats, neg_feats = _load_clip_model()
            clip_scores = _clip_scores(frames, clip_model, preprocess, pos_feats, neg_feats)
            del clip_model  # free VRAM
            torch.cuda.empty_cache() if config.DEVICE == "cuda" else None
        except Exception as e:
            log.warning(f"CLIP scoring failed ({e}); skipping. Redistributing weight.")
            use_clip = False
            w_clip   = 0.0

    # ── YOLO ─────────────────────────────────────────────────
    if use_yolo:
        try:
            log.info("Computing YOLO visual activity scores …")
            yolo_model  = _load_yolo_model()
            yolo_scores = _yolo_scores(frames, yolo_model)
            centroids   = get_face_centroids(frames, yolo_model)
            del yolo_model
        except Exception as e:
            log.warning(f"YOLO scoring failed ({e}); skipping. Redistributing weight.")
            use_yolo = False
            w_yolo   = 0.0

    # ── Normalise weights ─────────────────────────────────────
    total_w = w_clip + w_yolo + w_audio
    if total_w == 0:
        total_w = 1.0   # shouldn't happen, but guard against /0
    w_clip  /= total_w
    w_yolo  /= total_w
    w_audio /= total_w

    composite = w_clip * clip_scores + w_yolo * yolo_scores + w_audio * audio_scores
    log.info("Scene scoring complete ✓")

    return ScoreResult(
        composite=composite,
        clip_raw=clip_scores,
        yolo_raw=yolo_scores,
        audio_raw=audio_scores,
        centroids=centroids,
    )

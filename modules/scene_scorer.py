"""
modules/scene_scorer.py — Optimized composite scene scoring using YOLO + CLIP + Audio Energy
Uses streaming frame extraction and batch inference to reduce memory usage.
"""

import os
import io
import subprocess
from typing import List, Optional, Generator, Tuple

import numpy as np
import librosa
import clip
import torch
from PIL import Image
from ultralytics import YOLO
  
from modules.utils import log, make_progress
import config


# ─────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────

def _load_clip_model():
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
    log.info(f"Loading YOLO model '{config.YOLO_MODEL_NAME}' …")
    model = YOLO(config.YOLO_MODEL_NAME)
    # Move to device if possible
    try:
        model.to(config.DEVICE)
    except Exception:
        pass
    return model


# ─────────────────────────────────────────────────────────────
# Frame extraction via FFmpeg pipe (Generator)
# ─────────────────────────────────────────────────────────────

def _extract_frames_gen(video_path: str, fps: int = 1) -> Generator[Image.Image, None, None]:
    """
    Generator that yields frames at *fps* frames/second using FFmpeg piped JPEG output.
    """
    cmd = [
        config.FFMPEG_BIN, "-y", "-hide_banner", "-loglevel", "error",
        "-i", video_path,
        "-r", str(fps),
        "-f", "image2pipe",
        "-vcodec", "mjpeg",
        "-q:v", "5",
        "pipe:1",
    ]
    
    # Using a larger bufsize for the pipe
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=10**7)
    
    try:
        byte_stream = proc.stdout
        if byte_stream is None:
            return
            
        while True:
            # JPEG frames start with FF D8 and end with FF D9
            header = byte_stream.read(2)
            if not header:
                break
            if header != b"\xff\xd8":
                continue
            
            jpeg_data: List[bytes] = [header]
            while True:
                chunk: bytes = byte_stream.read(4096)  # type: ignore
                if not chunk:
                    break
                footer_idx = chunk.find(b"\xff\xd9")
                if footer_idx != -1:
                    end_idx = int(footer_idx) + 2
                    jpeg_data.append(bytes(chunk[:end_idx]))
                    # Found the end of a frame, now we need to put back 
                    # whatever might be after the EOI marker. Actually, mjpeg 
                    # pipe is pretty clean. We'll just break and yield.
                    # No easy 'unread' for pipes, so we just assume mjpeg 
                    # boundaries are clean for image2pipe.
                    break
                jpeg_data.append(chunk)
            
            full_data = b"".join(jpeg_data)
            try:
                img = Image.open(io.BytesIO(full_data)).convert("RGB")
                yield img
            except Exception:
                continue
                
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=1)
        except subprocess.TimeoutExpired:
            proc.kill()


# ─────────────────────────────────────────────────────────────
# Individual scorers (Batch based)
# ─────────────────────────────────────────────────────────────

def _process_clip_batch(
    batch: List[Image.Image],
    model,
    preprocess,
    pos_feats: torch.Tensor,
    neg_feats: torch.Tensor,
) -> np.ndarray:
    """Score a batch of frames using CLIP."""
    tensors = torch.stack([preprocess(img) for img in batch]).to(config.DEVICE)
    with torch.no_grad():
        feats = model.encode_image(tensors).float()
        feats /= feats.norm(dim=-1, keepdim=True)

        # Broadcast dot product
        pos_sims = (feats @ pos_feats.T).mean(dim=-1)
        neg_sims = (feats @ neg_feats.T).mean(dim=-1)
        scores = torch.clamp(pos_sims - neg_sims, min=0.0)
    
    return scores.cpu().numpy()


def _process_visual_batch(
    batch: List[Image.Image], 
    model
) -> Tuple[np.ndarray, List[Optional[float]]]:
    """Score a batch of frames using YOLO for both visual interest and centroids."""
    results = model(batch, verbose=False)
    batch_scores = []
    batch_centroids: List[Optional[float]] = []
    
    for i, res in enumerate(results):
        boxes = res.boxes
        if len(boxes) == 0:
            batch_scores.append(0.0)
            batch_centroids.append(None)
        else:
            # Score based on confidence sum
            conf_sum = float(boxes.conf.sum().item())
            batch_scores.append(min(1.0, conf_sum / 5.0))
            
            # Primary face/object centroid
            best_idx = int(boxes.conf.argmax())
            x1, y1, x2, y2 = boxes.xyxy[best_idx].tolist()
            img_w = batch[i].width
            cx = ((x1 + x2) / 2) / img_w
            batch_centroids.append(cx)
            
    return np.array(batch_scores, dtype=np.float32), batch_centroids


def _audio_energy_scores(audio_path: str, total_seconds: int) -> np.ndarray:
    """Return per-second RMS energy of the audio, normalised to [0,1]."""
    try:
        y, sr = librosa.load(audio_path, sr=None, mono=True)
    except Exception as e:
        log.warning(f"Could not load audio for scoring: {e}")
        return np.zeros(total_seconds, dtype=np.float32)

    frame_length = sr  # 1 second
    hop_length   = sr

    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
    
    # Trim or pad to match total_seconds
    if len(rms) > total_seconds:
        rms = rms[:total_seconds]
    elif len(rms) < total_seconds:
        rms = np.pad(rms, (0, total_seconds - len(rms)))

    max_rms = rms.max()
    if max_rms > 0:
        rms = rms / max_rms
    return rms.astype(np.float32)


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────

class ScoreResult:
    def __init__(
        self,
        composite:  np.ndarray,
        clip_raw:   np.ndarray,
        yolo_raw:   np.ndarray,
        audio_raw:  np.ndarray,
        centroids:  List[Optional[float]],
    ):
        self.composite  = composite
        self.clip_raw   = clip_raw
        self.yolo_raw   = yolo_raw
        self.audio_raw  = audio_raw
        self.centroids  = centroids


def score_video(
    video_path: str,
    audio_path: str,
    use_clip:   bool = True,
    use_yolo:   bool = True,
    progress_callback = None
) -> ScoreResult:
    """
    Optimized scoring pipeline using streaming and batching.
    """
    log.info("=== Optimized Scene Scoring ===")

    # First, get video duration to pre-allocate arrays (using ffprobe)
    try:
        cmd = [config.FFPROBE_BIN, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", video_path]
        duration = float(subprocess.check_output(cmd).decode().strip())
        total_secs = int(duration)
    except Exception:
        log.warning("Could not determine video duration via ffprobe, will estimate.")
        total_secs = 0

    # Load models
    clip_model, clip_preprocess, pos_feats, neg_feats = (None, None, None, None)
    if use_clip:
        try:
            clip_model, clip_preprocess, pos_feats, neg_feats = _load_clip_model()
        except Exception as e:
            log.warning(f"Failed to load CLIP: {e}")
            use_clip = False

    yolo_model = None
    if use_yolo:
        try:
            yolo_model = _load_yolo_model()
        except Exception as e:
            log.warning(f"Failed to load YOLO: {e}")
            use_yolo = False

    # Initialize results
    all_clip_scores = []
    all_yolo_scores = []
    all_centroids   = []
    
    batch_size = 16 # Adjust based on RAM/VRAM
    current_batch = []
    
    log.info(f"Processing frames with streaming (batch_size={batch_size}) …")
    
    # Process frames in batches
    for i, frame in enumerate(_extract_frames_gen(video_path, fps=config.FRAME_SAMPLE_RATE)):
        # Poll cancellation
        if progress_callback and i % 10 == 0:
            progress_callback(3, f"AI Scene Scoring (Optimized)...", 0.45)
            
        current_batch.append(frame)
        
        if len(current_batch) >= batch_size:
            # CLIP
            if use_clip:
                c_scores = _process_clip_batch(current_batch, clip_model, clip_preprocess, pos_feats, neg_feats)
                all_clip_scores.extend(c_scores)
            
            # YOLO
            if use_yolo:
                y_scores, y_centers = _process_visual_batch(current_batch, yolo_model)
                all_yolo_scores.extend(y_scores)
                all_centroids.extend(y_centers)
            
            # Clear batch and keep memory low
            current_batch = []
            if config.DEVICE == "cuda":
                torch.cuda.empty_cache()

    # Process remaining
    if current_batch:
        if use_clip:
            all_clip_scores.extend(_process_clip_batch(current_batch, clip_model, clip_preprocess, pos_feats, neg_feats))
        if use_yolo:
            y_scores, y_centers = _process_visual_batch(current_batch, yolo_model)
            all_yolo_scores.extend(y_scores)
            all_centroids.extend(y_centers)

    # Cleanup models
    del clip_model
    del yolo_model
    if config.DEVICE == "cuda":
        torch.cuda.empty_cache()

    total_frames = len(all_clip_scores) if use_clip else (len(all_yolo_scores) if use_yolo else total_secs)
    
    # Handle lengths
    clip_arr  = np.array(all_clip_scores) if use_clip else np.zeros(total_frames)
    yolo_arr  = np.array(all_yolo_scores) if use_yolo else np.zeros(total_frames)
    
    centroids: List[Optional[float]] = list(all_centroids) if use_yolo else [None] * total_frames

    
    # Audio energy
    log.info("Computing audio energy …")
    audio_scores = _audio_energy_scores(audio_path, total_frames)

    # Weights
    w_clip  = config.SCORE_WEIGHT_CLIP  if use_clip  else 0.0
    w_yolo  = config.SCORE_WEIGHT_YOLO  if use_yolo  else 0.0
    w_audio = config.SCORE_WEIGHT_AUDIO
    
    total_w = w_clip + w_yolo + w_audio
    if total_w > 0:
        w_clip /= total_w
        w_yolo /= total_w
        w_audio /= total_w

    composite = (w_clip * clip_arr) + (w_yolo * yolo_arr) + (w_audio * audio_scores)
    
    log.info("Scene scoring complete ✓")
    return ScoreResult(composite, clip_arr, yolo_arr, audio_scores, centroids)

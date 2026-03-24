"""
pipeline.py — Orchestrates the full AI Video Shorts creation pipeline.
"""
from __future__ import annotations

from modules.utils import (
    log, console, make_progress, check_ffmpeg,
    ensure_dir, clean_temp, format_duration
)
import config


# ─────────────────────────────────────────────────────────────
# Pipeline
# ─────────────────────────────────────────────────────────────

def run(
    video_path:      str,
    num_shorts:      int,
    clip_duration:   int,         # seconds
    output_dir:      str,
    whisper_model:   str          = None,
    caption_style:   str          = None,
    interactive:     bool         = True,
    keep_temp:       bool         = False,
) -> list[str]:
    """
    Run the full pipeline end-to-end.
    """
    import os
    import time
    from typing import Optional

    # Stage modules (Lazy Load)
    from modules.audio_extractor import list_audio_tracks, select_audio_track, extract_audio
    from modules.transcriber     import transcribe, words_to_srt
    from modules.scene_scorer    import score_video
    from modules.scene_selector  import select_clips
    from modules.video_cutter    import cut_and_crop
    from modules.caption_renderer import render_captions

    if whisper_model is None: whisper_model = config.WHISPER_MODEL
    if caption_style is None: caption_style = config.CAPTION_STYLE

    t0 = time.time()

    # ── Validate ─────────────────────────────────────────────
    check_ffmpeg()
    if not os.path.isfile(video_path):
        raise FileNotFoundError(f"Video not found: {video_path}")
    if not (1 <= num_shorts <= config.MAX_SHORTS):
        raise ValueError(f"num_shorts must be 1–{config.MAX_SHORTS}")

    ensure_dir(output_dir)

    # All temp files go here
    temp_dir = os.path.join(output_dir, ".temp_pipeline")
    ensure_dir(temp_dir)

    console.print(
        f"AI Video Shorts Creator\n\n"
        f"  Input  : {video_path}\n"
        f"  Shorts : {num_shorts} × {clip_duration}s\n"
        f"  Output : {output_dir}\n"
        f"  Device : {config.get_device().upper()}  |  "
        f"Whisper: {whisper_model}"
    )

    # ── Stage 1: Audio extraction ─────────────────────────────
    console.rule("Stage 1 · Audio Extraction")
    tracks      = list_audio_tracks(video_path)
    track_index = select_audio_track(tracks, interactive=interactive)
    wav_path    = os.path.join(temp_dir, "audio.wav")
    extract_audio(video_path, wav_path, track_index=track_index)

    # ── Stage 2: Transcription ────────────────────────────────
    console.rule("Stage 2 · Whisper Transcription")
    words = transcribe(wav_path, model_name=whisper_model)

    # Write full SRT for reference alongside the output
    srt_path = os.path.join(output_dir, "full_transcript.srt")
    words_to_srt(words, srt_path)

    # ── Stage 3: Scene Scoring ────────────────────────────────
    console.rule("Stage 3 · AI Scene Scoring")
    score_result = score_video(
        video_path=video_path,
        audio_path=wav_path,
        use_clip=True,
        use_yolo=True,
    )

    # ── Stage 4: Clip Selection ────────────────────────────────
    console.rule("Stage 4 · Selecting Best Moments")
    clips = select_clips(
        scores=score_result.composite,
        num_clips=num_shorts,
        clip_duration=clip_duration,
    )

    if not clips:
        log.error("No clips could be selected. Aborting.")
        return []

    # Print selection table
    console.print("\nSelected Clips:")
    for i, (s, e) in enumerate(clips, 1):
        print(f"  #{i}: {s:.1f}s - {e:.1f}s ({format_duration(e - s)})")

    # ── Stage 5 & 6: Cut, Crop, Caption ───────────────────────
    console.rule("Stage 5 · Cutting, Cropping & Captioning")

    output_paths: list[str] = []
    raw_clips_dir  = os.path.join(temp_dir, "raw_clips")
    ass_dir        = os.path.join(temp_dir, "ass")
    ensure_dir(raw_clips_dir)
    ensure_dir(ass_dir)

    for i, (start_sec, end_sec) in enumerate(clips, 1):
        console.print(f"Short {i} / {len(clips)}")

        # Determine face centroid at the midpoint of the clip
        mid_sec = int((start_sec + end_sec) / 2)
        ctr_idx = min(mid_sec, len(score_result.centroids) - 1)
        face_cx: Optional[float] = score_result.centroids[ctr_idx]

        # --- Step A: Cut & smart-crop → vertical clip
        raw_path = os.path.join(raw_clips_dir, f"raw_short_{i:02d}.mp4")
        cut_and_crop(
            video_path=video_path,
            output_path=raw_path,
            start_sec=start_sec,
            end_sec=end_sec,
            face_cx=face_cx,
            add_blur_bg=True,
        )

        # --- Step B: Burn captions
        final_path = os.path.join(output_dir, f"short_{i:02d}.mp4")
        render_captions(
            clip_path=raw_path,
            output_path=final_path,
            words=words,
            clip_start=start_sec,
            clip_end=end_sec,
            ass_dir=ass_dir,
            style=caption_style,
        )
        output_paths.append(final_path)

    # ── Stage 7: Cleanup ──────────────────────────────────────
    if not keep_temp:
        clean_temp(temp_dir)

    elapsed = time.time() - t0

    # ── Summary ───────────────────────────────────────────────
    console.print(
        f"\nDone! Created {len(output_paths)} short(s) in {elapsed:.1f}s\n"
        + "\n".join(f"  {p}" for p in output_paths)
    )

    return output_paths

"""
pipeline.py — Orchestrates the full AI Video Shorts creation pipeline.

Stages:
  1. Validate input & check FFmpeg
  2. Extract audio (with multi-track selection)
  3. Transcribe with Whisper → word timestamps
  4. Score video frames (CLIP + YOLO + audio energy)
  5. Select best non-overlapping clip windows
  6. Cut + smart-crop each clip to 9:16
  7. Burn animated captions onto each clip
  8. Clean up temp files
"""

import os
import time
from typing import Dict, Any, Optional, List

from rich.panel import Panel
from rich.table import Table

from modules.utils import (
    log, console, make_progress, check_ffmpeg,
    ensure_dir, clean_temp, format_duration
)
from modules.audio_extractor import list_audio_tracks, select_audio_track, extract_audio
from modules.transcriber     import transcribe, words_to_srt, words_in_window
from modules.scene_scorer    import score_video
from modules.scene_selector  import select_clips
from modules.video_cutter    import cut_and_crop
from modules.caption_renderer import render_captions

import config


# ─────────────────────────────────────────────────────────────
# Pipeline
# ─────────────────────────────────────────────────────────────

def run(
    video_path:      str,
    num_shorts:      int,
    clip_duration:   int,         # seconds
    output_dir:      str,
    whisper_model:   str          = config.WHISPER_MODEL,
    caption_style:   str          = config.CAPTION_STYLE,
    interactive:     bool         = True,
    keep_temp:       bool         = False,
    progress_callback = None,      # Optional: fn(stage: int, status: str, progress: float)
) -> List[str]:
    """
    Run the full pipeline end-to-end.

    Returns
    -------
    List of paths to the generated short videos.
    """
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

    console.print(Panel(
        f"[bold cyan]AI Video Shorts Creator[/bold cyan]\n\n"
        f"  Input  : [yellow]{video_path}[/yellow]\n"
        f"  Shorts : [green]{num_shorts}[/green] × [green]{clip_duration}s[/green]\n"
        f"  Output : [yellow]{output_dir}[/yellow]\n"
        f"  Device : [magenta]{config.DEVICE.upper()}[/magenta]  |  "
        f"Whisper: [magenta]{whisper_model}[/magenta]",
        border_style="cyan",
    ))

    # ── Stage 1: Audio extraction ─────────────────────────────
    if progress_callback: progress_callback(1, "Extracting Audio...", 0.1)
    console.rule("[bold]Stage 1[/bold] · Audio Extraction")
    tracks      = list_audio_tracks(video_path)
    track_index = select_audio_track(tracks, interactive=interactive)
    wav_path    = os.path.join(temp_dir, "audio.wav")
    extract_audio(video_path, wav_path, track_index=track_index)

    # ── Stage 2: Transcription ────────────────────────────────
    if progress_callback: progress_callback(2, "Transcribing with Whisper...", 0.25)
    console.rule("[bold]Stage 2[/bold] · Whisper Transcription")
    words = transcribe(wav_path, model_name=whisper_model)

    # Write full SRT for reference alongside the output
    srt_path = os.path.join(output_dir, "full_transcript.srt")
    words_to_srt(words, srt_path)

    # ── Stage 3: Scene Scoring ────────────────────────────────
    if progress_callback: progress_callback(3, "AI Scene Scoring (Optimized)...", 0.45)
    console.rule("[bold]Stage 3[/bold] · AI Scene Scoring")
    score_result = score_video(
        video_path=video_path,
        audio_path=wav_path,
        use_clip=True,
        use_yolo=True,
        progress_callback=progress_callback
    )

    # ── Stage 4: Clip Selection ────────────────────────────────
    if progress_callback: progress_callback(4, "Selecting Best Moments...", 0.65)
    console.rule("[bold]Stage 4[/bold] · Selecting Best Moments")
    clips = select_clips(
        scores=score_result.composite,
        num_clips=num_shorts,
        clip_duration=clip_duration,
    )

    if not clips:
        log.error("No clips could be selected. Aborting.")
        return []

    # Print selection table
    table = Table(title="Selected Clips", border_style="cyan", show_lines=True)
    table.add_column("#",     style="bold cyan")
    table.add_column("Start", style="green")
    table.add_column("End",   style="green")
    table.add_column("Dur",   style="yellow")
    for i, (s, e) in enumerate(clips, 1):
        table.add_row(
            str(i),
            f"{s:.1f}s",
            f"{e:.1f}s",
            format_duration(e - s),
        )
    console.print(table)

    # ── Stage 5 & 6: Cut, Crop, Caption ───────────────────────
    if progress_callback: progress_callback(5, f"Creating {len(clips)} Shorts...", 0.8)
    console.rule("[bold]Stage 5[/bold] · Cutting, Cropping & Captioning")

    output_paths: List[str] = []
    raw_clips_dir  = os.path.join(temp_dir, "raw_clips")
    ass_dir        = os.path.join(temp_dir, "ass")
    ensure_dir(raw_clips_dir)
    ensure_dir(ass_dir)

    for i, (start_sec, end_sec) in enumerate(clips, 1):
        console.rule(f"[dim]Short {i} / {len(clips)}[/dim]")

        # Determine face centroid at the midpoint of the clip
        mid_sec = int((start_sec + end_sec) / 2)
        ctr_idx = min(mid_sec, len(score_result.centroids) - 1)
        face_cx: Optional[float] = score_result.centroids[ctr_idx]

        # --- Step A: Cut & smart-crop → vertical clip
        if progress_callback: progress_callback(5, f"Processing Short {i}/{len(clips)}: Cutting & Cropping", 0.8 + (i/len(clips)) * 0.1)
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
        if progress_callback: progress_callback(6, f"Processing Short {i}/{len(clips)}: Rendering Captions", 0.9 + (i/len(clips)) * 0.08)
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

    if progress_callback: progress_callback(7, "Cleanup & Finishing...", 0.99)

    # ── Stage 7: Cleanup ──────────────────────────────────────
    if not keep_temp:
        clean_temp(temp_dir)

    elapsed = time.time() - t0

    # ── Summary ───────────────────────────────────────────────
    console.print(Panel(
        f"[bold green]✓ Done![/bold green]  "
        f"Created [cyan]{len(output_paths)}[/cyan] short(s) in {elapsed:.1f}s\n\n"
        + "\n".join(f"  [yellow]{p}[/yellow]" for p in output_paths),
        border_style="green",
    ))

    return output_paths

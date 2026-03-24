from __future__ import annotations
from typing import List, Tuple
import numpy as np

from modules.utils import log, seconds_to_hms
import config


# ─────────────────────────────────────────────────────────────
# Types
# ─────────────────────────────────────────────────────────────

ClipWindow = Tuple[float, float]   # (start_sec, end_sec)


# ─────────────────────────────────────────────────────────────
# Core selector
# ─────────────────────────────────────────────────────────────

def select_clips(
    scores:         np.ndarray,
    num_clips:      int,
    clip_duration:  int,       # desired duration in seconds
    min_gap:        int = config.MIN_GAP_BETWEEN_CLIPS,
    fps:            int = config.FRAME_SAMPLE_RATE,
) -> List[ClipWindow]:
    """
    Select the top *num_clips* non-overlapping windows of width *clip_duration*
    from the scored timeline.

    Algorithm
    ---------
    1. Compute a sliding-window sum of length W = clip_duration * fps.
    2. Iterate through candidate windows in descending score order.
    3. Accept a window only if it does not overlap (respecting min_gap)
       with any already-accepted window.

    Parameters
    ----------
    scores        : 1-D array of per-second composite scores.
    num_clips     : number of shorts to generate.
    clip_duration : length of each short in seconds.
    min_gap       : minimum gap (seconds) between clip start positions.
    fps           : samples per second in the score array.

    Returns
    -------
    List of (start_sec, end_sec) tuples, sorted by start time.
    """
    W = clip_duration * fps     # window width in samples
    N = len(scores)

    if W >= N:
        log.warning(
            f"Video ({N}s) is shorter than or equal to clip duration ({clip_duration}s). "
            "Returning the entire video as a single clip."
        )
        return [(0.0, float(N / fps))]

    # Sliding window sum → average score per window
    window_sums = np.convolve(scores, np.ones(W, dtype=np.float32), mode="valid")
    window_avgs = window_sums / W

    # Candidate windows sorted by descending score
    sorted_starts = np.argsort(-window_avgs)   # descending

    selected: List[ClipWindow] = []
    blocked_intervals: List[ClipWindow] = []

    for start_sample in sorted_starts:
        if len(selected) >= num_clips:
            break

        start_sec = start_sample / fps
        end_sec   = start_sec + clip_duration

        # Check overlap with already-selected + gap buffer
        overlap = False
        for (s, e) in blocked_intervals:
            if start_sec < e + min_gap and end_sec > s - min_gap:
                overlap = True
                break

        if not overlap:
            selected.append((start_sec, end_sec))
            blocked_intervals.append((start_sec, end_sec))

    # Sort by start time for clean sequential output
    selected.sort(key=lambda x: x[0])

    for i, (s, e) in enumerate(selected, 1):
        log.info(f"  Clip {i}: {seconds_to_hms(s)} → {seconds_to_hms(e)}"
                 f"  (score={window_avgs[int(s * fps)]:.3f})")

    if len(selected) < num_clips:
        log.warning(
            f"Only found {len(selected)} non-overlapping clips "
            f"(requested {num_clips}). Try a longer video or shorter clip duration."
        )

    return selected

"""
main.py — CLI entry point for AI Video Shorts Creator
Supports both interactive (prompt-based) and non-interactive (flag-based) modes.
"""
from __future__ import annotations
import argparse
import os
import re
import sys
import os
# Force AI model caches to a local writable directory
_base_dir = os.path.dirname(os.path.abspath(__file__))
_cache_dir = os.path.join(_base_dir, ".cache")
os.environ["XDG_CACHE_HOME"] = _cache_dir
os.environ["WHISPER_CACHE_DIR"] = os.path.join(_cache_dir, "whisper")
os.makedirs(_cache_dir, exist_ok=True)
os.makedirs(os.environ["WHISPER_CACHE_DIR"], exist_ok=True)

# Simplified Console for broad compatibility
class SimpleConsole:
    def print(self, *args, **kwargs):
        import re
        msg = str(args[0]) if args else ""
        msg = re.sub(r"\[/?.*?\]", "", msg)
        print(msg)
    def rule(self, text=""): print(f"\n{'─'*10} {text} {'─'*10}")

console = SimpleConsole()

# ─────────────────────────────────────────────────────────────
# Path cleaner — handles PowerShell drag-and-drop quirks
# ─────────────────────────────────────────────────────────────

def clean_path(raw: str) -> str:
    """
    Normalize a file path entered by the user, handling:
      - PowerShell drag-drop:  & 'E:\\path\\file.mkv'
      - Quoted paths:          "E:\\path\\file.mkv"
      - Extra whitespace / trailing newlines
    """
    p = raw.strip()

    # PowerShell wraps drag-dropped paths as:  & 'path'  or  & "path"
    ps_match = re.match(r"^&\s*['\"](.+)['\"]$", p)
    if ps_match:
        return ps_match.group(1).strip()

    # Plain quoted paths (double or single quotes)
    if (p.startswith('"') and p.endswith('"')) or \
       (p.startswith("'") and p.endswith("'")):
        return p[1:-1].strip()

    return p


# ─────────────────────────────────────────────────────────────
# Interactive prompts (when running without flags)
# ─────────────────────────────────────────────────────────────

def prompt_input() -> dict:
    """Ask the user a series of questions and return a settings dict."""
    console.print("\n--- AI Video Shorts Creator ---")
    console.print("Powered by Whisper · CLIP · YOLO · FFmpeg\n")

    # ── Video path ────────────────────────────────────────────
    console.print("\nTip: You can drag & drop the video file directly into this window.")
    while True:
        raw        = input("\n📁  Video file path: ")
        video_path = clean_path(raw)
        console.print(f"  Resolved: {video_path}")
        if os.path.isfile(video_path):
            break
        console.print(f"  File not found: {video_path}  Please try again.")

    # ── Output folder ─────────────────────────────────────────
    default_out = os.path.join(os.path.dirname(os.path.abspath(video_path)), "output")
    out_input   = input(f"\n📂  Output folder [default: {default_out}]: ").strip().strip('"')
    output_dir  = out_input if out_input else default_out

    # ── Number of shorts ──────────────────────────────────────
    import config
    while True:
        n = input(f"\n🔢  How many shorts to create? [1-{config.MAX_SHORTS}]: ").strip()
        if n.isdigit() and 1 <= int(n) <= config.MAX_SHORTS:
            num_shorts = int(n)
            break
        console.print(f"  Please enter a number between 1 and {config.MAX_SHORTS}.")

    # ── Duration ──────────────────────────────────────────────
    console.print("\n⏱️   Duration options:")
    durations = {1: 15, 2: 30, 3: 45, 4: 60}
    for k, v in durations.items():
        console.print(f"  [{k}] {v}s")
    console.print("  [5] Custom")
    while True:
        d = input("  Choice [1-5, default=2]: ").strip() or "2"
        if d in ("1", "2", "3", "4"):
            clip_duration = durations[int(d)]
            break
        if d == "5":
            cd = input("  Enter custom duration in seconds: ").strip()
            if cd.isdigit() and int(cd) > 0:
                clip_duration = int(cd)
                break
        console.print("  Invalid choice.")

    # ── Whisper model ─────────────────────────────────────────
    models = ["base", "small", "medium", "large", "large-v2"]
    console.print("\n🤖  Whisper model (larger = more accurate but slower):")
    for i, m in enumerate(models, 1):
        marker = " [default]" if m == config.WHISPER_MODEL else ""
        console.print(f"  [{i}] {m}{marker}")
    wm = input(f"  Choice [1-{len(models)}, default={models.index(config.WHISPER_MODEL)+1}]: ").strip()
    if wm.isdigit() and 1 <= int(wm) <= len(models):
        whisper_model = models[int(wm) - 1]
    else:
        whisper_model = config.WHISPER_MODEL

    # ── Caption style ─────────────────────────────────────────
    console.print("\n🎬  Caption style:")
    console.print("  [1] word_highlight  — one word highlighted per beat (TikTok style)")
    console.print("  [2] full_line       — full subtitle line at once")
    cs = input("  Choice [1-2, default=1]: ").strip() or "1"
    caption_style = "full_line" if cs == "2" else "word_highlight"

    return dict(
        video_path=video_path,
        output_dir=output_dir,
        num_shorts=num_shorts,
        clip_duration=clip_duration,
        whisper_model=whisper_model,
        caption_style=caption_style,
        interactive=True,
    )


# ─────────────────────────────────────────────────────────────
# Argument parser (non-interactive / batch mode)
# ─────────────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="python main.py",
        description="AI Video Shorts Creator — automatically cut best scenes as vertical shorts with captions.",
    )
    p.add_argument("--input",       "-i",  type=str,  help="Path to the source video file.")
    p.add_argument("--output",      "-o",  type=str,  help="Output directory (default: ./output)")
    p.add_argument("--num_shorts",  "-n",  type=int,  default=3,    help="Number of shorts to generate (default: 3)")
    p.add_argument("--duration",    "-d",  type=int,  default=30,   help="Duration of each short in seconds (default: 30)")
    
    import config
    p.add_argument("--model",       "-m",  type=str,  default=config.WHISPER_MODEL,
                   choices=["base", "small", "medium", "large", "large-v2"],
                   help="Whisper model size (default: small)")
    p.add_argument("--caption_style", type=str, default="word_highlight",
                   choices=["word_highlight", "full_line"],
                   help="Subtitle style (default: word_highlight)")
    p.add_argument("--no_interactive", action="store_true",
                   help="Skip interactive audio-track selection prompt.")
    p.add_argument("--keep_temp",    action="store_true",
                   help="Keep temporary files for debugging.")
    return p


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────

def main():
    parser = build_parser()
    args   = parser.parse_args()

    # If --input provided, use non-interactive mode
    if args.input:
        output_dir = args.output or os.path.join(
            os.path.dirname(os.path.abspath(args.input)), "output"
        )
        settings = dict(
            video_path=args.input,
            output_dir=output_dir,
            num_shorts=args.num_shorts,
            clip_duration=args.duration,
            whisper_model=args.model,
            caption_style=args.caption_style,
            interactive=not args.no_interactive,
        )
    else:
        # Fully interactive mode
        settings = prompt_input()

    # Run the pipeline
    import pipeline
    results = pipeline.run(
        video_path=settings["video_path"],
        num_shorts=settings["num_shorts"],
        clip_duration=settings["clip_duration"],
        output_dir=settings["output_dir"],
        whisper_model=settings["whisper_model"],
        caption_style=settings["caption_style"],
        interactive=settings.get("interactive", True),
        keep_temp=getattr(args, "keep_temp", False),
    )

    if not results:
        print("No shorts were generated.")
        sys.exit(1)

    print(f"\nAll done! {len(results)} short(s) saved.")


if __name__ == "__main__":
    main()

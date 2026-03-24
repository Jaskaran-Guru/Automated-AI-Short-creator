# AI Video Shorts Creator

> **AI-Based Video Automation System** | Python · Whisper · YOLO · CLIP · FFmpeg  
> Automatically cuts the *best moments* from any video and produces vertical short-form clips with burned-in animated captions — no manual editing needed.

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🎙️ **Speech Recognition** | OpenAI Whisper — any language, auto-detected |
| 🖼️ **Scene Scoring** | CLIP (semantic) + YOLOv8 (visual activity) + audio energy |
| ✂️ **Smart Cut** | Picks top-N non-overlapping best moments |
| 📱 **Vertical Format** | Auto-reframes to 9:16 (1080×1920) with face-centred crop + blur background |
| 💬 **Animated Captions** | Word-by-word karaoke-style highlight (TikTok style) |
| 🎵 **Multi-Audio** | Detects and lets you select from dual/multi audio tracks |
| ⚡ **GPU / CPU** | Automatically uses CUDA if available, falls back to CPU |

---

## 📦 Requirements

- Python ≥ 3.9
- FFmpeg (must be on PATH) → [Download here](https://ffmpeg.org/download.html)
- pip packages (see `requirements.txt`)

---

## 🚀 Setup

```bash
# 1. Clone / open the project folder
cd "d:\Projects\youtubeshorts\New folder"

# 2. Create a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. (GPU users) Install CUDA-enabled PyTorch instead:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

---

## 🎬 Usage

### Interactive Mode (recommended)
```bash
python main.py
```
You'll be prompted step-by-step for:
- Video file path  
- Output folder  
- Number of shorts (1–20)  
- Duration per short (15 / 30 / 45 / 60s or custom)  
- Whisper model size  
- Caption style

### Non-Interactive / Batch Mode
```bash
python main.py --input my_video.mp4 --num_shorts 3 --duration 30
```

**All flags:**
```
  -i / --input         Path to source video
  -o / --output        Output directory (default: video_dir/output)
  -n / --num_shorts    Number of shorts to generate (default: 3)
  -d / --duration      Duration of each short in seconds (default: 30)
  -m / --model         Whisper model: base|small|medium|large|large-v2 (default: small)
  --caption_style      word_highlight | full_line (default: word_highlight)
  --no_interactive     Skip audio-track selection prompt
  --keep_temp          Keep temp files for debugging
```

---

## 📁 Project Structure

```
├── main.py               # CLI entry point
├── pipeline.py           # Orchestrates all stages
├── config.py             # Global settings
├── requirements.txt
├── modules/
│   ├── audio_extractor.py  # Multi-track audio detection & extraction
│   ├── transcriber.py      # Whisper ASR → word timestamps, SRT, ASS
│   ├── scene_scorer.py     # CLIP + YOLO + librosa composite scoring
│   ├── scene_selector.py   # Sliding-window best-moment selection
│   ├── video_cutter.py     # Trim + 9:16 smart-crop with blur bg
│   ├── caption_renderer.py # Burn ASS karaoke captions with FFmpeg
│   └── utils.py            # Logging, progress bars, FFmpeg helpers
└── output/               # Generated shorts appear here
    ├── short_01.mp4
    ├── short_02.mp4
    └── full_transcript.srt
```

---

## ⚙️ Configuration (`config.py`)

You can tweak defaults without touching the source:

| Setting | Default | Description |
|---|---|---|
| `WHISPER_MODEL` | `"small"` | Whisper model size |
| `CLIP_MODEL_NAME` | `"ViT-B/32"` | CLIP backbone |
| `YOLO_MODEL_NAME` | `"yolov8n.pt"` | YOLO variant |
| `SCORE_WEIGHT_CLIP` | `0.40` | Weight of CLIP in composite score |
| `SCORE_WEIGHT_YOLO` | `0.35` | Weight of YOLO in composite score |
| `SCORE_WEIGHT_AUDIO` | `0.25` | Weight of audio energy |
| `SHORT_WIDTH/HEIGHT` | `1080 × 1920` | Output resolution |
| `CAPTION_STYLE` | `word_highlight` | Subtitle style |
| `CAPTION_FONT` | `Arial` | Caption font |

---

## 🔧 Troubleshooting

| Issue | Fix |
|---|---|
| `ffmpeg not found` | Install FFmpeg & add to PATH |
| CUDA OOM | Use a smaller Whisper model (`base`) or run on CPU |
| No words in clip | Video may be silent; captions will be skipped gracefully |
| Black bars in output | Set `add_blur_bg=True` in `video_cutter.cut_and_crop()` (default) |



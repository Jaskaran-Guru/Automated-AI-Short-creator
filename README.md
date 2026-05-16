# Virail

Virail is an AI-based video automation system designed to streamline the production of vertical short-form content. Utilizing advanced machine learning models and audio-visual processing, Virail automatically identifies the most engaging moments from long-form videos and reframes them into high-quality, 9:16 shorts complete with burned-in animated captions.

## Core Capabilities

* Speech Recognition: Employs OpenAI Whisper for accurate, multi-language speech-to-text generation and automatic language detection.
* Scene Scoring: Utilizes a composite scoring mechanism combining semantic relevance via CLIP, visual activity via YOLOv8, and audio energy analysis.
* Intelligent Extraction: Automatically selects the top non-overlapping moments to ensure maximum engagement.
* Format Optimization: Reframes content to 1080x1920 resolution, employing face-centered cropping and blurred background padding to eliminate black bars.
* Dynamic Captions: Generates word-by-word karaoke-style animated captions.
* Multi-Audio Track Processing: Automatically detects multiple audio tracks and allows for selective track extraction.
* Hardware Acceleration: Automatically scales to utilize CUDA-enabled GPUs for accelerated processing while maintaining CPU fallback capabilities.

## System Prerequisites

To ensure optimal performance and compatibility, verify that your environment meets the following requirements:

* Python: Version 3.9 or higher.
* FFmpeg: Installed and globally accessible via the system PATH environment variable.
* Hardware: A CUDA-enabled NVIDIA GPU is highly recommended for accelerated model inference.

## Installation Guide

Follow these steps to configure the Virail environment:

1. Clone the repository to your local machine and navigate to the project directory.
2. Initialize and activate a Python virtual environment to isolate project dependencies.
3. Install the required base dependencies executing the package installer with the requirements file.
4. For GPU acceleration, install the CUDA-compatible PyTorch distribution directly from the official PyTorch repository.

## Usage Instructions

Virail provides two modes of operation: interactive and non-interactive.

### Interactive Execution

Launch the primary script without arguments to enter interactive mode. The system will prompt you for necessary configuration details including the input video path, desired output directory, number of clips to generate, target duration for each clip, transcription model size, and caption styling preferences.

### Non-Interactive Execution

For automated workflows, you can supply all configuration parameters directly via command-line arguments. Key parameters include:
* input: Path to the source video file.
* output: Designated directory for the generated shorts.
* num_shorts: The total number of clips to produce.
* duration: The maximum length of each generated clip in seconds.
* model: The specific Whisper model variant to employ for transcription.

## Repository Structure

The architecture is modular, separating orchestration, configuration, and specialized processing modules:

* The root directory contains the entry point, the primary pipeline orchestrator, and the global configuration registry.
* The modules directory encapsulates discrete processing stages, including audio extraction, asynchronous transcription, composite scene scoring, algorithmic scene selection, FFmpeg-based video cutting, and subtitle rendering.

## Configuration Parameters

System behavior can be modified by adjusting variables within the configuration file. Notable parameters include model selection for Whisper, CLIP, and YOLO, as well as the relative weights assigned to semantic, visual, and audio scores during the scene evaluation phase. Output resolution and caption styling are also configurable.

## Troubleshooting

* FFmpeg Errors: Ensure the FFmpeg binary is correctly installed and its directory is appended to the system PATH.
* Memory Allocation Exceptions: If utilizing a GPU with limited VRAM, select a smaller Whisper model variant or execute the application using the CPU fallback mode.
* Uncaptioned Output: If the source video lacks audible speech, the system will bypass the captioning stage while still performing visual scene extraction.

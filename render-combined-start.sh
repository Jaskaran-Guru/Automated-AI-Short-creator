#!/usr/bin/env bash
# Exit on error
set -o errexit

# Export FFmpeg path
export PATH=$PATH:/opt/render/project/src/.render/ffmpeg

# Start Python Backend in background
# Render sets the $PORT environment variable
echo "Starting Python Backend..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT &

# Start Node.js Worker
echo "Starting Node.js Worker..."
cd frontend
npm run worker

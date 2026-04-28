#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Node dependencies
cd frontend
npm install

# Install FFmpeg (Render doesn't have it by default)
STORAGE_DIR=/opt/render/project/src/.render/ffmpeg
if [ ! -d "$STORAGE_DIR" ]; then
  mkdir -p $STORAGE_DIR
  cd $STORAGE_DIR
  curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar xJ --strip-components=1
  cd /opt/render/project/src
fi

# Generate Prisma Client
cd frontend
npx prisma generate

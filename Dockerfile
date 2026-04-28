# Use Python 3.10 slim as base
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (ignore if exists)
RUN id -u user >/dev/null 2>&1 || useradd -m -u 1000 user
ENV HOME=/home/user
ENV PATH=/home/user/.local/bin:$PATH
ENV XDG_CACHE_HOME=/app/.cache
ENV WHISPER_CACHE_DIR=/app/.cache/whisper
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend dependencies and install
COPY --chown=user frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
WORKDIR /app

# Copy the rest of the application
COPY --chown=user . .
RUN chown -R user:user /app

# Generate Prisma Client
WORKDIR /app/frontend
RUN npx prisma generate
WORKDIR /app
RUN mkdir -p /app/.cache && chown -R user:user /app/.cache

# Set environment variables
ENV PORT=7860
ENV PYTHONPATH=/app/backend

# Expose the port
EXPOSE 7860

# Create start script (as root)
RUN echo '#!/bin/bash\n\
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT &\n\
cd frontend && npm run worker\n\
' > /app/start.sh && chmod +x /app/start.sh

# Switch to the non-root user at the very end
USER user

# Start the application
CMD ["/app/start.sh"]

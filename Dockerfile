# Use Python 3.10 slim as base
FROM python:3.10-slim

# Install system dependencies (FFmpeg, Node.js, and ML libraries)
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 user
ENV HOME=/home/user
ENV PATH=/home/user/.local/bin:$PATH

# Set working directory
WORKDIR /app

# Copy and install dependencies as root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend dependencies and install
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
WORKDIR /app

# Copy the rest of the application and set ownership
COPY --chown=user . .

# Generate Prisma Client
WORKDIR /app/frontend
RUN npx prisma generate
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Switch to the non-root user
USER user

# Expose the port
EXPOSE 7860

# Start script
RUN echo '#!/bin/bash\n\
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT &\n\
cd frontend && npm run worker\n\
' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]

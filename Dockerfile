# Use Python 3.10 slim as base
FROM python:3.10-slim

# Install system dependencies (FFmpeg, Node.js, etc.)
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend dependencies and install
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
WORKDIR /app

# Copy the rest of the application
COPY . .

# Generate Prisma Client
WORKDIR /app/frontend
RUN npx prisma generate
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

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

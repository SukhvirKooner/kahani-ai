# FFmpeg Setup Guide

This backend uses FFmpeg to combine multiple video clips into a single video file. Follow these steps to set up FFmpeg on your system.

## Installation

### macOS (using Homebrew)

```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### Linux (CentOS/RHEL)

```bash
sudo yum install ffmpeg
```

### Windows

1. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract the archive
3. Add the `bin` folder to your system PATH

### Docker

If deploying with Docker, add this to your Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y ffmpeg
```

## Verify Installation

After installing, verify FFmpeg is available:

```bash
ffmpeg -version
```

You should see version information if FFmpeg is installed correctly.

## Environment Variables

Add the following to your `backend/.env` file:

```env
# Backend URL (for generating video links)
# For local development:
BACKEND_URL=http://localhost:5000

# For production (replace with your actual backend URL):
# BACKEND_URL=https://your-backend-domain.com
```

## How It Works

1. **Frontend sends video URLs** → `POST /api/videos/combine`
2. **Backend downloads videos** → Saves to temporary directory
3. **FFmpeg combines videos** → Creates single MP4 file with audio
4. **Backend saves to `public/videos/`** → Accessible via static route
5. **Backend returns URL** → `http://your-backend/videos/combined_xxx.mp4`
6. **Frontend displays video** → Uses the URL in `<video>` tag

## Directory Structure

The backend creates the following directories automatically:

```
backend/
├── temp/              # Temporary files (deleted after processing)
└── public/
    └── videos/        # Combined videos (served statically)
```

## Features

- ✅ **Preserves audio** - All audio tracks are maintained
- ✅ **High quality** - Uses codec copying (no re-encoding)
- ✅ **Fast processing** - Optimized for web playback
- ✅ **Automatic cleanup** - Temp files are removed after processing

## Troubleshooting

### Error: "FFmpeg not found"

Make sure FFmpeg is installed and available in your system PATH. You can check with:

```bash
which ffmpeg
```

### Error: "Permission denied"

Ensure the backend has write permissions to:
- `backend/temp/` directory
- `backend/public/videos/` directory

### Error: "Failed to download video"

Check that:
- Video URLs are accessible from the backend server
- URLs are valid and not expired
- Network connectivity is working

## Production Deployment

For production deployments:

1. **Install FFmpeg** on your server (see installation instructions above)
2. **Set BACKEND_URL** in your `.env` file to your production domain
3. **Ensure disk space** - Combined videos can be large
4. **Set up cleanup** - Consider a cron job to remove old videos:

```bash
# Remove videos older than 7 days
find backend/public/videos -name "combined_*.mp4" -mtime +7 -delete
```

## Rate Limiting

Video combining is rate-limited to prevent abuse:
- Uses the standard API rate limiter (100 requests per 15 minutes)

For higher limits, adjust `RATE_LIMIT_MAX_REQUESTS` in your `.env` file.


import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to store combined videos (accessible via static route)
const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
const TEMP_DIR = path.join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(VIDEOS_DIR, { recursive: true });
  await fs.mkdir(TEMP_DIR, { recursive: true });
}

/**
 * Combine multiple video URLs into a single video file
 * Returns a public URL to the combined video
 */
export const combineVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoUrls } = req.body;

    if (!videoUrls || !Array.isArray(videoUrls) || videoUrls.length === 0) {
      res.status(400).json({ 
        success: false,
        error: 'Video URLs array is required' 
      });
      return;
    }

    // Filter out empty/null URLs
    const validUrls = videoUrls.filter(url => url && url.trim() !== '');
    if (validUrls.length === 0) {
      res.status(400).json({ 
        success: false,
        error: 'No valid video URLs provided' 
      });
      return;
    }

    // If only one video, return it directly
    if (validUrls.length === 1) {
      res.json({
        success: true,
        videoUrl: validUrls[0]
      });
      return;
    }

    await ensureDirectories();

    // Create unique ID for this combination
    const combinationId = uuidv4();
    const tempDir = path.join(TEMP_DIR, combinationId);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Step 1: Download all videos
      console.log(`Downloading ${validUrls.length} videos...`);
      const videoPaths: string[] = [];
      
      for (let i = 0; i < validUrls.length; i++) {
        const videoUrl = validUrls[i];
        console.log(`Downloading video ${i + 1}/${validUrls.length}...`);
        
        try {
          const response = await fetch(videoUrl);
          if (!response.ok) {
            throw new Error(`Failed to download video ${i + 1}: ${response.statusText}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          const videoPath = path.join(tempDir, `video_${i}.mp4`);
          await fs.writeFile(videoPath, Buffer.from(arrayBuffer));
          videoPaths.push(videoPath);
        } catch (error: any) {
          console.error(`Error downloading video ${i + 1}:`, error);
          throw new Error(`Failed to download video ${i + 1}: ${error.message}`);
        }
      }

      // Step 2: Create concat file for FFmpeg
      const concatFile = path.join(tempDir, 'concat.txt');
      const concatContent = videoPaths
        .map(p => `file '${p.replace(/'/g, "'\\''")}'`) // Escape single quotes
        .join('\n');
      await fs.writeFile(concatFile, concatContent);

      // Step 3: Combine videos using FFmpeg
      const outputFileName = `combined_${combinationId}.mp4`;
      const outputPath = path.join(VIDEOS_DIR, outputFileName);

      console.log('Combining videos with FFmpeg...');
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(concatFile)
          .inputOptions(['-f', 'concat', '-safe', '0'])
          .videoCodec('copy') // Copy video codec (no re-encoding, faster)
          .audioCodec('copy') // Copy audio codec (preserves audio)
          .outputOptions(['-movflags', '+faststart']) // Optimize for web playback
          .output(outputPath)
          .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
          })
          .on('progress', (progress) => {
            if (progress.percent) {
              console.log(`Processing: ${progress.percent.toFixed(2)}% done`);
            }
          })
          .on('end', () => {
            console.log('Video combination completed');
            resolve();
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(new Error(`FFmpeg error: ${err.message}`));
          })
          .run();
      });

      // Step 4: Clean up temp files
      await fs.rm(tempDir, { recursive: true, force: true });

      // Step 5: Return public URL
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      const videoUrl = `${baseUrl}/videos/${outputFileName}`;

      res.json({
        success: true,
        videoUrl: videoUrl,
        message: 'Videos combined successfully'
      });

    } catch (error: any) {
      // Clean up on error
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up temp files:', cleanupError);
      }
      throw error;
    }

  } catch (error: any) {
    console.error('Error combining videos:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to combine videos' 
    });
  }
};


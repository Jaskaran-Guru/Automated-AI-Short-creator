import { Worker } from "bullmq";
import IORedis from "ioredis";
import { db } from "./lib/prisma";
import { extractAudio, cutClip, getVideoDuration } from "./lib/video-processor";
import { transcribeAudio, findViralMoments } from "./lib/ai-service";
import cloudinary from "./lib/cloudinary";
import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";

// Load environment variables if running directly
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

async function downloadFile(url: string, outputPath: string) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise<void>((resolve, reject) => {
    writer.on("finish", () => resolve());
    writer.on("error", (err) => reject(err));
  });
}

const worker = new Worker(
  "video-processing",
  async (job: any) => {
    const { projectId, videoUrl, numShorts, duration, captionStyle } = job.data;
    console.log(`[Job ${job.id}] Starting processing for project ${projectId}`);

    const tempDir = os.tmpdir();
    const videoPath = path.join(tempDir, `${job.id}_input.mp4`);
    const audioPath = path.join(tempDir, `${job.id}_audio.mp3`);

    try {
      // 1. Download Video
      console.log(`[Job ${job.id}] Downloading video...`);
      await downloadFile(videoUrl, videoPath);

      // 2. Extract Audio
      console.log(`[Job ${job.id}] Extracting audio...`);
      await extractAudio(videoPath, audioPath);

      // Verify and deduct usage
      const actualDuration = await getVideoDuration(videoPath);
      const consumedMinutes = Math.ceil(actualDuration / 60);

      const project = await db.project.findUnique({ 
        where: { id: projectId },
        include: { client: { include: { workspace: true } } }
      });

      if (project && project.client?.workspaceId) {
        await db.workspace.update({
          where: { id: project.client.workspaceId },
          data: { minutesUsed: { increment: consumedMinutes } }
        });
        await db.project.update({
          where: { id: projectId },
          data: { durationSeconds: Math.round(actualDuration) }
        });
      }

      // Retry wrapper for AI calls
      const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
        try {
          return await fn();
        } catch (error) {
          if (retries <= 1) throw error;
          console.warn(`[Job ${job.id}] Retrying AI call... (${retries - 1} left)`);
          await new Promise(r => setTimeout(r, 2000));
          return withRetry(fn, retries - 1);
        }
      };

      // 3. Transcribe Audio
      console.log(`[Job ${job.id}] Transcribing audio...`);
      const transcript = await withRetry(() => transcribeAudio(audioPath));

      // 4. Find Viral Moments
      console.log(`[Job ${job.id}] Finding viral moments...`);
      const moments = await withRetry(() => findViralMoments(transcript, numShorts));

      console.log(`[Job ${job.id}] Found ${moments.length} moments.`);

      // 5. Cut Clips & Upload
      for (let i = 0; i < moments.length; i++) {
        const moment = moments[i];
        console.log(`[Job ${job.id}] Cutting clip ${i + 1}/${moments.length}: ${moment.title}`);
        
        const clipPath = path.join(tempDir, `${job.id}_clip_${i}.mp4`);
        await cutClip(videoPath, clipPath, moment.startTime, moment.endTime, captionStyle);

        console.log(`[Job ${job.id}] Uploading clip ${i + 1}...`);
        const uploadResult = await cloudinary.uploader.upload(clipPath, {
          resource_type: "video",
          folder: `virail/clips/${projectId}`,
        });

        console.log(`[Job ${job.id}] Saving clip to database...`);
        await db.clip.create({
          data: {
            projectId,
            title: moment.title,
            startTime: moment.startTime,
            endTime: moment.endTime,
            score: moment.score,
            hookRewrite: moment.hookRewrite,
            ctaSuggestion: moment.ctaSuggestion,
            hashtags: moment.hashtags,
            captionText: moment.captionText,
            youtubeTitle: moment.youtubeTitle,
            tiktokHook: moment.tiktokHook,
            instagramCaption: moment.instagramCaption,
            bestPostingTime: moment.bestPostingTime,
            fileUrl: uploadResult.secure_url,
          },
        });

        // Cleanup clip
        if (fs.existsSync(clipPath)) fs.unlinkSync(clipPath);
      }

      // 6. Update Project Status
      console.log(`[Job ${job.id}] Completing project...`);
      await db.project.update({
        where: { id: projectId },
        data: { status: "COMPLETED" },
      });

      console.log(`[Job ${job.id}] Job completed successfully!`);

    } catch (error) {
      console.error(`[Job ${job.id}] Error:`, error);
      await db.project.update({
        where: { id: projectId },
        data: { 
          status: "FAILED",
          processingLog: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    } finally {
      // Cleanup temp files
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    }
  },
  { connection }
);

worker.on("ready", () => console.log("Worker is running and listening to 'video-processing' queue..."));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed with error:`, err));

// 7. Social Post Processing (Mock)
async function processScheduledPosts() {
  const now = new Date();
  try {
    const duePosts = await db.socialPost.findMany({
      where: {
        status: "SCHEDULED",
        scheduledFor: { lte: now }
      },
      include: {
        account: true
      }
    });

    for (const post of duePosts) {
      try {
        console.log(`[SocialPost ${post.id}] Processing for ${post.account.platform}...`);
        await db.socialPost.update({
          where: { id: post.id },
          data: { status: "PROCESSING" }
        });

        // Simulate publishing delay
        await new Promise(r => setTimeout(r, 3000));

        // Mock platform IDs
        const platformPostId = "p_" + Math.random().toString(36).substring(7);
        
        await db.socialPost.update({
          where: { id: post.id },
          data: { 
            status: "PUBLISHED",
            publishedUrl: `https://${post.account.platform.toLowerCase()}.com/post/${platformPostId}`,
            platformPostId
          }
        });
        console.log(`[SocialPost ${post.id}] Published successfully!`);
      } catch (error) {
        console.error(`[SocialPost ${post.id}] Failed:`, error);
        await db.socialPost.update({
          where: { id: post.id },
          data: { 
            status: "FAILED",
            errorLog: error instanceof Error ? error.message : "Unknown error"
          }
        });
      }
    }
  } catch (err) {
    console.error("Error in processScheduledPosts:", err);
  }
}

// Check every minute
setInterval(processScheduledPosts, 60000);

// Keep process alive
process.on("SIGINT", async () => {
  await worker.close();
  process.exit(0);
});

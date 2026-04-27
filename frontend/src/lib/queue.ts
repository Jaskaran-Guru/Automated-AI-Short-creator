import { Queue } from "bullmq";
import IORedis from "ioredis";

let connection: IORedis | null = null;
let videoQueue: Queue | null = null;

export function getConnection() {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

export function getVideoQueue() {
  if (!videoQueue) {
    videoQueue = new Queue("video-processing", { connection: getConnection() });
  }
  return videoQueue;
}

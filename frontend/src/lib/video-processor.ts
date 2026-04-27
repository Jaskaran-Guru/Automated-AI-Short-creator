import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function extractAudio(inputPath: string, outputPath: string) {
  const command = `ffmpeg -i "${inputPath}" -vn -acodec libmp3lame -y "${outputPath}"`;
  await execAsync(command);
}

export async function getVideoDuration(inputPath: string): Promise<number> {
  const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
  const { stdout } = await execAsync(command);
  return parseFloat(stdout.trim());
}

export async function cutClip(
  inputPath: string, 
  outputPath: string, 
  startTime: number, 
  endTime: number,
  captionStyle: string = "default"
) {
  const duration = endTime - startTime;
  
  // Basic clip and vertical crop (1080x1920)
  // We crop the center (1080px wide) from a 16:9 1920x1080 video
  const cropFilter = "crop=h=ih:w=ih*9/16";
  const scaleFilter = "scale=1080:1920";
  
  // Caption burning placeholder (requires a .ass or .srt file)
  // const subtitleFilter = `subtitles=captions.srt:force_style='Alignment=10,FontSize=24'`;
  
  const filterChain = `${cropFilter},${scaleFilter}`;
  
  const command = `ffmpeg -ss ${startTime} -i "${inputPath}" -t ${duration} -vf "${filterChain}" -c:v libx264 -crf 23 -preset veryfast -c:a copy -y "${outputPath}"`;
  
  await execAsync(command);
}

export const CAPTION_STYLES = {
  HORMOZI: "Alex Hormozi Bold",
  MINIMAL: "Clean Minimal",
  NEON: "Neon Viral",
  TIKTOK: "TikTok Pop",
  CLASSIC: "Subtitle Classic",
};

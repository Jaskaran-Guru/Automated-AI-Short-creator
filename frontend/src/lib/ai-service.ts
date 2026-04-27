import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import fs from "fs";
import { z } from "zod";

const MomentSchema = z.object({
  title: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  score: z.number(),
  hookRewrite: z.string().optional(),
  ctaSuggestion: z.string().optional(),
  hashtags: z.string().optional(),
  captionText: z.string().optional(),
  bestPostingTime: z.string().optional(),
  youtubeTitle: z.string().optional(),
  tiktokHook: z.string().optional(),
  instagramCaption: z.string().optional(),
});

const AIResponseSchema = z.object({
  moments: z.array(MomentSchema)
});

export async function transcribeAudio(audioPath: string) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });
    return transcription.text;
  } catch (error) {
    console.error("[WHISPER_ERROR]", error);
    return "";
  }
}

export async function findViralMoments(transcript: string, numShorts: number = 3) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze the following video transcript and find the top ${numShorts} most engaging, high-retention moments suitable for short-form content (TikTok/Reels/Shorts). 
        Return a JSON object with a 'moments' array. Each object in the array MUST have:
        'title' (string)
        'startTime' (number, in seconds)
        'endTime' (number, in seconds)
        'score' (number 0-100)
        'hookRewrite' (string, a catchy text hook for the video)
        'ctaSuggestion' (string, call to action text)
        'hashtags' (string, space-separated hashtags)
        'captionText' (string, engaging caption for the post)
        'bestPostingTime' (string, e.g. "Tuesday 6 PM EST")
        'youtubeTitle' (string, SEO-optimized title for YouTube Shorts)
        'tiktokHook' (string, high-energy text hook for TikTok)
        'instagramCaption' (string, aesthetic caption with emojis for Reels)
        
        Ensure moments are between 15-60 seconds.`
      },
      {
        role: "user",
        content: transcript
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) return [];
  
  try {
    const parsed = JSON.parse(content);
    // Standardize object format
    const toValidate = Array.isArray(parsed) ? { moments: parsed } : (parsed.moments ? parsed : { moments: [parsed] });
    
    // Validate with Zod
    const validated = AIResponseSchema.parse(toValidate);
    return validated.moments;
  } catch(e) {
    console.error("[JSON_PARSE_OR_ZOD_ERROR]", e);
    return [];
  }
}

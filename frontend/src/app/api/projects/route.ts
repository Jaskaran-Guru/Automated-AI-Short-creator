import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";
import { getVideoQueue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    const projects = await db.project.findMany({
      where: {
        workspaceId: workspace.id
      },
      include: {
        clips: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    const body = await req.json();
    const { videoUrl, name, numShorts, durationSeconds, captionStyle, estimatedDurationSeconds } = body;

    if (!videoUrl) {
      return new NextResponse("Video URL is required", { status: 400 });
    }

    // Pre-check limits
    const estimatedMinutes = Math.ceil((estimatedDurationSeconds || 60) / 60);
    if (workspace.minutesUsed + estimatedMinutes > workspace.minutesLimit) {
      return NextResponse.json(
        {
          error: "limit_exceeded",
          minutesUsed: workspace.minutesUsed,
          limit: workspace.minutesLimit,
          upgradeUrl: "/billing"
        },
        { status: 402 }
      );
    }

    const project = await db.project.create({
      data: {
        workspaceId: workspace.id,
        name: name || "New Project",
        originalVideoUrl: videoUrl,
        numShorts: parseInt(numShorts || "3", 10),
        durationSeconds: parseInt(durationSeconds || "30", 10),
        captionStyle: captionStyle || "Hormozi",
        status: "UPLOADING",
      },
    });

    // Enqueue the job for the worker to pick up
    try {
      if (!process.env.REDIS_URL) {
        console.warn("[QUEUE_WARNING] REDIS_URL not set. Video processing will not start automatically.");
      } else {
        const videoQueue = getVideoQueue();
        await videoQueue.add("process-video", {
          projectId: project.id,
          videoUrl,
          numShorts: project.numShorts,
          duration: project.durationSeconds,
          captionStyle: project.captionStyle,
        });
      }
    } catch (queueError) {
      console.error("[QUEUE_ADD_ERROR]", queueError);
      // Don't throw here, let the project creation succeed so the user isn't stuck
    }

    await db.project.update({
      where: { id: project.id },
      data: { status: "PROCESSING" }
    });

    return NextResponse.json(project);

  } catch (error) {
    console.error("[PROJECTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Fetch all clips for this workspace
    const clips = await db.clip.findMany({
      where: {
        project: { workspaceId: workspace.id }
      }
    });

    const clipsThisWeekCount = await db.clip.count({
      where: {
        project: { workspaceId: workspace.id },
        createdAt: { gte: oneWeekAgo }
      }
    });

    const totalClips = clips.length;

    const clipsWithScores = clips.filter(c => c.score !== null);
    const avgScore = clipsWithScores.length > 0 
      ? Math.round(clipsWithScores.reduce((acc, c) => acc + (c.score || 0), 0) / clipsWithScores.length)
      : 0;

    const processingProjectsCount = await db.project.count({
      where: {
        workspaceId: workspace.id,
        status: { in: ["PROCESSING", "UPLOADING"] }
      }
    });

    const totalScheduled = await db.socialPost.count({
      where: {
        client: { workspaceId: workspace.id },
        status: "SCHEDULED"
      }
    });

    const timeSavedMinutes = totalClips * 30;

    const stats = {
      totalClips,
      clipsThisWeek: clipsThisWeekCount,
      avgScore,
      processingJobs: processingProjectsCount,
      minutesUsed: workspace.minutesUsed,
      minutesLimit: workspace.minutesLimit,
      totalScheduled,
      timeSavedMinutes,
      referralCode: "VIR-SCALE", // Placeholder until Affiliate logic is fully integrated
      referralCount: 0,
      rewardCredits: 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[STATS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

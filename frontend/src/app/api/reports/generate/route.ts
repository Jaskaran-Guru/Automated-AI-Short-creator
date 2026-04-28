import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    // Aggregate stats for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const clipsCount = await db.clip.count({
      where: {
        createdAt: { gte: startOfMonth },
        project: { workspaceId: workspace.id }
      }
    });

    const scheduledPosts = await db.socialPost.count({
      where: {
        createdAt: { gte: startOfMonth },
        user: { clerkId }
      }
    });

    // Mock calculations for demo
    const timeSavedHours = clipsCount * 2; // Assuming 2 hours saved per clip
    const growthScore = Math.min(100, 70 + (clipsCount * 2));

    const reportData = {
      clipsGenerated: clipsCount,
      timeSavedHours,
      scheduledPosts,
      growthScore,
      creator: (await db.user.findUnique({ where: { clerkId } }))?.name || "User"
    };

    // Store or update report
    const report = await db.report.upsert({
      where: {
        shareToken: `report-${workspace.id}-${now.getMonth() + 1}-${now.getFullYear()}`
      },
      update: {
        data: reportData
      },
      create: {
        clientId: (await db.client.findFirst({ where: { workspaceId: workspace.id } }))?.id || "default", // Should handle this better in production
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        data: reportData,
        shareToken: `report-${workspace.id}-${now.getMonth() + 1}-${now.getFullYear()}`
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user || (user.systemRole !== "ADMIN" && user.systemRole !== "SUPER_ADMIN")) {
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    const totalUsers = await db.user.count();
    const totalProjects = await db.project.count();
    const totalClips = await db.clip.count();
    const totalPosts = await db.socialPost.count();
    
    const totalMinutes = await db.workspace.aggregate({
      _sum: { minutesUsed: true }
    });

    // Mock revenue based on plan distribution from workspaces
    const plans = await db.workspace.groupBy({
      by: ["plan"],
      _count: { id: true }
    });

    const revenue = plans.reduce((acc, p) => {
      if (p.plan === "STARTER") return acc + (p._count.id * 29);
      if (p.plan === "PRO") return acc + (p._count.id * 79);
      if (p.plan === "AGENCY_STARTER") return acc + (p._count.id * 149);
      if (p.plan === "AGENCY_GROWTH") return acc + (p._count.id * 299);
      if (p.plan === "AGENCY_PRO") return acc + (p._count.id * 599);
      return acc;
    }, 0);

    const recentWorkspaces = await db.workspace.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, plan: true, createdAt: true, minutesUsed: true }
    });

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalClips,
      totalPosts,
      totalMinutes: totalMinutes._sum.minutesUsed || 0,
      revenue,
      recentWorkspaces
    });
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

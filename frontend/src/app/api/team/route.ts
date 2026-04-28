import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: true
      },
      orderBy: { createdAt: "asc" }
    });

    const pendingInvites = await db.invite.findMany({
      where: { 
          workspaceId: workspace.id,
          acceptedAt: null,
          expiresAt: { gt: new Date() }
      }
    });

    return NextResponse.json({ members, pendingInvites });
  } catch (error) {
    console.error("[TEAM_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

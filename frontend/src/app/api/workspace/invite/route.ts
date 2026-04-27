import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    // Ensure the requester is an OWNER or ADMIN
    const user = await db.user.findUnique({ where: { clerkId } });
    const membership = await db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: user!.id
        }
      }
    });

    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Generate secure token
    const token = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    const invite = await db.invite.create({
      data: {
        email,
        role: role as Role,
        workspaceId: workspace.id,
        token,
        expiresAt
      }
    });

    // In production, we would send the email here
    console.log(`[AGENCY INVITE] Sent to ${email} for workspace ${workspace.name}. Token: ${token}`);

    return NextResponse.json(invite);
  } catch (error) {
    console.error("[INVITE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

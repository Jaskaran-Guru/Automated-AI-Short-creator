import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

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

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `You've been invited to join ${workspace.name} on Virail`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Team Invitation</h2>
            <p>You have been invited to join <strong>${workspace.name}</strong> as a <strong>${role}</strong>.</p>
            <p>Click the button below to accept the invitation and join the team:</p>
            <a href="${inviteUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Accept Invitation</a>
            <p style="margin-top: 40px; font-size: 12px; color: #666;">If you didn't expect this invitation, you can ignore this email.</p>
          </div>
        `
      });

      if (error) {
        console.error("[RESEND_ERROR]", error);
        return new NextResponse(`Email Error: ${error.message}`, { status: 500 });
      }

      console.log(`[AGENCY INVITE] Sent email to ${email} for workspace ${workspace.name}. Token: ${token}`);
    } else {
      console.log(`[AGENCY INVITE] Resend API key missing. Mock sent to ${email} for workspace ${workspace.name}. Token: ${token}`);
    }

    return NextResponse.json(invite);
  } catch (error) {
    console.error("[INVITE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

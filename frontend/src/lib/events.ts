import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export type VirailEvent = 
  | "signup_completed"
  | "project_created"
  | "video_uploaded"
  | "clips_generated"
  | "clip_downloaded"
  | "clip_renamed"
  | "clip_deleted"
  | "clip_scheduled"
  | "post_published"
  | "post_failed"
  | "title_selected"
  | "hook_copied"
  | "hashtag_copied"
  | "upgrade_clicked"
  | "upgraded_plan"
  | "canceled_plan"
  | "login_returned";

interface TrackEventProps {
  event: VirailEvent;
  workspaceId?: string;
  clientId?: string;
  projectId?: string;
  clipId?: string;
  metadata?: Record<string, any>;
}

/**
 * Tracks a user behavioral event in the VIRAIL Moat Engine.
 * Used for building recommendations and churn detection.
 */
export async function trackEvent({
  event,
  workspaceId,
  clientId,
  projectId,
  clipId,
  metadata = {}
}: TrackEventProps) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return;

    const user = await (db.user as any).findUnique({ where: { clerkId } });
    if (!user) return;

    await (db as any).eventLog.create({
      data: {
        userId: user.id,
        workspaceId,
        clientId,
        projectId,
        clipId,
        eventName: event,
        metadata,
      }
    });

    console.log(`[EVENT_TRACKED] ${event} for user ${user.id}`);
  } catch (error) {
    console.error("[EVENT_TRACKING_ERROR]", error);
  }
}

/**
 * Client-safe event logging (via API route)
 */
export async function trackClientEvent(props: TrackEventProps) {
    // In production, this would call /api/events
    return trackEvent(props);
}

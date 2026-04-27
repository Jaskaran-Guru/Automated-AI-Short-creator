import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Records an action in the workspace audit log.
 */
export async function logAction(
  action: string, 
  entity: string, 
  entityId?: string, 
  details?: string
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return;

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) return;

    await db.auditLog.create({
      data: {
        userId: user.id,
        action,
        entity,
        entityId,
        details
      }
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}

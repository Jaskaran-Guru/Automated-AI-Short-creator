import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

/**
 * Ensures the user has a default workspace and returns it.
 * This is the migration path for existing solo users.
 */
export async function ensureUserWorkspace(userId: string) {
  // Check if user has any workspace memberships
  const membership = await db.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: true }
  });

  if (membership) {
    return membership.workspace;
  }

  // If no workspace, create a default one for the solo user
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const workspace = await db.workspace.create({
    data: {
      name: `${user.name || "My"}'s Workspace`,
      slug: `workspace-${user.id.slice(-6)}`,
      members: {
        create: {
          userId: user.id,
          role: "OWNER"
        }
      }
    }
  });

  return workspace;
}

/**
 * Gets the current workspace for the authenticated user.
 * In a real SaaS, this might be determined by URL (slug) or session.
 * For Step 1, we fetch the first available workspace.
 */
export async function getCurrentWorkspace() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  let user = await db.user.findUnique({ where: { clerkId } });
  
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User",
      }
    });
  }

  return await ensureUserWorkspace(user.id);
}

/**
 * RBAC Helper: Checks if the user has a specific role in the workspace.
 */
export async function checkWorkspaceRole(workspaceId: string, allowedRoles: Role[]) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return false;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return false;

  const membership = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id
      }
    }
  });

  if (!membership) return false;
  return allowedRoles.includes(membership.role);
}

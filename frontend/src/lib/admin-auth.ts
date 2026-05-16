import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { AdminRole } from "@prisma/client";
import { redirect } from "next/navigation";


export async function getAdminContext() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.user.findUnique({
    where: { clerkId }
  });

  if (!user || !user.systemRole) return null;

  return user;
}


export async function protectAdminPage(allowedRoles: AdminRole[] = ["SUPER_ADMIN", "ADMIN"]) {
  const user = await getAdminContext();
  
  if (!user || !allowedRoles.includes(user.systemRole!)) {
    redirect("/dashboard");
  }

  return user;
}


export async function hasAdminRole(role: AdminRole) {
  const user = await getAdminContext();
  return user?.systemRole === role || user?.systemRole === "SUPER_ADMIN";
}

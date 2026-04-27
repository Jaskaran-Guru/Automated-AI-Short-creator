import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)",
  "/api/webhook/(.*)"
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // 1. Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // 2. Protect admin routes based on metadata role
  if (isAdminRoute(request)) {
    const metadata = (sessionClaims?.metadata || {}) as any;
    const role = metadata.role || metadata.systemRole;
    
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "SUPPORT") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

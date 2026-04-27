import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { platform } = await req.json();

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    // Mock successful connection
    const account = await db.socialAccount.create({
      data: {
        userId: dbUser.id,
        platform,
        accessToken: "mock_access_token_" + Math.random().toString(36).substring(7),
        refreshToken: "mock_refresh_token",
        username: platform.toLowerCase() + "_user_" + Math.random().toString(36).substring(7),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${platform}`,
        isActive: true,
      }
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("[ACCOUNTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const accounts = await db.socialAccount.findMany({
      where: {
        user: { clerkId: userId }
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("[ACCOUNTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

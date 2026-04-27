import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { clipId, accountId, scheduledFor, title, caption, hashtags, thumbnailUrl } = await req.json();

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const post = await db.socialPost.create({
      data: {
        userId: dbUser.id,
        clipId,
        accountId,
        scheduledFor: new Date(scheduledFor),
        title,
        caption,
        hashtags,
        thumbnailUrl,
        status: "SCHEDULED"
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_SCHEDULE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const posts = await db.socialPost.findMany({
      where: {
        user: { clerkId: userId }
      },
      include: {
        account: true
      },
      orderBy: {
        scheduledFor: "asc"
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { projectId, accountId, startDate } = await req.json();

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { clips: true }
    });

    if (!project) return new NextResponse("Project not found", { status: 404 });

    const account = await db.socialAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) return new NextResponse("Account not found", { status: 404 });

    const createdPosts = [];
    const baseDate = new Date(startDate);

    // Schedule one clip every 48 hours to avoid spamming
    for (let i = 0; i < project.clips.length; i++) {
      const clip = project.clips[i];
      const scheduledFor = new Date(baseDate);
      scheduledFor.setHours(baseDate.getHours() + (i * 48));

      const post = await db.socialPost.create({
        data: {
          userId: dbUser.id,
          clipId: clip.id,
          accountId,
          scheduledFor,
          title: clip.youtubeTitle || clip.title,
          caption: clip.instagramCaption || clip.captionText,
          hashtags: clip.hashtags,
          thumbnailUrl: clip.fileUrl,
          status: "SCHEDULED"
        }
      });
      createdPosts.push(post);
    }

    return NextResponse.json({ count: createdPosts.length });
  } catch (error) {
    console.error("[POSTS_BATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

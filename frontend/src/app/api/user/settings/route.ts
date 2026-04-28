import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerkId }
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { name } = await req.json();

    const user = await db.user.update({
      where: { clerkId },
      data: { name }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

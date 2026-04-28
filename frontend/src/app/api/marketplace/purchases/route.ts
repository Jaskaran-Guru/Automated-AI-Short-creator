import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerkId },
      include: { marketplacePurchases: true }
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    return NextResponse.json(user.marketplacePurchases);
  } catch (error) {
    console.error("[PURCHASES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

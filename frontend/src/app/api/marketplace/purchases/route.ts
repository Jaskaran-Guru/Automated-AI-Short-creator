import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { itemId, itemName, price } = await req.json();

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const purchase = await db.marketplacePurchase.upsert({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: itemId
        }
      },
      update: {
        itemName,
        price
      },
      create: {
        userId: user.id,
        itemId,
        itemName,
        price
      }
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.error("[PURCHASES_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

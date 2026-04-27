import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.workspaceId) {
      return new NextResponse("Workspace id is required", { status: 400 });
    }

    await db.subscription.create({
      data: {
        workspaceId: session.metadata.workspaceId,
        stripeCustomerId: subscription.customer as string,
        stripeSubId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.subscription.update({
      where: {
        stripeSubId: subscription.id,
      },
      data: {
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}

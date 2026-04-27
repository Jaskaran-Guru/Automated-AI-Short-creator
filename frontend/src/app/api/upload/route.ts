import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: `virail/uploads/${userId}` },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: `virail/uploads/${userId}`,
    });
  } catch (error) {
    console.error("[CLOUDINARY_SIGN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

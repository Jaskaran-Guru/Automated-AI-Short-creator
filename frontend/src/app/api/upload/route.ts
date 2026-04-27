import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// Maximum 50MB video via base64 (Vercel limit is 4.5MB for request body by default,
// so we use Cloudinary's server-side upload_stream which avoids body size limits)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Validate Cloudinary config is present
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
      console.error("[CLOUDINARY_CONFIG_MISSING] Cloudinary environment variables not set in Vercel!");
      return NextResponse.json(
        { error: "Upload service not configured. Please contact support." },
        { status: 503 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `virail/uploads/${userId}`;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("[CLOUDINARY_SIGN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/agency-context";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("[WORKSPACE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

    const project = await db.project.findUnique({
      where: {
        id: params.id,
        workspaceId: workspace.id,
      },
      include: {
        clips: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!project) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

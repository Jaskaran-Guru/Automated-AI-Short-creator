import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default async function AcceptInvitePage({ params }: { params: { token: string } }) {
  const { userId: clerkId } = await auth();
  
  // Find the invite
  const invite = await db.invite.findUnique({
    where: { token: params.token },
    include: { workspace: true }
  });

  if (!invite) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800 p-8 text-center rounded-[2rem]">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
          <p className="text-slate-400 mb-8">This invitation link is invalid or has already been used.</p>
          <Link href="/dashboard">
            <Button className="w-full rounded-xl">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check expiry
  if (invite.expiresAt < new Date()) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <Card className="max-w-md w-full bg-slate-900 border-slate-800 p-8 text-center rounded-[2rem]">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Invite Expired</h1>
            <p className="text-slate-400 mb-8">This invitation has expired. Please ask your administrator for a new link.</p>
            <Link href="/dashboard">
              <Button className="w-full rounded-xl">Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      );
  }

  // Action to accept
  async function joinWorkspace() {
    "use server"
    
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-up");

    const invite = await db.invite.findUnique({
      where: { token: params.token }
    });

    if (!invite) return;

    // Find the current user in our DB
    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) return;

    // Join the workspace
    await db.workspaceMember.create({
      data: {
        workspaceId: invite.workspaceId,
        userId: user.id,
        role: invite.role
      }
    });

    // Mark invite as accepted
    await db.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() }
    });

    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[128px] opacity-20"></div>

      <Card className="max-w-lg w-full bg-slate-900/50 border-slate-800 p-10 text-center rounded-[2.5rem] glass-panel relative z-10">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl w-fit mx-auto mb-8">
            <Zap className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2">You're Invited!</h1>
        <p className="text-slate-400 mb-8">
          You've been invited to join <span className="text-white font-bold">{invite.workspace.name}</span> as an <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">{invite.role}</span>.
        </p>

        <div className="space-y-4 mb-10 text-left">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Access to client projects and AI clipping engine.</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Secure collaboration within the {invite.workspace.name} team.</p>
            </div>
        </div>

        <form action={joinWorkspace}>
            <Button variant="premium" className="w-full rounded-2xl py-8 text-lg font-bold">
                Accept Invitation & Join Team
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
            By joining, you agree to the workspace terms and permissions.
        </p>
      </Card>
    </div>
  );
}

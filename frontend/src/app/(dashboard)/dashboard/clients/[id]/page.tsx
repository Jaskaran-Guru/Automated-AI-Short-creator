import { db } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/agency-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  const client = await db.client.findUnique({
    where: { 
      id: params.id,
      workspaceId: workspace.id 
    },
    include: {
      projects: true
    }
  });

  if (!client) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-black text-white mb-4">Client Not Found</h1>
        <Link href="/dashboard/clients">
          <Button variant="outline">Back to Clients</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
          {client.logoUrl ? (
            <img src={client.logoUrl} alt={client.name} className="w-full h-full object-cover" />
          ) : (
            <Users className="w-8 h-8 text-slate-600" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">{client.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-400">
              {client.niche || "General"}
            </Badge>
            {client.website && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {client.website.replace(/(^\w+:|^)\/\//, '')}
              </span>
            )}
          </div>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm">Client Projects ({client.projects.length})</h2>
        {client.projects.length === 0 ? (
          <p className="text-slate-500 text-sm">No projects created for this client yet.</p>
        ) : (
          <div className="space-y-4">
            {client.projects.map(project => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer flex justify-between items-center">
                  <span className="font-bold text-white">{project.name}</span>
                  <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/10">
                    {project.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

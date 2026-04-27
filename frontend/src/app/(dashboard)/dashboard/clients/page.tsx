import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  ExternalLink, 
  MoreVertical,
  Layers,
  Search
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function ClientsPage() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  const clients = await db.client.findMany({
    where: { workspaceId: workspace.id },
    include: {
      _count: {
        select: { projects: true, socialPosts: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Agency Clients</h1>
          <p className="text-slate-400">Manage brand identities and content pipelines for your clients.</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button variant="premium" className="rounded-xl px-6 h-12">
            <Plus className="w-5 h-5 mr-2" />
            Add New Client
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10 bg-slate-900/50 border-slate-800 rounded-xl"
          />
        </div>
        <Button variant="outline" className="border-slate-800 text-slate-400">
          Filters
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed p-20 flex flex-col items-center justify-center text-center rounded-[2rem]">
          <div className="bg-blue-500/10 p-6 rounded-full mb-6">
            <Users className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No clients yet</h3>
          <p className="text-slate-400 max-w-xs mb-8">Start by adding your first client to manage their content ecosystem.</p>
          <Link href="/dashboard/clients/new">
            <Button variant="outline" className="border-slate-800">
              Onboard Client
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel group hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                    {client.logoUrl ? (
                      <img src={client.logoUrl} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-500">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{client.name}</h3>
                  <div className="flex items-center gap-2">
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

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Projects</span>
                    <span className="text-lg font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-500" />
                      {client._count.projects}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Published</span>
                    <span className="text-lg font-bold text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-500" />
                      {client._count.socialPosts}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

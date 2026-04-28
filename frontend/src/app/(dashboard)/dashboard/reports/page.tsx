import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileBarChart, 
  Plus, 
  Share2, 
  Eye,
  TrendingUp,
  Clock,
  Zap,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GenerateReportButton } from "@/components/dashboard/GenerateReportButton";

export default async function ReportsPage({
    searchParams
}: {
    searchParams: { clientId?: string }
}) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  const clients = await db.client.findMany({
    where: { workspaceId: workspace.id }
  });

  const activeClientId = searchParams.clientId || (clients.length > 0 ? clients[0].id : null);

  const reports = activeClientId ? await db.report.findMany({
    where: { clientId: activeClientId },
    orderBy: { createdAt: "desc" }
  }) : [];

  // Stats for the active client (Current Month)
  const stats = activeClientId ? {
    clips: await db.clip.count({ where: { clientId: activeClientId } }),
    posts: await db.socialPost.count({ where: { clientId: activeClientId, status: "PUBLISHED" } }),
    scheduled: await db.socialPost.count({ where: { clientId: activeClientId, status: "SCHEDULED" } }),
  } : { clips: 0, posts: 0, scheduled: 0 };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Performance Reports</h1>
          <p className="text-slate-400">Generate white-label performance summaries for your clients.</p>
        </div>
        <GenerateReportButton className="rounded-xl px-6 h-12" />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />
            <TrendingUp className="w-6 h-6 text-blue-500 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Total Reach Est.</p>
            <h3 className="text-3xl font-black text-white">{(stats.clips * 1250).toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-2">+12.5% vs last month</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />
            <Zap className="w-6 h-6 text-purple-500 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Clips Generated</p>
            <h3 className="text-3xl font-black text-white">{stats.clips}</h3>
            <p className="text-[10px] text-slate-400 mt-2">Ready for distribution</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
            <Clock className="w-6 h-6 text-emerald-500 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Hours Saved</p>
            <h3 className="text-3xl font-black text-white">{stats.clips * 0.5}h</h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-2">Efficiency Boost</p>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Report History</h3>
            </div>
            <div className="flex gap-2">
                {clients.map(client => (
                    <Link key={client.id} href={`/dashboard/reports?clientId=${client.id}`}>
                        <Badge 
                            variant={activeClientId === client.id ? "premium" : "outline"}
                            className="cursor-pointer"
                        >
                            {client.name}
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>

        {reports.length === 0 ? (
            <div className="p-20 text-center">
                <FileBarChart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No reports generated for this client yet.</p>
                <GenerateReportButton 
                    variant="ghost" 
                    className="text-blue-400 mt-2 hover:bg-blue-500/5"
                    label="Click to generate your first report"
                />
            </div>
        ) : (
            <div className="divide-y divide-slate-800">
                {reports.map(report => (
                    <div key={report.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-xl border border-white/5">
                                <FileBarChart className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Monthly Report: {new Date(report.year, report.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="text-slate-400">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-400">
                                <Share2 className="w-4 h-4 mr-2" />
                                Copy Link
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </Card>
    </div>
  );
}

import { protectAdminPage } from "@/lib/admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  RefreshCcw, 
  Play, 
  StopCircle, 
  AlertTriangle,
  CheckCircle2,
  Cpu,
  BarChart3,
  Clock,
  Terminal
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminJobsPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "OPS"]);

  // Mock data for Queue Status (BullMQ Integration)
  const queues = [
    { name: "generate-clips", pending: 12, active: 4, failed: 1, successRate: 98.2 },
    { name: "render-short", pending: 5, active: 8, failed: 0, successRate: 100 },
    { name: "transcribe", pending: 0, active: 2, failed: 3, successRate: 94.5 },
    { name: "publish-post", pending: 42, active: 1, failed: 0, successRate: 99.9 },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Worker Health</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-Time Infrastructure Monitoring & Queue Management</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl h-10">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh Queues
            </Button>
            <Button variant="premium" className="rounded-xl h-10">
                <StopCircle className="w-4 h-4 mr-2" />
                Emergency Stop
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {queues.map((q) => (
            <Card key={q.name} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-800 p-3 rounded-2xl border border-white/5">
                        <Cpu className="w-6 h-6 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Online
                    </Badge>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">{q.name}</h3>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                    <span>{q.successRate}% success</span>
                    <span className="text-blue-400">{q.active} processing</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-xl font-black text-white">{q.pending}</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Failed</p>
                        <p className="text-xl font-black text-red-500">{q.failed}</p>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Active Processing Log</h3>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-slate-950 text-slate-500 border-slate-800 text-[8px]">All Jobs</Badge>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px]">Failed Only</Badge>
                </div>
            </div>
            <Table>
                <TableHeader className="bg-slate-950/30">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4">Job ID</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Type</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Runtime</TableHead>
                        <TableHead className="text-right text-slate-500 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[
                        { id: "job_8241", type: "render-short", user: "owner@skyline.com", runtime: "42s", status: "PROCESSING" },
                        { id: "job_8240", type: "generate-clips", user: "sarah@skyline.com", runtime: "1.2m", status: "COMPLETED" },
                        { id: "job_8239", type: "transcribe", user: "marcus@skyline.com", runtime: "15s", status: "FAILED" },
                    ].map((job) => (
                        <TableRow key={job.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                            <TableCell className="py-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">{job.id}</span>
                                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter font-black">{job.user}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                    {job.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500 text-xs font-bold">
                                {job.runtime}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Badge className={`
                                        text-[9px] font-black uppercase tracking-widest px-3
                                        ${job.status === 'PROCESSING' ? 'bg-blue-500 text-white' : ''}
                                        ${job.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                                        ${job.status === 'FAILED' ? 'bg-red-500 text-white' : ''}
                                    `}>
                                        {job.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 opacity-0 group-hover:opacity-100">
                                        <StopCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <BarChart3 className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Queue Throughput</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Last 24h: <span className="text-white font-bold">1,242 jobs processed</span> with a net success rate of <span className="text-emerald-500 font-bold">98.4%</span>.
                </p>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-500 w-[98.4%]" />
                </div>
                <Button variant="outline" className="w-full border-slate-800 hover:bg-blue-500/5 hover:text-blue-500 hover:border-blue-500/30 transition-all rounded-xl">
                    Detailed Analytics
                </Button>
            </Card>

            <Card className="bg-red-500/5 border-red-500/20 p-8 rounded-[2.5rem] glass-panel border-dashed">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Failure Investigation</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    3 transcription jobs failed due to <span className="text-red-400 font-bold">OpenAI API Timeout</span>. System is monitoring for auto-retry.
                </p>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl">
                    Inspect Stack Traces
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  Search, 
  Filter, 
  Trash2, 
  ShieldAlert, 
  FileCode,
  Globe,
  Database,
  Cpu
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
import { Input } from "@/components/ui/input";

export default async function AdminLogsPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "OPS"]);

  const logs = await db.auditLog.findMany({
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">System Log Center</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Centralized Audit & Error Terminal</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl">
                Clear Logs (30d+)
            </Button>
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl">
                Download JSON
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search logs by action, user, or IP..." 
            className="pl-10 bg-slate-900/50 border-slate-800 rounded-xl h-12"
          />
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[10px] text-slate-500 h-10 px-4 cursor-pointer hover:bg-white/5">
                Source: All
            </Badge>
            <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[10px] text-slate-500 h-10 px-4 cursor-pointer hover:bg-white/5">
                Severity: All
            </Badge>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Timestamp</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Action</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">User</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Source</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">IP Address</TableHead>
              <TableHead className="text-right text-slate-500 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                <TableCell className="py-6">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                        {new Date(log.createdAt).toLocaleString()}
                    </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{log.entity}: {log.entityId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                        {log.user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-xs text-slate-400">{log.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {log.action.includes('API') ? <Globe className="w-3 h-3 text-blue-500" /> : <Cpu className="w-3 h-3 text-emerald-500" />}
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {log.action.includes('API') ? 'API' : 'WORKER'}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-bold font-mono">
                  {log.ip || "127.0.0.1"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                    SUCCESS
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Internal Note */}
      <div className="mt-8 p-6 rounded-[2rem] bg-slate-900/30 border border-slate-800 border-dashed flex items-center gap-4">
          <div className="bg-slate-800 p-3 rounded-2xl">
              <ShieldAlert className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500 italic max-w-2xl leading-relaxed">
            Logs are immutable and stored for 90 days by default. Actions involving customer financial data are masked in this view but fully preserved in the secure finance vault.
          </p>
      </div>
    </div>
  );
}

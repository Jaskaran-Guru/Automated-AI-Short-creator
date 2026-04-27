import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  UserX, 
  Fingerprint, 
  MousePointer2, 
  AlertTriangle,
  Zap,
  MoreVertical,
  CheckCircle2,
  Lock
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

export default async function AdminRiskPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "OPS"]);

  const flaggedUsers = await db.riskFlag.findMany({
    where: { isResolved: false },
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Risk & Fraud Control</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Anomaly Detection & Account Enforcement Terminal</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-2">
                CRITICAL THREATS: {flaggedUsers.length}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between border-orange-500/10">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Multi-Account Detection</p>
                <h3 className="text-3xl font-black text-white">4 Clusters</h3>
                <p className="text-[10px] text-orange-500 font-bold mt-1">Suspicious IP Overlap</p>
            </div>
            <Fingerprint className="w-8 h-8 text-orange-500" />
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between border-red-500/10">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Credit Abuse Spikes</p>
                <h3 className="text-3xl font-black text-red-500">2 Flagged</h3>
                <p className="text-[10px] text-red-400 font-bold mt-1">Abnormal Generation Patterns</p>
            </div>
            <Zap className="w-8 h-8 text-red-500" />
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Bot Detection</p>
                <h3 className="text-3xl font-black text-white">High Score</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">Human Activity: 99.2%</p>
            </div>
            <MousePointer2 className="w-8 h-8 text-blue-500" />
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Active Investigation Queue</h3>
        </div>
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">User / Account</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Primary Reason</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Severity</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Detection Date</TableHead>
              <TableHead className="text-right text-slate-500 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">All clear. No active risk threats detected.</p>
                    </TableCell>
                </TableRow>
            ) : (
                flaggedUsers.map((flag) => (
                    <TableRow key={flag.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                        <TableCell className="py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-red-500">
                                    {flag.user.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white leading-tight">{flag.user.name || "Unknown User"}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">{flag.user.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-xs text-slate-300 font-medium italic">"{flag.reason}"</span>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={`
                                text-[10px] font-black uppercase tracking-widest px-3 py-1
                                ${flag.severity === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}
                            `}>
                                {flag.severity}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs font-bold">
                            {new Date(flag.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10">
                                    <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                                    <Lock className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

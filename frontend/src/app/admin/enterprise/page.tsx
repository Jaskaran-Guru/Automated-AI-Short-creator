import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Zap, 
  Activity, 
  Users,
  Globe,
  Settings,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminEnterprisePage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Enterprise Hub</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">High-Ticket Account Management & Compliance</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-4 py-2 font-black">
            ENTERPRISE NODES: ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Priority Infrastructure */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel border-purple-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-3xl rounded-full translate-x-20 -translate-y-20" />
            <div className="flex items-center gap-3 mb-8">
                <Zap className="w-6 h-6 text-purple-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Priority Infrastructure</h3>
            </div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enterprise Queue</span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none">0ms LATENCY</Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">SLA Compliance</span>
                    <span className="text-lg font-black text-white">99.99%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[99.9%]" />
                </div>
            </div>
            <Button variant="outline" className="w-full mt-8 border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest h-12 rounded-xl">
                Manage Compute Nodes
            </Button>
        </Card>

        {/* Advanced Security */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel">
            <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Security & SSO</h3>
            </div>
            <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">OIDC / SAML</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-800 text-slate-500 border-none text-[8px]">PLACEHOLDER</Badge>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Audit Logs Export</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-500 h-6 px-2 text-[10px] font-black uppercase">CSV/JSON</Button>
                </div>
            </div>
            <Button variant="premium" className="w-full mt-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Configure Enterprise SSO
            </Button>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[3rem] glass-panel border-dashed">
            <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Dedicated Account Strategy</h3>
                    <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                        The Enterprise Hub handles accounts with <span className="text-white font-bold">100+ team seats</span> and custom SLAs. Use this terminal for manual contract overrides and custom compute allocation.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">
                        Custom Contract Builder
                    </Button>
                    <Button variant="ghost" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
                        View SLA History
                    </Button>
                </div>
            </div>
      </Card>
    </div>
  );
}

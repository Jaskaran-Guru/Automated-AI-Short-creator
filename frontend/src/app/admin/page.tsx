import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Zap, 
  ShieldAlert, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN"]);

  // Mock data for Executive Insights (In production, these come from db.systemMetric)
  const metrics = {
    mrr: 12450,
    mrrGrowth: 12.5,
    totalUsers: 1420,
    userGrowth: 8.2,
    activeAgencies: 42,
    avgRenderTime: 8.4,
    failedJobs: 3,
    openTickets: 12,
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Mission Control</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Founder Executive Dashboard â€” VIRAIL Admin Empire</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                SYSTEM ONLINE
            </Badge>
            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 px-3 py-1">
                v1.4.2-STABLE
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 border-none">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {metrics.mrrGrowth}%
                </Badge>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Monthly Recurring Revenue</p>
            <h3 className="text-4xl font-black text-white">${metrics.mrr.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">ARR: ${(metrics.mrr * 12).toLocaleString()}</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-3 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/20 border-none">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {metrics.userGrowth}%
                </Badge>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Total Active Users</p>
            <h3 className="text-4xl font-black text-white">{metrics.totalUsers.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Growth Trend: Steady</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-500/10 p-3 rounded-2xl">
                    <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <Badge className="bg-purple-500/10 text-purple-400 border-none">
                    Operational
                </Badge>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Active Agencies</p>
            <h3 className="text-4xl font-black text-white">{metrics.activeAgencies}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Top Tier: Agency Pro</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-4">
                <div className="bg-red-500/10 p-3 rounded-2xl">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                {metrics.failedJobs > 0 && (
                    <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20 border-none">
                        Critical
                    </Badge>
                )}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Failed Worker Jobs</p>
            <h3 className="text-4xl font-black text-white">{metrics.failedJobs}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Queue: High Priority</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Revenue Trend (30 Days)</h3>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer bg-blue-500/5 text-blue-400 border-blue-500/20">Revenue</Badge>
                    <Badge variant="outline" className="cursor-pointer text-slate-500 border-slate-800 hover:bg-white/5">Churn</Badge>
                </div>
            </div>
            <div className="h-80 w-full bg-slate-950/50 rounded-[2rem] border border-slate-800/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-10"></div>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Revenue Chart Integration Pending</p>
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">System Health</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            <span>Worker Efficiency</span>
                            <span className="text-white">99.8%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[99.8%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            <span>Avg. Render Latency</span>
                            <span className="text-white">{metrics.avgRenderTime}s</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[65%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            <span>API Uptime</span>
                            <span className="text-white">100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[100%]" />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Operational Alerts</h3>
                </div>
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">3 Worker Jobs Failed (Render Engine)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">High Churn Risk: 5 Legacy Accounts</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

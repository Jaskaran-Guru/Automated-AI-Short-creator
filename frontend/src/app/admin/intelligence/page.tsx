import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Zap, 
  Users, 
  BarChart3,
  Cpu,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminIntelligencePage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  // Mocked Intelligence Metrics (In production, these come from CohortMetric and DailyMetric)
  const growthNiches = [
    { name: "Finance & Trading", growth: 124, activeUsers: 420 },
    { name: "True Crime / Mystery", growth: 88, activeUsers: 215 },
    { name: "Health & Fitness", growth: 52, activeUsers: 540 },
    { name: "SaaS & AI News", growth: 41, activeUsers: 890 },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Executive Intelligence</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cohort Analysis & Niche Performance Intelligence</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">
                DATA MOAT: 1.2M EVENTS
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Fastest Growing Niches</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                {growthNiches.map((niche) => (
                    <div key={niche.name} className="p-6 rounded-[2rem] bg-slate-950/50 border border-white/5 group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{niche.name}</h4>
                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none">
                                +{niche.growth}%
                            </Badge>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Active Creators</p>
                                <p className="text-xl font-black text-white">{niche.activeUsers}</p>
                            </div>
                            <div className="h-8 w-24 bg-emerald-500/10 rounded-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" style={{ width: '65%' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <Target className="w-6 h-6 text-blue-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Retention Analysis</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            <span>D30 Cohort Retention</span>
                            <span className="text-white">42.4%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[42.4%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            <span>Pro Plan Stickiness</span>
                            <span className="text-white">68.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[68.2%]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Top Churn Reason</p>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3">
                    Inconsistent Source Material
                </Badge>
            </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
            <div className="bg-emerald-500/10 p-3 rounded-2xl w-fit mb-6">
                <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">AI Unit Economics</h3>
            <p className="text-4xl font-black text-white mb-2">$0.12 <span className="text-xs text-slate-500 font-bold uppercase">/ Clip</span></p>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Avg cost per generation vs <span className="text-white">$0.85 LTV-weighted revenue</span> per clip. 
            </p>
            <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">85% Gross Margin</span>
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
            <div className="bg-blue-500/10 p-3 rounded-2xl w-fit mb-6">
                <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Feature Adoption</h3>
            <p className="text-4xl font-black text-white mb-2">72%</p>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Of active users have used the <span className="text-white">Smart Hooks</span> feature in the last 7 days.
            </p>
            <div className="mt-6 h-1 w-full bg-slate-800 rounded-full">
                <div className="h-full bg-blue-500 w-[72%]" />
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
            <div className="bg-purple-500/10 p-3 rounded-2xl w-fit mb-6">
                <Cpu className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">AI Accuracy</h3>
            <p className="text-4xl font-black text-white mb-2">94.2%</p>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                User acceptance rate for AI-selected segments (clips not deleted within 24h).
            </p>
            <div className="mt-6 flex items-center gap-2 text-purple-400 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">+2.1% MoM Improvement</span>
            </div>
        </Card>
      </div>
    </div>
  );
}

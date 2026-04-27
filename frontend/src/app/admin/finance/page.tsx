import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Zap,
  Activity,
  Target,
  BarChart3,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminFinancePage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  // Mocked Financial Intelligence (In production, these come from RevenueMetric and Stripe)
  const metrics = {
    mrr: 84500,
    arr: 1014000,
    mrrGrowth: 12.4,
    cac: 450,
    ltv: 2800,
    nrr: 108,
    margin: 82.5,
    payback: 3.2
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Financial Intelligence</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-Time Revenue, Unit Economics & Margin Analytics</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-2 font-black">
            MTD REVENUE: ${metrics.mrr.toLocaleString()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Annual Recurring Revenue</p>
            <h3 className="text-4xl font-black text-white">${(metrics.arr / 1000).toFixed(1)}k</h3>
            <div className="flex items-center gap-1 mt-4 text-emerald-500 font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs">+{metrics.mrrGrowth}% MoM</span>
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">LTV / CAC Ratio</p>
            <h3 className="text-4xl font-black text-white">{(metrics.ltv / metrics.cac).toFixed(1)}x</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-4">CAC: ${metrics.cac}</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Net Revenue Retention</p>
            <h3 className="text-4xl font-black text-white">{metrics.nrr}%</h3>
            <p className="text-[10px] text-purple-400 font-bold uppercase mt-4">Expansion: +14%</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden group border-emerald-500/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Gross Margin (AI COGS)</p>
            <h3 className="text-4xl font-black text-white">{metrics.margin}%</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase mt-4">Payback: {metrics.payback} Months</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-10 rounded-[3rem] glass-panel">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Revenue Composition (Plan Tiers)</h3>
                </div>
            </div>
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                        <span className="text-slate-400">Agency Pro ($999/mo)</span>
                        <span className="text-white">$42,400 (50.2%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[50.2%]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                        <span className="text-slate-400">Pro Plan ($99/mo)</span>
                        <span className="text-white">$34,100 (40.3%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[40.3%]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                        <span className="text-slate-400">Starter ($49/mo)</span>
                        <span className="text-white">$8,000 (9.5%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 w-[9.5%]" />
                    </div>
                </div>
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[3rem] glass-panel border-blue-500/10">
            <Activity className="w-10 h-10 text-blue-500 mb-8" />
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Growth Efficiency</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Your LTV/CAC ratio of <span className="text-white font-black">6.2x</span> indicates a highly efficient acquisition engine. You can safely increase marketing spend by up to 40% without breaking unit economics.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CAC Payback</p>
                    <p className="text-xl font-black text-white">3.2 Mo.</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Burn Multiple</p>
                    <p className="text-xl font-black text-white">0.4x</p>
                </div>
            </div>
        </Card>
      </div>

      {/* AI Margin Intelligence */}
      <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[3rem] glass-panel border-dashed">
            <div className="flex items-center gap-3 mb-10">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">AI Margin Intelligence (Unit Economics)</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total API Spend (MTD)</p>
                    <p className="text-3xl font-black text-white">$14,820</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase mt-2">OpenAI: 92% â€¢ Anthropic: 8%</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cost per Generation</p>
                    <p className="text-3xl font-black text-white">$0.12</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Target: $0.10 (-16% reduction)</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Revenue / Generation</p>
                    <p className="text-3xl font-black text-emerald-500">$0.85</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">LTV-weighted average</p>
                </div>
            </div>
      </Card>
    </div>
  );
}

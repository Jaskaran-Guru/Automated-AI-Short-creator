import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function BenchmarksPage() {
  const { userId: clerkId } = await auth();
  
  // Mock benchmark data (In production, these come from BenchmarkSnapshot)
  const benchmarks = [
    { name: "Publishing Consistency", value: 88, avg: 42, unit: "%", description: "Creators in your niche average 3 posts per week." },
    { name: "Avg. Clip Length", value: 24, avg: 31, unit: "s", description: "Top 10% of creators use shorter 20-25s clips." },
    { name: "Hook Strength", value: 72, avg: 55, unit: "pts", description: "Your AI-generated hooks are outperforming the niche average." },
    { name: "Monthly Output", value: 45, avg: 18, unit: "clips", description: "You are in the top 5% for content volume this month." },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Niche Benchmarks</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Anonymous Competitive Intelligence â€” Niche: Podcasting</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Privacy Protected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Your Standing</h3>
            </div>
            
            <div className="space-y-10">
                {benchmarks.map((b) => (
                    <div key={b.name}>
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{b.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{b.description}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">{b.value}{b.unit}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase ml-2">Avg: {b.avg}{b.unit}</span>
                            </div>
                        </div>
                        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="absolute h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                                style={{ width: `${(b.value / 100) * 100}%` }} 
                            />
                            <div 
                                className="absolute h-full w-0.5 bg-white/20" 
                                style={{ left: `${(b.avg / 100) * 100}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <Users className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Cohort Ranking</h3>
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-white italic">TOP 8%</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    You are outperforming 92% of creators in the <span className="text-white font-bold">Educational Niche</span> this month based on engagement velocity.
                </p>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Growth Forecast</span>
                    </div>
                    <p className="text-[10px] text-blue-300 font-bold leading-relaxed">
                        Maintaining this consistency will likely lead to a 2.5x increase in follower conversion by next month.
                    </p>
                </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel border-yellow-500/10">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Niche Winners</h3>
                </div>
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Top Hook Pattern</p>
                        <p className="text-xs text-white font-bold italic">"I was shocked when I found out..."</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Winning Pace</p>
                        <p className="text-xs text-white font-bold">140-160 WPM (Fast-Paced)</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>

      <div className="bg-slate-900/30 border border-slate-800 border-dashed p-6 rounded-[2rem] flex items-start gap-4">
          <Info className="w-5 h-5 text-slate-600 mt-1" />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Benchmarks are calculated using aggregated, anonymized data from the VIRAIL Intelligence Network. Your individual data is never shared with other users. A minimum of 50 creators in a niche is required for stable percentile ranking.
          </p>
      </div>
    </div>
  );
}

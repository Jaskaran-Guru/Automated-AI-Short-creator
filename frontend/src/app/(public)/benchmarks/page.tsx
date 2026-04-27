import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  Globe, 
  ArrowUpRight,
  ShieldCheck,
  Star,
  Info,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PublicBenchmarksPage() {
  const currentTrends = [
    { niche: "Finance & SaaS", bestLength: "22s", bestHook: "Negative Hook (Fear of Loss)", growth: "+84%" },
    { niche: "Podcast / Talk", bestLength: "45s", bestHook: "Controversial Statement", growth: "+62%" },
    { niche: "E-commerce", bestLength: "15s", bestHook: "Direct Problem/Solution", growth: "+112%" },
    { niche: "Education / How-to", bestLength: "35s", bestHook: "The 'I discovered' Hook", growth: "+41%" },
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Authority Header */}
      <section className="pt-32 pb-20 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 mb-8 rounded-full text-[10px] font-black uppercase tracking-widest">
            VIRAIL INTELLIGENCE HUB: Q2 2026 BENCHMARKS
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 italic uppercase max-w-5xl mx-auto">
            The Standard for Viral Growth.
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Data-driven benchmarks from 1.2 million viral clips. We define what works, so you don't have to guess.
          </p>
          <div className="flex justify-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Globe className="w-3 h-3" />
                Live Data Feed
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Verified Benchmarks
             </div>
          </div>
        </div>
      </section>

      {/* Benchmark Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-10 rounded-[3rem] glass-panel">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Live Niche Performance</h3>
                    </div>
                    <Badge variant="outline" className="text-slate-500">Updated Hourly</Badge>
                </div>
                
                <div className="space-y-10">
                    {currentTrends.map((trend) => (
                        <div key={trend.niche} className="group">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h4 className="text-xl font-black text-white group-hover:text-blue-500 transition-colors uppercase italic">{trend.niche}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Winning Hook: {trend.bestHook}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">{trend.growth}</span>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Engagement Lift</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: trend.growth }} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Length: {trend.bestLength}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="space-y-8">
                <Card className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-[2.5rem] border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <Star className="w-8 h-8 text-white mb-6 fill-white" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-4">Get Your <br/> Growth Scoreâ„¢</h3>
                        <p className="text-blue-100/80 text-sm font-medium mb-8 leading-relaxed">
                            Benchmark your channel against the top 1% of creators in your specific niche.
                        </p>
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest rounded-xl h-14">
                            Start Analysis
                        </Button>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                    <Target className="w-8 h-8 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Algorithm Pulse</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        TikTok's current high-reach window has shifted to <span className="text-white font-bold">18-24 seconds</span>. Long-form hooks are seeing a 20% drop in initial retention.
                    </p>
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strategist Tip</span>
                        </div>
                        <p className="text-[10px] text-blue-300 font-bold leading-relaxed italic">
                            "Cut the intro. Start with the problem. The first 1.2s is everything right now."
                        </p>
                    </div>
                </Card>
            </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid md:grid-cols-4 gap-12 py-16 border-y border-white/5 text-center">
            <div>
                <p className="text-4xl font-black text-white mb-2">1.2M+</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Viral Clips Analyzed</p>
            </div>
            <div>
                <p className="text-4xl font-black text-white mb-2">85.4%</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Prediction Accuracy</p>
            </div>
            <div>
                <p className="text-4xl font-black text-white mb-2">14,200</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Benchmarks</p>
            </div>
            <div>
                <p className="text-4xl font-black text-white mb-2">$8.2B</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Estimated Ad Value</p>
            </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center bg-slate-900/50 border border-white/5 rounded-[3rem] p-16 glass-panel relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 leading-none italic">Join the Infrastructure <br/> of Growth.</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                    Access Pro Intelligence
                </Button>
                <Button variant="outline" size="lg" className="border-slate-800 hover:bg-white/5 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                    View Case Studies
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}

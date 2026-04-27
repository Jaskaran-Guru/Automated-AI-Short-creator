import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Globe,
  Download,
  ArrowRight,
  Quote,
  Target,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function AnnualReportPage() {
  const keyStats = [
    { value: "1.2M+", label: "Clips Analyzed", sub: "Across 14 platforms" },
    { value: "340%", label: "Avg. Agency Growth", sub: "vs. manual editing" },
    { value: "22s", label: "Optimal Clip Length", sub: "Global 2026 average" },
    { value: "$8.2B", label: "Creator Economy Spend", sub: "Estimated short-form ad value" },
  ];

  const nicheTrends = [
    { niche: "Finance & Fintech", growth: "+124%", winner: "Fear-of-Loss Hook", platform: "TikTok + Shorts" },
    { niche: "True Crime / Storytelling", growth: "+88%", winner: "Mid-sentence Cutoff", platform: "TikTok" },
    { niche: "E-commerce & DTC", growth: "+112%", winner: "Direct Problem â†’ Solution", platform: "Reels" },
    { niche: "SaaS & B2B Tech", growth: "+67%", winner: "Contrarian Claim Hook", platform: "Shorts + LinkedIn" },
    { niche: "Health & Fitness", growth: "+52%", winner: "Transformation Reveal", platform: "Reels + TikTok" },
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">VIRAIL Intelligence</span>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl h-9 px-6 text-[10px]">
            <Download className="w-3.5 h-3.5 mr-2" />
            Download Full Report
          </Button>
        </div>
      </nav>

      {/* Cover */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <Activity className="w-3 h-3" />
            VIRAIL Annual Intelligence Report
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-10 italic uppercase">
            State of<br/>Short-Form<br/>Growth 2026
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Insights from 1.2 million viral clips across TikTok, YouTube Shorts, and Instagram Reels. The definitive benchmark for video-first growth operators.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report
            </Button>
            <Button variant="outline" size="lg" className="border-slate-800 hover:bg-white/5 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
              View Interactive Data
            </Button>
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-8">
            Published April 2026 Â· VIRAIL Intelligence Division
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-1">
            {keyStats.map((stat, i) => (
              <div key={i} className="p-10 border-r border-white/5 last:border-r-0 text-center">
                <p className="text-6xl font-black text-white mb-3 italic">{stat.value}</p>
                <p className="text-sm font-black text-blue-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Executive Summary</p>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">
          The Clip Economy Is Consolidating Around Infrastructure Platforms.
        </h2>
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-lg text-slate-400 leading-relaxed mb-6">
            In 2026, the short-form video market crossed <strong className="text-white">$140B in advertising value</strong>. But most creators and agencies are still operating with tool-level thinking â€” clipping manually, scheduling randomly, and publishing without data.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed mb-6">
            VIRAIL's platform data reveals a clear bifurcation: creators using intelligence-driven workflows are growing <strong className="text-white">3.4x faster</strong> than those operating reactively. The gap is widening.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            The winners in the next 24 months won't be those with the most content. They'll be those with the best <strong className="text-white">content infrastructure</strong>.
          </p>
        </div>
      </section>

      {/* Niche Performance Table */}
      <section className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-16">Section 2: Niche Performance Index</p>
          <Card className="bg-slate-900/50 border-slate-800 rounded-[3rem] overflow-hidden glass-panel">
            <div className="grid grid-cols-4 p-8 border-b border-slate-800 bg-slate-900/30">
              {["Niche", "YoY Growth", "Top Hook Pattern", "Dominant Platform"].map(h => (
                <div key={h} className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</div>
              ))}
            </div>
            {nicheTrends.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 px-8 py-6 border-b border-slate-800/50 items-center gap-4 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <span className="text-sm font-black text-white">{row.niche}</span>
                <span className="text-lg font-black text-emerald-500">{row.growth}</span>
                <span className="text-xs text-slate-400 font-bold italic">"{row.winner}"</span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{row.platform}</span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* Key Finding Callout */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-700 p-16 rounded-[3rem] border-none relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
            <Quote className="w-12 h-12 text-white/30 mx-auto mb-8" />
            <p className="text-3xl md:text-4xl font-black text-white leading-snug italic mb-8 relative z-10">
              "Creators who post within a platform's peak engagement window see <span className="underline decoration-white/50">41% higher reach</span> on their first 3 hours of distribution â€” with no other variable changed."
            </p>
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest relative z-10">
              â€” VIRAIL Intelligence Research, Q1 2026
            </p>
          </Card>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-8" />
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-none italic">
            The Full Report is 42 Pages.<br/>This Was the Preview.
          </h2>
          <p className="text-slate-400 mb-12 leading-relaxed">
            Download the complete 2026 State of Short-Form Growth report â€” including platform algorithm breakdowns, regional creator economy data, and a niche-by-niche benchmarking matrix.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-12 h-16 rounded-[2rem] text-sm">
            Download the Full Report (Free)
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}

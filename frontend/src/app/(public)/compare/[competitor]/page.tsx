import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Minus, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Shield,
  BarChart3
} from "lucide-react";
import Link from "next/link";

// SEO: These pages intercept high-intent "Alternative to X" searches
const competitorData: Record<string, {
  name: string;
  tagline: string;
  weakness: string;
  virailAdvantages: string[];
}> = {
  "opus-clip": {
    name: "Opus Clip",
    tagline: "Opus Clip is an AI clipping tool. VIRAIL is growth infrastructure.",
    weakness: "Opus Clip offers clipping. It doesn't offer benchmarks, analytics, agency mode, growth scoring, or a marketplace. You outgrow it fast.",
    virailAdvantages: ["Agency Multi-Client Mode", "VIRAIL Growth Score™", "Niche Benchmarks", "Revenue Intelligence", "Template Marketplace"]
  },
  "vidyo": {
    name: "Vidyo.ai",
    tagline: "Vidyo.ai edits video. VIRAIL scales your business.",
    weakness: "Vidyo.ai focuses on repurposing. VIRAIL focuses on growth — scheduling, analytics, benchmarks, team collaboration, and AI prediction.",
    virailAdvantages: ["Predictive Performance Analysis", "Multi-Platform Scheduling", "White-Label Reports", "Growth CRM", "Data Moat Intelligence"]
  },
  "descript": {
    name: "Descript",
    tagline: "Descript is a video editor. VIRAIL is your growth operating system.",
    weakness: "Descript is a powerful editor for individuals. VIRAIL is an operations platform for agencies and ambitious creators who need to scale.",
    virailAdvantages: ["Team Workspaces & RBAC", "Client Management", "Auto-Publishing", "Growth Benchmarks", "Business Intelligence"]
  }
};

const featureMatrix = [
  { feature: "AI Clip Generation", virail: true, competitor: true },
  { feature: "Auto Captions", virail: true, competitor: true },
  { feature: "Multi-Platform Scheduling", virail: true, competitor: false },
  { feature: "Agency Client Management", virail: true, competitor: false },
  { feature: "Growth Score™ Analytics", virail: true, competitor: false },
  { feature: "Niche Benchmark Data", virail: true, competitor: false },
  { feature: "Template Marketplace", virail: true, competitor: false },
  { feature: "Team RBAC Permissions", virail: true, competitor: "partial" },
  { feature: "White-Label Reports", virail: true, competitor: false },
  { feature: "Predictive AI Performance", virail: true, competitor: false },
];

export default function ComparePage({ params }: { params: { competitor: string } }) {
  const data = competitorData[params.competitor] || competitorData["opus-clip"];

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">VIRAIL</span>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl h-9 px-6 text-[10px]">
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-10 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            VIRAIL vs {data.name}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8 italic uppercase">
            {data.tagline}
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            {data.weakness}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
              Switch to VIRAIL Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 text-center mb-16">
            Feature-by-Feature Comparison
          </h2>
          <Card className="bg-slate-900/50 border-slate-800 rounded-[3rem] overflow-hidden glass-panel">
            {/* Header */}
            <div className="grid grid-cols-3 p-8 border-b border-slate-800 bg-slate-900/30">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Feature</div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="bg-blue-500 p-1 rounded-md">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-tight">VIRAIL</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-black text-slate-500 uppercase tracking-tight">{data.name}</span>
              </div>
            </div>

            {featureMatrix.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-8 py-5 border-b border-slate-800/50 items-center ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <span className="text-sm font-bold text-slate-300">{row.feature}</span>
                <div className="flex justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex justify-center">
                  {row.competitor === true ? (
                    <CheckCircle2 className="w-5 h-5 text-slate-500" />
                  ) : row.competitor === "partial" ? (
                    <Minus className="w-5 h-5 text-orange-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500/50" />
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* VIRAIL Advantages */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 text-center mb-16">
            What you gain when you switch
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.virailAdvantages.map((advantage, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-[2rem] bg-slate-900/50 border border-white/5 glass-panel">
                <div className="bg-blue-500/10 p-3 rounded-2xl h-fit">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">{advantage}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {data.name} doesn't offer this. VIRAIL is built for operators who need to scale.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 leading-none italic">
            Stop Using a Tool.<br />Start Operating Infrastructure.
          </h2>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-12 h-16 rounded-[2rem] text-sm">
            Migrate from {data.name} — Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}

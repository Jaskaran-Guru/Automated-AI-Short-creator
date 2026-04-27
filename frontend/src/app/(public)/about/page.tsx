import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  ArrowRight, 
  Quote,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
            Get Started
          </Button>
        </div>
      </nav>

      {/* Founder Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">
                THE ORIGIN STORY
              </p>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-10 italic uppercase">
                We Don't Build<br />Video Tools.
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-8">
                We build the standard by which video-first growth is measured, executed, and scaled.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every editor, clipper, and caption tool on the market optimizes for output. We optimize for <span className="text-white font-bold">outcomes</span>. There's a difference â€” and that difference is worth $10M ARR.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[4rem] blur-2xl" />
              <Card className="relative bg-slate-900/90 border-white/10 p-10 rounded-[3rem] glass-panel">
                <Quote className="w-8 h-8 text-blue-600/50 mb-6" />
                <p className="text-xl font-bold text-white leading-snug italic mb-8">
                  "The category we're building doesn't have a name yet. In 3 years, it will be called 'Video Growth Infrastructure' â€” and VIRAIL will be the company that defined it."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">The Founder</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CEO & Category Operator, VIRAIL</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-16 text-center">Why VIRAIL exists</p>
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">
                The market was full of tools. Nobody was building infrastructure.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                In 2024, every "AI video tool" was optimizing for the same thing: how fast can we generate a clip? That's the wrong question. The right question is: <span className="text-white font-bold">why do some creators grow 10x faster than others, and how do we systematize that advantage?</span>
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">
                Data is the defensibility. Everything else is a feature.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                VIRAIL's real product isn't the AI. It's 1.2 million data points about what actually makes content go viral â€” by niche, by platform, by hook type, by time of day. That dataset <span className="text-white font-bold">compounds every time a user publishes a clip</span>. That is a moat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-16 text-center">Built on three unbreakable pillars</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", title: "Data Advantage", body: "Platform-wide intelligence derived from 1.2M+ clips, compounding with every user action." },
              { icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10", title: "Workflow Lock-in", body: "VIRAIL isn't a step in your workflow. It IS your workflow â€” from upload to publish to analytics." },
              { icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Category Ownership", body: "The VIRAIL Growth Scoreâ„¢ is becoming the industry standard for measuring video-first growth." },
            ].map((pillar) => (
              <Card key={pillar.title} className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel">
                <div className={`${pillar.bg} p-4 rounded-2xl w-fit mb-6`}>
                  <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{pillar.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{pillar.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Join the infrastructure</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-10 leading-[0.85] italic max-w-3xl mx-auto">
          Build on the Standard. Don't Compete with It.
        </h2>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-12 h-16 rounded-[2rem] text-sm">
          Start Building on VIRAIL
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>
    </div>
  );
}

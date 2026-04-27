import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Clock, 
  TrendingUp, 
  Users,
  Star
} from "lucide-react";
import Link from "next/link";

// Mock CMS Data for Solution Pages
const solutions = {
  "podcast-clips": {
    title: "AI Short Clips for Podcasters",
    description: "Turn your 1-hour episodes into 20+ viral clips for TikTok, Reels, and Shorts automatically.",
    heroImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop",
    benefits: ["Auto-Detect Highlights", "Seamless Captions", "Multi-Platform Export"],
    roi: "Save 15 hours per episode",
    cta: "Start Scaling Your Podcast"
  },
  "real-estate": {
    title: "Viral Shorts for Real Estate Agents",
    description: "Turn property tours and market updates into high-engagement video content that wins listings.",
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
    benefits: ["Agent Branding Kits", "Local Market Subtitles", "Lead Gen Templates"],
    roi: "3x More Engagement on Instagram",
    cta: "Win More Listings Now"
  }
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = solutions[params.slug as keyof typeof solutions] || solutions["podcast-clips"];

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 mb-8 rounded-full text-[10px] font-black uppercase tracking-widest">
            VIRAIL SOLUTIONS: {params.slug.toUpperCase().replace('-', ' ')}
          </Badge>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 italic uppercase">
                {solution.title}
              </h1>
              <p className="text-xl text-slate-400 font-medium max-w-xl mb-10 leading-relaxed">
                {solution.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                  {solution.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-800 hover:bg-white/5 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                  View Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#020617]" />)}
                 </div>
                 Trusted by 500+ creators
              </div>
            </div>
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5 aspect-video flex items-center justify-center">
                    <img src={solution.heroImage} alt={solution.title} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-full relative z-10 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Benefits */}
      <section className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {solution.benefits.map((benefit, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                    <div className="bg-blue-500/10 p-3 rounded-2xl w-fit mb-6">
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit}</h3>
                    <p className="text-sm text-slate-400">Scale your output without hiring a full-time editor.</p>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-[3rem] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-20 -translate-y-20" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-none">Stop Wasting Time <br/> on Manual Editing.</h2>
                    <p className="text-blue-100/80 font-bold uppercase tracking-widest text-xs mb-8">
                        The average {params.slug.replace('-', ' ')} user saves <span className="text-white">12+ hours per week</span>.
                    </p>
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-4xl font-black text-white">12h</p>
                            <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Time Saved / Wk</p>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div>
                            <p className="text-4xl font-black text-white">3.5x</p>
                            <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Growth Velocity</p>
                        </div>
                    </div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Calculate Your ROI</h4>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-xs font-bold uppercase text-blue-200">
                            <span>Videos Per Month</span>
                            <span className="text-white">12</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-1/2" />
                        </div>
                    </div>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest rounded-xl h-14">
                        Get Your Savings Report
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-16">Results from top creators</h2>
            <div className="grid md:grid-cols-4 gap-8 grayscale opacity-50">
                <div className="h-8 bg-slate-800 rounded animate-pulse" />
                <div className="h-8 bg-slate-800 rounded animate-pulse" />
                <div className="h-8 bg-slate-800 rounded animate-pulse" />
                <div className="h-8 bg-slate-800 rounded animate-pulse" />
            </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}>{children}</div>
}

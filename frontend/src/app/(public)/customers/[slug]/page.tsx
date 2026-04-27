import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Quote, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Star
} from "lucide-react";
import Link from "next/link";

// Mock Data for Case Studies
const caseStudies = {
  "skyline-media": {
    name: "Skyline Media",
    industry: "Video Marketing Agency",
    title: "How Skyline Media Scaled to 50+ Clients with 2 Content Editors.",
    summary: "By implementing VIRAIL's Agency Mode, Skyline reduced their per-client editing time from 8 hours to 45 minutes.",
    challenge: "Skyline was turning away $20k/mo in new business because their editing team was at 100% capacity. They couldn't scale without doubling their headcount.",
    solution: "VIRAIL's AI automatically identified high-potential clips from raw client footage, and the unified calendar allowed for bulk scheduling across all 50 clients.",
    results: [
      { label: "Client Capacity", value: "+340%", sub: "With zero new hires" },
      { label: "Editing Time", value: "-92%", sub: "Per video produced" },
      { label: "Content Volume", value: "5x", sub: "Increase in weekly posts" }
    ],
    testimonial: {
      quote: "VIRAIL isn't just a tool; it's our entire operational backbone. We literally couldn't run our agency without it.",
      author: "Sarah Jenkins",
      role: "Founder, Skyline Media"
    }
  }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudies[params.slug as keyof typeof caseStudies] || caseStudies["skyline-media"];

  return (
    <div className="bg-[#020617] min-h-screen text-white selection:bg-blue-500/30">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-black uppercase tracking-tighter">Virail Case Studies</span>
            </Link>
            <Link href="/solutions/agency" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                Back to Solutions
            </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 mb-8 rounded-full text-[10px] font-black uppercase tracking-widest">
                Agency Case Study: {study.name}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8 italic uppercase">
                {study.title}
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                {study.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/5">
                {study.results.map((res, i) => (
                    <div key={i} className="text-center">
                        <p className="text-5xl font-black text-white mb-2">{res.value}</p>
                        <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-1">{res.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{res.sub}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 bg-slate-950/30">
        <div className="max-w-3xl mx-auto space-y-20">
            <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8">The Challenge</h2>
                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                    {study.challenge}
                </p>
            </div>

            <div className="relative p-12 rounded-[3rem] bg-slate-900/50 border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full translate-x-20 -translate-y-20" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 relative z-10">The VIRAIL Solution</h2>
                <p className="text-xl text-slate-300 leading-relaxed font-medium relative z-10">
                    {study.solution}
                </p>
            </div>

            {/* Testimonial */}
            <div className="py-20 border-t border-white/5">
                <Quote className="w-12 h-12 text-blue-600 mb-8 opacity-50" />
                <h3 className="text-3xl font-bold text-white italic mb-8 leading-snug">
                    "{study.testimonial.quote}"
                </h3>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800" />
                    <div>
                        <p className="text-sm font-black uppercase text-white tracking-widest">{study.testimonial.author}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{study.testimonial.role}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 leading-none">Ready to See These <br/> Results Yourself?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                    Book an Agency Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-800 hover:bg-white/5 text-white font-black uppercase tracking-widest px-10 h-16 rounded-[2rem] text-sm">
                    View Pricing
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}>{children}</div>
}

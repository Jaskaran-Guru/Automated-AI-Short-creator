"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Play, Sparkles, Zap, Scissors, LayoutDashboard, Share2, Star, 
  CheckCircle2, ChevronDown, Globe, MessageSquare, ArrowRight 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const PricingCard = ({ title, price, features, highlighted = false }: any) => (
  <div className={`glass p-8 rounded-3xl flex flex-col h-full card-hover ${highlighted ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800'}`}>
    {highlighted && (
      <Badge className="w-fit mb-4 bg-blue-500 text-white border-none">Most Popular</Badge>
    )}
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-extrabold text-white">{price}</span>
      <span className="text-slate-400">/month</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Button variant={highlighted ? "premium" : "outline"} className="w-full py-6 rounded-xl font-bold">
      Get Started
    </Button>
  </div>
)

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-slate-800 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 mt-4 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#020617]">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full glass-dark mt-4 rounded-full border border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase letter-spacing-widest">Virail</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/sign-in" className="text-sm font-medium text-slate-300 hover:text-white px-4 transition-colors">Log in</Link>
          <Link href="/dashboard">
            <Button variant="premium" className="rounded-full px-6">Start Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-8 py-1.5 px-5 text-sm font-medium border-blue-500/30 text-blue-400 bg-blue-500/5 backdrop-blur-sm rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline" />
              Revolutionizing Video Content with AI
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Turn One Video Into a <br/>
            <span className="premium-gradient">Month of Content.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI clips, captions, titles, and scheduling for creators who want growth without a team. Publish it all automatically.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button variant="premium" size="lg" className="text-lg px-10 py-7 h-auto w-full sm:w-auto font-bold rounded-2xl shadow-lg shadow-blue-500/20">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="glass" size="lg" className="text-lg px-10 py-7 h-auto w-full sm:w-auto border-slate-800 font-bold rounded-2xl">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="mt-20 flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted by creators worldwide</p>
             <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                <span className="text-2xl font-bold text-slate-300 flex items-center gap-2"><Globe className="w-6 h-6"/> TechFlow</span>
                <span className="text-2xl font-bold text-slate-300 flex items-center gap-2"><MessageSquare className="w-6 h-6"/> PodCastX</span>
                <span className="text-2xl font-bold text-slate-300 flex items-center gap-2"><Zap className="w-6 h-6"/> ViralMedia</span>
             </div>
          </motion.div>
        </div>

        {/* Preview Image */}
        <motion.div 
          className="mt-32 max-w-6xl mx-auto relative group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass rounded-[2.2rem] overflow-hidden border border-white/10">
            <div className="bg-slate-900/50 p-4 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-slate-800/50 text-[10px] text-slate-400 font-mono">virail.app/dashboard/new</div>
            </div>
            <div className="aspect-video bg-[#0f172a] flex items-center justify-center p-12">
               <div className="grid grid-cols-4 gap-6 w-full h-full">
                  <div className="col-span-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 shimmer opacity-20"></div>
                      <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">Video Editor Interface</div>
                  </div>
                  <div className="col-span-1 space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-[9/16] bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center p-4">
                           <div className="w-full h-2 bg-slate-700/50 rounded-full mb-auto"></div>
                           <Zap className="w-6 h-6 text-blue-500/40 mb-2" />
                           <div className="w-3/4 h-2 bg-slate-700/50 rounded-full mt-auto"></div>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="premium" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1]">Everything you need <br/> to go viral.</h2>
          </div>
          <p className="text-slate-400 text-lg max-w-md">Our AI engine replaces an entire editing team, giving you high-retention clips in minutes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Sparkles, title: "AI Moment Detection", desc: "Our engine analyzes emotion, pacing, and keywords to identify segments with the highest viral potential." },
            { icon: Scissors, title: "Smart Auto-Reframing", desc: "Perfectly tracks speakers and action to convert landscape video into high-impact 9:16 vertical clips." },
            { icon: Globe, title: "Auto-Distribution", desc: "One-click scheduling for TikTok, Instagram Reels, and YouTube Shorts. Fill your calendar in seconds." },
            { icon: Share2, title: "Animated Captions", desc: "Choose from world-class styles like Hormozi, MrBeast, and Neon to maximize viewer retention." },
            { icon: MessageSquare, title: "Platform Rewrites", desc: "AI generates unique titles and captions tailored for YouTube, TikTok, and Instagram Reels." },
            { icon: Star, title: "Virality Scoring", desc: "Each clip gets a data-driven score so you know exactly what to post for maximum engagement." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              className="glass p-10 rounded-[2rem] hover:bg-slate-800/50 transition-all border-slate-800 flex flex-col gap-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="premium" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white">Loved by creators who scale.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Podcaster", text: "Virail saved me 20 hours a month. I used to spend days clipping, now it's done before my coffee is cold.", stars: 5 },
              { name: "David Chen", role: "Marketing Lead", text: "The auto-distribution is the killer feature. Scheduling a month of content in 2 minutes changed our entire workflow.", stars: 5 },
              { name: "Marcus Thorne", role: "Content Creator", text: "The caption styles are industry-standard. People keep asking which editor I hired. It's just Virail.", stars: 5 },
            ].map((t, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-slate-300 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto w-full relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Simple, Transparent Pricing.</h2>
          <p className="text-slate-400 text-lg">Choose the plan that fits your growth.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <PricingCard 
            title="Free" 
            price="$0" 
            features={["1 video/month", "Watermarked clips", "Standard AI", "720p Export"]} 
          />
          <PricingCard 
            title="Starter" 
            price="$29" 
            features={["60 processing minutes / mo", "No Watermark", "Viral Moment Detection", "1080p HD", "Email Support"]} 
            highlighted={true}
          />
          <PricingCard 
            title="Pro" 
            price="$79" 
            features={["300 processing minutes / mo", "Auto Distribution Engine", "Social Media Scheduler", "Analytics Dashboard", "Priority AI"]} 
          />
          <PricingCard 
            title="Agency" 
            price="$299" 
            features={["1500 processing minutes / mo", "Multi-Client Mgmt", "White-labeling", "Bulk Export", "Account Manager"]} 
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Frequently Asked Questions</h2>
        </div>
        <div className="glass p-8 md:p-12 rounded-[2.5rem] border-slate-800">
          <FAQItem 
            question="What types of videos work best?" 
            answer="Podcasts, interviews, webinars, and talking-head videos work best. Our AI is optimized for speech-driven content where it can identify high-value insights and emotional peaks." 
          />
          <FAQItem 
            question="How long does it take to process a video?" 
            answer="Typically, it takes about 1/3 of the video's length. A 30-minute video will be transcribed and clipped in about 10 minutes." 
          />
          <FAQItem 
            question="Can I customize the caption styles?" 
            answer="Yes! We offer presets like Alex Hormozi, MrBeast, and Neon Viral, but you can also customize fonts, colors, and animations to match your brand." 
          />
          <FAQItem 
            question="Does it work in other languages?" 
            answer="Yes, Virail supports over 50 languages for transcription and captioning, including Spanish, French, German, Hindi, and Mandarin." 
          />
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-32 px-6 border-t border-slate-900 bg-[#020617] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-500/10 p-4 rounded-3xl mb-10">
             <Zap className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Ready to go viral?</h2>
          <Link href="/dashboard">
            <Button variant="premium" size="lg" className="text-xl px-12 py-8 h-auto rounded-3xl font-bold">
              Get Started for Free
            </Button>
          </Link>
          <p className="mt-8 text-slate-500 font-medium">No credit card required.</p>
          
          <div className="mt-32 pt-16 border-t border-slate-900 w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white uppercase">Virail</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
               <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
               <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
               <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-slate-600">Â© 2024 Virail AI Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

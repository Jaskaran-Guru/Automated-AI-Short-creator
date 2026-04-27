"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Mic, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const personas = [
    {
        id: 'creator',
        name: "Solo Creator",
        icon: User,
        description: "Focusing on personal brand growth on TikTok & Shorts.",
        benefits: ["Single Brand Kit", "Daily Trends", "Fast Export"]
    },
    {
        id: 'podcaster',
        name: "Podcaster",
        icon: Mic,
        description: "Turning long-form episodes into viral short-form clips.",
        benefits: ["Audio-to-Video", "Long Video Uploads", "Seamless Captions"]
    },
    {
        id: 'agency',
        name: "Content Agency",
        icon: Building2,
        description: "Managing multiple client brands and high-volume output.",
        benefits: ["Client Workspaces", "Team Invites", "White-label Reports"]
    }
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 selection:bg-blue-500/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl w-full relative z-10">
            <div className="text-center mb-16">
                <div className="bg-blue-500/10 p-3 rounded-2xl w-fit mx-auto mb-6">
                    <Zap className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Welcome to Virail</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Let's tailor your growth workspace. Who are you?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {personas.map((p) => (
                    <motion.div 
                        key={p.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelected(p.id)}
                    >
                        <Card className={`h-full cursor-pointer transition-all duration-300 p-8 rounded-[2.5rem] bg-slate-900/50 border-2 ${
                            selected === p.id ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-slate-800 hover:border-slate-700'
                        }`}>
                            <div className={`p-4 rounded-2xl w-fit mb-8 ${
                                selected === p.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
                            }`}>
                                <p.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{p.name}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8">{p.description}</p>
                            <div className="space-y-3">
                                {p.benefits.map(b => (
                                    <div key={b} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <CheckCircle2 className={`w-3 h-3 ${selected === p.id ? 'text-blue-500' : 'text-slate-700'}`} />
                                        {b}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
                <Button 
                    size="lg" 
                    disabled={!selected}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-12 h-16 rounded-[2rem] text-sm disabled:opacity-50 transition-all"
                >
                    Launch My Workspace
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    </div>
  )
}

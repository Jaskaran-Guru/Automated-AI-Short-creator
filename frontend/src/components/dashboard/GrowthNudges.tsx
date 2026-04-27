"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NudgeProps {
    type: 'UPSELL' | 'RETENTION' | 'ONBOARDING'
    title: string
    description: string
    cta: string
}

export function GrowthNudges() {
  const [isVisible, setIsVisible] = useState(true)

  // In production, these would be fetched based on user state
  const nudges: NudgeProps[] = [
    {
        type: 'UPSELL',
        title: "Running Low on Minutes",
        description: "You have used 84% of your monthly generation quota. Upgrade now to avoid service interruption.",
        cta: "Upgrade to Pro"
    },
    {
        type: 'ONBOARDING',
        title: "Finish Your Brand Kit",
        description: "Creators with custom fonts and logos see 30% higher engagement. Complete yours today.",
        cta: "Setup Brand Kit"
    }
  ]

  if (!isVisible) return null

  return (
    <AnimatePresence>
        <div className="space-y-4 mb-10">
            {nudges.map((nudge, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <Card className={`relative overflow-hidden border-none p-6 rounded-[2rem] ${
                        nudge.type === 'UPSELL' ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                    }`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-2xl ${
                                    nudge.type === 'UPSELL' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                                }`}>
                                    {nudge.type === 'UPSELL' ? (
                                        <Zap className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    )}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-black uppercase tracking-widest ${
                                        nudge.type === 'UPSELL' ? 'text-blue-400' : 'text-emerald-400'
                                    }`}>
                                        {nudge.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed max-w-xl">
                                        {nudge.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button className={`rounded-xl h-10 text-[10px] font-black uppercase tracking-widest px-6 ${
                                    nudge.type === 'UPSELL' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                } text-white`}>
                                    {nudge.cta}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-500 hover:text-white"
                                    onClick={() => setIsVisible(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    </AnimatePresence>
  )
}

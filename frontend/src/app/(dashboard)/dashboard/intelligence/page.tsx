"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Target,
  CheckCircle2,
  AlertCircle,
  Minus,
  ArrowRight,
  BarChart3,
  Cpu,
  Eye
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { analyzeClipIntelligence, type ClipIntelligenceInput } from "@/lib/ai/growth-intelligence"

export default function IntelligencePage() {
  const [input, setInput] = useState<Partial<ClipIntelligenceInput>>({
    durationSeconds: 30,
    niche: "finance",
    platform: "TIKTOK",
    hookType: "CURIOSITY_GAP",
    postingHour: 19,
    hasCaption: true,
    hasFaceOnScreen: false,
  })
  const [report, setReport] = useState(() => analyzeClipIntelligence(input as ClipIntelligenceInput))

  const handleAnalyze = () => {
    const result = analyzeClipIntelligence(input as ClipIntelligenceInput)
    setReport(result)
  }

  const scoreColor = report.viralMomentumScore >= 80 ? "text-emerald-500" :
    report.viralMomentumScore >= 60 ? "text-blue-500" :
    report.viralMomentumScore >= 40 ? "text-orange-500" : "text-red-500"

  const scoreBg = report.viralMomentumScore >= 80 ? "bg-emerald-500/10" :
    report.viralMomentumScore >= 60 ? "bg-blue-500/10" :
    report.viralMomentumScore >= 40 ? "bg-orange-500/10" : "bg-red-500/10"

  const hookColors: Record<string, string> = {
    ELITE: "bg-emerald-500 text-white",
    STRONG: "bg-blue-500 text-white",
    AVERAGE: "bg-orange-500/20 text-orange-500",
    WEAK: "bg-red-500/20 text-red-500",
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Growth Intelligence</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Predict viral performance before you publish</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Moat Engine: Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Analyzer Input */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Clip Analyzer</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Platform</label>
              <select
                value={input.platform}
                onChange={e => setInput(p => ({ ...p, platform: e.target.value as any }))}
                className="w-full bg-slate-800 border-slate-700 rounded-xl h-11 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="TIKTOK">TikTok</option>
                <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
                <option value="INSTAGRAM_REELS">Instagram Reels</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Niche</label>
              <select
                value={input.niche}
                onChange={e => setInput(p => ({ ...p, niche: e.target.value }))}
                className="w-full bg-slate-800 border-slate-700 rounded-xl h-11 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="finance">Finance</option>
                <option value="podcast">Podcast</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                Clip Length: <span className="text-white">{input.durationSeconds}s</span>
              </label>
              <input
                type="range"
                min={5} max={90}
                value={input.durationSeconds}
                onChange={e => setInput(p => ({ ...p, durationSeconds: Number(e.target.value) }))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hook Type</label>
              <select
                value={input.hookType}
                onChange={e => setInput(p => ({ ...p, hookType: e.target.value as any }))}
                className="w-full bg-slate-800 border-slate-700 rounded-xl h-11 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="CURIOSITY_GAP">Curiosity Gap</option>
                <option value="FEAR_OF_LOSS">Fear of Loss</option>
                <option value="CONTROVERSY">Controversy</option>
                <option value="DIRECT_PROBLEM">Direct Problem</option>
                <option value="DISCOVERY">Discovery</option>
                <option value="UNKNOWN">Unknown / None</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                Posting Hour: <span className="text-white">{input.postingHour}:00</span>
              </label>
              <input
                type="range"
                min={0} max={23}
                value={input.postingHour}
                onChange={e => setInput(p => ({ ...p, postingHour: Number(e.target.value) }))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.hasCaption}
                  onChange={e => setInput(p => ({ ...p, hasCaption: e.target.checked }))}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Captions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.hasFaceOnScreen}
                  onChange={e => setInput(p => ({ ...p, hasFaceOnScreen: e.target.checked }))}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Face on Screen</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl h-14 mt-2"
          >
            <Zap className="w-4 h-4 mr-2" />
            Run Intelligence Analysis
          </Button>
        </Card>

        {/* RIGHT: Intelligence Report */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Score Card */}
          <Card className={`${scoreBg} border-none p-10 rounded-[3rem] relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Viral Momentum Scoreâ„¢</p>
                <div className="flex items-baseline gap-4">
                  <h2 className={`text-8xl font-black ${scoreColor} italic`}>{report.viralMomentumScore}</h2>
                  <span className="text-2xl font-bold text-slate-500">/100</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hook Strength</p>
                  <Badge className={`${hookColors[report.hookStrength]} px-4 py-1.5 text-sm font-black uppercase tracking-widest`}>
                    {report.hookStrength}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reach Multiplier</p>
                  <p className="text-3xl font-black text-white">{report.expectedReachMultiplier}x</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Retention */}
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Retention Forecast</h3>
              </div>
              <p className="text-5xl font-black text-white mb-2">{report.retentionForecast}%</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">of viewers reaching 80% completion</p>
              <div className="mt-6 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${report.retentionForecast}%` }} />
              </div>
            </Card>

            {/* Optimizations */}
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Optimizations</h3>
              </div>
              {report.recommendedOptimizations.length === 0 ? (
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">All signals are optimal.</p>
              ) : (
                <div className="space-y-3">
                  {report.recommendedOptimizations.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <ArrowRight className="w-3 h-3 text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">{opt}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Insights Stream */}
          <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Intelligence Signals</h3>
            </div>
            <div className="space-y-4">
              {report.insights.map((insight, i) => {
                const Icon = insight.signal === "POSITIVE" ? CheckCircle2 :
                  insight.signal === "NEGATIVE" ? AlertCircle : Minus
                const color = insight.signal === "POSITIVE" ? "text-emerald-500" :
                  insight.signal === "NEGATIVE" ? "text-red-400" : "text-slate-500"
                const bg = insight.signal === "POSITIVE" ? "bg-emerald-500/5 border-emerald-500/10" :
                  insight.signal === "NEGATIVE" ? "bg-red-500/5 border-red-500/10" : "bg-white/5 border-white/5"
                return (
                  <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${bg}`}>
                    <Icon className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{insight.category}</span>
                        <span className={`text-[10px] font-black ${color}`}>
                          {insight.impact > 0 ? `+${insight.impact}` : insight.impact} pts
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

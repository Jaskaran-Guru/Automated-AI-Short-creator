"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  TrendingUp,
  Twitter,
  Linkedin,
  Download,
  RefreshCcw,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SharePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState({
    creator: "Jaskaran Guru",
    clipsGenerated: 24,
    timeSavedHours: 18,
    scheduledPosts: 12,
    growthScore: 84,
    reachEst: 42000,
    streak: 7
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mocking report generation
    setTimeout(() => {
        setWeeklyStats(prev => ({
            ...prev,
            clipsGenerated: prev.clipsGenerated + 2,
            growthScore: Math.min(100, prev.growthScore + 1)
        }));
        setIsGenerating(false);
    }, 2000);
  };

  const twitterText = encodeURIComponent(
    `This week I created ${weeklyStats.clipsGenerated} viral clips, saved ${weeklyStats.timeSavedHours}h of editing time, and hit a Growth Score™ of ${weeklyStats.growthScore}/100.\n\nAll powered by @VirailHQ 🚀\n\nGet your Growth Report → virail.com/growth-report`
  );

  const linkedinText = encodeURIComponent(
    `My weekly content output with VIRAIL:\n\n✅ ${weeklyStats.clipsGenerated} viral clips created\n⌛ ${weeklyStats.timeSavedHours} hours saved\n📅 ${weeklyStats.scheduledPosts} posts scheduled\n🎯 Growth Score™: ${weeklyStats.growthScore}/100\n\nThis is what "video growth infrastructure" looks like in practice.`
  );

  const handleExportPNG = () => {
    alert("Generating your high-resolution Growth Report image...");
    setTimeout(() => {
        alert("Export complete! Your report has been saved to your downloads.");
    }, 1500);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Weekly Growth Report</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Share your stats. Build your authority.</p>
        </div>
        <div className="flex gap-4">
            <Button 
                variant="outline" 
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl"
                onClick={handleGenerate}
                disabled={isGenerating}
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                Generate New Report
            </Button>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
              Week of Apr 21–27, 2026
            </Badge>
        </div>
      </div>

      {/* Shareable Card */}
      <div id="share-card" className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-white/10 p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">VIRAIL</span>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Weekly Growth Report
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Creator</p>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{weeklyStats.creator}</h2>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Clips Created</p>
              <p className="text-4xl font-black text-white">{weeklyStats.clipsGenerated}</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Hours Saved</p>
              <p className="text-4xl font-black text-white">{weeklyStats.timeSavedHours}h</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Posts Scheduled</p>
              <p className="text-4xl font-black text-white">{weeklyStats.scheduledPosts}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">VIRAIL Growth Score™</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-blue-500 italic">{weeklyStats.growthScore}</span>
                <span className="text-2xl font-bold text-slate-600">/100</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Est. Brand Reach</p>
              <p className="text-3xl font-black text-white">{weeklyStats.reachEst.toLocaleString()}</p>
              <div className="flex items-center gap-1 justify-end mt-1 text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-bold">{weeklyStats.streak}-day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${twitterText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full h-14 bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-black uppercase tracking-widest rounded-2xl text-xs">
            <Twitter className="w-4 h-4 mr-2" />
            Share on X / Twitter
          </Button>
        </a>

        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&text=${linkedinText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full h-14 bg-[#0A66C2] hover:bg-[#0958a8] text-white font-black uppercase tracking-widest rounded-2xl text-xs">
            <Linkedin className="w-4 h-4 mr-2" />
            Share on LinkedIn
          </Button>
        </a>

        <Button
          variant="outline"
          className="w-full h-14 border-slate-800 hover:bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl text-xs"
          onClick={handleExportPNG}
        >
          <Download className="w-4 h-4 mr-2" />
          Export as PNG
        </Button>
      </div>
    </div>
  );
}

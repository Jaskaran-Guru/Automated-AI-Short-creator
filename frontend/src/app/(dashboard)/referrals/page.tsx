"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  TrendingUp, 
  Share2,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";

export default function ReferralsPage() {
  const posthog = usePostHog();
  const [userData, setUserData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/stats"); // Reuse stats to get user info or add user info to stats
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const referralLink = userData?.referralCode 
    ? `${window.location.origin}?ref=${userData.referralCode}`
    : "Loading...";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    posthog.capture('copied_referral_link');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
           Referral Program
        </Badge>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase letter-spacing-widest">
          Grow Together. <span className="text-blue-500">Earn Together.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Invite your friends to Virail and earn free processing minutes for every successful signup. Your friends get a 20% discount on their first month.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-8 space-y-8">
           <Card className="bg-slate-900/50 border-slate-800 glass-panel rounded-[3rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <Gift className="w-48 h-48 text-blue-500 rotate-12" />
              </div>
              <div className="relative z-10 space-y-10">
                 <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white uppercase">Your Invite Link</h3>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-400 overflow-hidden truncate">
                          {referralLink}
                       </div>
                       <Button 
                          onClick={handleCopy}
                          className={`rounded-2xl px-8 font-bold transition-all ${copied ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
                       >
                          {copied ? <Check className="w-5 h-5" /> : <><Copy className="w-5 h-5 mr-2" /> Copy Link</>}
                       </Button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Friends Joined</p>
                       <div className="flex items-center gap-3">
                          <Users className="w-6 h-6 text-blue-400" />
                          <h4 className="text-3xl font-black text-white">{userData?.referralCount || 0}</h4>
                       </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Rewards</p>
                       <div className="flex items-center gap-3">
                          <Zap className="w-6 h-6 text-yellow-400" />
                          <h4 className="text-3xl font-black text-white">{userData?.rewardCredits || 0}m</h4>
                       </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Pending</p>
                       <div className="flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-slate-500" />
                          <h4 className="text-3xl font-black text-white">0</h4>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] p-8">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                 </div>
                 <h4 className="text-lg font-bold text-white uppercase mb-2">Share on Social</h4>
                 <p className="text-slate-500 text-sm mb-6">Promote your link on TikTok or Reels and earn unlimited credits as your audience grows.</p>
                 <Button variant="outline" className="w-full rounded-xl border-slate-800 font-bold">
                    <Share2 className="w-4 h-4 mr-2" /> Share Post
                 </Button>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] p-8">
                 <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-yellow-400" />
                 </div>
                 <h4 className="text-lg font-bold text-white uppercase mb-2">Earn 30m / Invite</h4>
                 <p className="text-slate-500 text-sm mb-6">Get 30 bonus processing minutes for every friend who signs up using your link.</p>
                 <Button variant="outline" className="w-full rounded-xl border-slate-800 font-bold">
                    Learn More
                 </Button>
              </Card>
           </div>
        </div>

        {/* Right Column: Leaderboard/Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="bg-slate-900/50 border-slate-800 rounded-[3rem] p-8">
              <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-green-500" /> Top Affiliates
              </h3>
              <div className="space-y-6">
                 {[
                    { name: "Alex Viral", count: 142, reward: "4,260m" },
                    { name: "ShortsGuru", count: 98, reward: "2,940m" },
                    { name: "DailyClips", count: 85, reward: "2,550m" },
                    { name: "CreativeAI", count: 64, reward: "1,920m" },
                 ].map((aff, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                             #{i+1}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white">{aff.name}</p>
                             <p className="text-[10px] text-slate-500">{aff.count} friends</p>
                          </div>
                       </div>
                       <Badge variant="outline" className="text-blue-400 font-black text-[10px]">{aff.reward}</Badge>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="relative z-10">
                 <h3 className="text-2xl font-black uppercase mb-4 leading-tight">Become an Ambassador</h3>
                 <p className="text-blue-100 text-sm mb-8 opacity-90">Are you a creator with 10k+ followers? Join our official partner program for revenue share.</p>
                 <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl py-6 font-black uppercase tracking-widest text-xs">
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-20">
                 <Users className="w-40 h-40" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

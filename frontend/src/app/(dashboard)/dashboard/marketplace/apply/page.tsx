"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle2, 
  Target,
  Sparkles,
  TrendingUp,
  Loader2
} from "lucide-react";

export default function CreatorApplyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
        <div className="max-w-2xl mx-auto p-8 pt-32 text-center space-y-8">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-500 mb-8">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Application Received</h1>
            <p className="text-slate-500 text-lg">Our Marketplace Curation team will review your viral performance metrics and reach out via email within 48 hours.</p>
            <Button variant="premium" onClick={() => router.push("/dashboard/marketplace")}>
                Return to Marketplace
            </Button>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-12">
      <Button 
        variant="ghost" 
        className="text-slate-400 hover:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-4">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Become a Creator</h1>
        <p className="text-slate-500 text-lg">Sell your viral blueprints and templates to thousands of users on Virail.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <h3 className="text-xl font-bold text-white uppercase">Passive Income</h3>
            <p className="text-sm text-slate-500">Earn 70% of every sale. Payments are automated via Stripe Connect.</p>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 space-y-4">
            <Target className="w-8 h-8 text-purple-500" />
            <h3 className="text-xl font-bold text-white uppercase">Build Authority</h3>
            <p className="text-sm text-slate-500">Get your blueprints featured on the front page of our creator ecosystem.</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[3rem] p-10 glass-panel">
         <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Portfolio Link (TikTok/Reels/YT)</label>
                <input 
                    required
                    placeholder="https://tiktok.com/@yourusername" 
                    className="w-full bg-slate-950 border-slate-800 rounded-2xl p-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Describe your Viral Strategy</label>
                <textarea 
                    required
                    rows={4}
                    placeholder="How do you consistently generate views?" 
                    className="w-full bg-slate-950 border-slate-800 rounded-2xl p-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
            </div>
            <Button 
                type="submit"
                disabled={submitting}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl text-xs"
            >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
            </Button>
         </form>
      </Card>
    </div>
  );
}

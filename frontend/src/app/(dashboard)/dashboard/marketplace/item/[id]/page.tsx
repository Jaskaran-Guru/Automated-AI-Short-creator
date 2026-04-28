"use client"

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Mock data for the item
  const items: any = {
    "1": {
      name: "The 'High-Retention' Hook Pack",
      price: 49,
      creator: "Alex Growth",
      description: "25 psychological hook templates specifically designed to stop the scroll in the first 3 seconds.",
      features: [
        "25 Proven Hook Scripts",
        "Visual Cues Guide",
        "A/B Testing Framework",
        "Lifetime Updates"
      ],
      stats: { usage: "1,420+", success: "92%", avgViews: "250k+" }
    },
    "2": {
      name: "Podcast Viral Blueprint",
      price: 129,
      creator: "PodMaster Pro",
      description: "The complete infrastructure for turning long podcasts into short-form viral machines.",
      features: [
        "AI Selection Prompts",
        "Editing Style Preset",
        "Distribution Calendar",
        "Guest Bio Templates"
      ],
      stats: { usage: "850+", success: "88%", avgViews: "500k+" }
    },
    "3": {
      name: "Neon-Minimalist Captions",
      price: 0,
      creator: "Virail Official",
      description: "Optimized caption styling for high readability and retention on mobile devices.",
      features: [
        "One-click Install",
        "Custom Color Profiles",
        "Emoji Integration",
        "Animation Presets"
      ],
      stats: { usage: "5,600+", success: "95%", avgViews: "1M+" }
    }
  };

  const item = items[id as string] || items["1"];

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/marketplace/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: id,
          item_name: item.name,
          price: item.price
        })
      });
      if (res.ok) {
        alert(`Successfully purchased ${item.name}! It is now available in your library.`);
      }
    } catch (err) {
      console.error("Purchase failed");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <Button 
        variant="ghost" 
        className="text-slate-400 hover:text-white mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-7 space-y-8">
           <div className="space-y-4">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4">Template Detail</Badge>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">{item.name}</h1>
              <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
           </div>

           <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Usage</p>
                 <p className="text-2xl font-black text-white">{item.stats.usage}</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Success</p>
                 <p className="text-2xl font-black text-emerald-500">{item.stats.success}</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Views</p>
                 <p className="text-2xl font-black text-blue-400">{item.stats.avgViews}</p>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {item.features.map((f: string) => (
                    <div key={f} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                       <CheckCircle2 className="w-5 h-5 text-blue-500" />
                       <span className="text-sm font-medium text-slate-300">{f}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Checkout Card */}
        <div className="lg:col-span-5">
           <Card className="bg-slate-900/80 border-slate-800 rounded-[3rem] p-10 glass-panel sticky top-8">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-500">
                        {item.creator.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white">{item.creator}</p>
                        <p className="text-[10px] text-slate-500">Verified Partner</p>
                    </div>
                 </div>
                 <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 font-black">ACTIVE</Badge>
              </div>

              <div className="mb-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">One-time Investment</p>
                 <h2 className="text-5xl font-black text-white">{item.price === 0 ? 'FREE' : `$${item.price}`}</h2>
              </div>

              <div className="space-y-4 mb-10">
                 <div className="flex items-center gap-3 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Verified by Virail Growth Team
                 </div>
                 <div className="flex items-center gap-3 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Instant Library Access
                 </div>
              </div>

              <Button 
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-500/20"
                onClick={handleCheckout}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                {item.price === 0 ? 'Install Template' : 'Checkout Now'}
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

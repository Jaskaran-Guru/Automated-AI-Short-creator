"use client"

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MarketplacePage() {
  const items = [
    {
      id: "1",
      name: "The 'High-Retention' Hook Pack",
      type: "HOOK_PACK",
      description: "25 psychological hook templates specifically for SaaS & Fintech founders.",
      price: 49,
      usage: 1420,
      successRate: 92,
      creator: "Alex Growth",
      isFeatured: true
    },
    {
      id: "2",
      name: "Podcast Viral Blueprint",
      type: "CAMPAIGN_BLUEPRINT",
      description: "The exact clip-selection strategy used by the top 1% of business podcasts.",
      price: 129,
      usage: 850,
      successRate: 88,
      creator: "PodMaster Pro",
      isFeatured: false
    },
    {
      id: "3",
      name: "Neon-Minimalist Captions",
      type: "CAPTION_STYLE",
      description: "Ultra-clean caption design optimized for TikTok's current algorithm.",
      price: 0,
      usage: 5600,
      successRate: 95,
      creator: "Virail Official",
      isFeatured: false
    }
  ];

  const handlePurchase = (item: any) => {
    if (item.price === 0) {
        alert(`${item.name} installed to your library!`);
    } else {
        alert(`Redirecting to Stripe checkout for ${item.name} ($${item.price})...`);
    }
  }

  const handleApply = () => {
    alert("Application submitted! Our marketplace team will review your viral performance and reach out.");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Template Marketplace</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deploy proven growth strategies from top creators</p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    placeholder="Search blueprints..." 
                    className="bg-slate-900 border-slate-800 rounded-xl pl-10 pr-4 h-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl h-10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
            <Card key={item.id} className={`bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel group hover:border-blue-500/30 transition-all flex flex-col justify-between ${item.isFeatured ? 'ring-1 ring-blue-500/20' : ''}`}>
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] font-black uppercase tracking-widest px-3">
                            {item.type.replace('_', ' ')}
                        </Badge>
                        {item.isFeatured && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                <Sparkles className="w-2.5 h-2.5 mr-1 fill-amber-500" />
                                FEATURED
                            </Badge>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{item.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-8">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Users className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage</span>
                            </div>
                            <p className="text-sm font-black text-white">{item.usage.toLocaleString()}+</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success</span>
                            </div>
                            <p className="text-sm font-black text-emerald-500">{item.successRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-blue-500">
                                {item.creator.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{item.creator}</span>
                        </div>
                        <span className="text-xl font-black text-white">{item.price === 0 ? 'FREE' : `$${item.price}`}</span>
                    </div>
                    <Button 
                        onClick={() => handlePurchase(item)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl h-14"
                    >
                        {item.price === 0 ? 'Install Template' : 'Purchase Blueprint'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </Card>
        ))}

        <Card className="bg-slate-900/30 border border-slate-800 border-dashed p-10 rounded-[3rem] text-center flex flex-col items-center justify-center group cursor-pointer hover:bg-slate-900/50 transition-all">
            <div className="bg-blue-500/10 p-4 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter italic">Sell Your Strategy</h3>
            <p className="text-xs text-slate-500 max-w-[200px] mb-8 leading-relaxed">
                Turn your viral growth patterns into a recurring revenue stream.
            </p>
            <Button 
                variant="ghost" 
                className="text-blue-500 font-black uppercase tracking-widest text-[10px] hover:bg-blue-500/5"
                onClick={handleApply}
            >
                Apply to be a Creator &rarr;
            </Button>
        </Card>
      </div>
    </div>
  );
}

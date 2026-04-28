"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Zap, 
  Sparkles, 
  Building2, 
  ShieldCheck,
  CreditCard,
  BarChart3,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";

export default function BillingPage() {
  const posthog = usePostHog();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/workspace/current');
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.plan);
        }
      } catch (err) {
        console.error("Failed to fetch plan");
      }
    };
    fetchPlan();
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "For creators getting started.",
      price: billingCycle === "monthly" ? "19" : "15",
      features: [
        "60 processing minutes / mo",
        "AI Viral Moment Detection",
        "Unlimited Auto-Captions",
        "Standard Export (1080p)",
        "Email Support"
      ],
      cta: "Start Growing",
      variant: "outline",
      icon: Zap
    },
    {
      name: "Pro",
      description: "Automate your entire workflow.",
      price: billingCycle === "monthly" ? "49" : "39",
      features: [
        "300 processing minutes / mo",
        "Auto Distribution Engine",
        "Social Media Scheduler",
        "Advanced Analytics Dashboard",
        "Priority AI Processing",
        "Direct API Access"
      ],
      cta: "Go Pro Now",
      variant: "premium",
      icon: Sparkles,
      popular: true
    },
    {
      name: "Agency",
      description: "Scale your content business.",
      price: billingCycle === "monthly" ? "149" : "119",
      features: [
        "1500 processing minutes / mo",
        "Multi-Client Management",
        "White-Label Dashboards",
        "Bulk Video Processing",
        "Custom Workflow Integration",
        "Dedicated Account Manager"
      ],
      cta: "Contact Sales",
      variant: "outline",
      icon: Building2
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-10">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase letter-spacing-widest">
          Choose Your <span className="text-blue-500">Growth Plan</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Scale your short-form content from a few clips to a global distribution machine. No hidden fees. Cancel anytime.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-800 rounded-full relative p-1 transition-all"
          >
            <motion.div 
              animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              className="w-6 h-6 bg-blue-500 rounded-full"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly</span>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] uppercase font-black">Save 20%</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative group h-full`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                 <Badge className="bg-blue-500 text-white border-none px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/40">
                    Most Popular
                 </Badge>
              </div>
            )}

            <Card className={`h-full bg-slate-900/50 border-slate-800 rounded-[3rem] p-10 flex flex-col glass-panel transition-all hover:border-slate-700 ${plan.popular ? "border-blue-500/30 ring-1 ring-blue-500/20" : ""}`}>
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                   <plan.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${plan.price}</span>
                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">/ month</span>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.popular ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.variant as any} 
                className={`w-full rounded-2xl py-7 font-black uppercase tracking-widest text-xs transition-all ${
                  currentPlan.toUpperCase() === plan.name.toUpperCase() 
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-none cursor-default" 
                  : plan.popular ? "shadow-lg shadow-blue-500/20" : "border-slate-800 hover:bg-slate-800"
                }`}
                onClick={() => {
                  if (currentPlan.toUpperCase() !== plan.name.toUpperCase()) {
                    posthog.capture('clicked_upgrade', { plan: plan.name, cycle: billingCycle });
                  }
                }}
              >
                {currentPlan.toUpperCase() === plan.name.toUpperCase() ? "Current Plan ✓" : plan.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10 border-t border-slate-800/50">
        <div className="flex flex-col items-center text-center space-y-3">
           <div className="p-3 rounded-2xl bg-slate-900/50 text-slate-500"><ShieldCheck className="w-6 h-6" /></div>
           <h4 className="text-xs font-black uppercase tracking-widest text-white">Secure Payments</h4>
           <p className="text-[10px] text-slate-500 font-medium">PCI compliant stripe infrastructure.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
           <div className="p-3 rounded-2xl bg-slate-900/50 text-slate-500"><CreditCard className="w-6 h-6" /></div>
           <h4 className="text-xs font-black uppercase tracking-widest text-white">Cancel Anytime</h4>
           <p className="text-[10px] text-slate-500 font-medium">No long term contracts or hidden fees.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
           <div className="p-3 rounded-2xl bg-slate-900/50 text-slate-500"><BarChart3 className="w-6 h-6" /></div>
           <h4 className="text-xs font-black uppercase tracking-widest text-white">Detailed Stats</h4>
           <p className="text-[10px] text-slate-500 font-medium">Track ROI for every minute processed.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
           <div className="p-3 rounded-2xl bg-slate-900/50 text-slate-500"><Globe className="w-6 h-6" /></div>
           <h4 className="text-xs font-black uppercase tracking-widest text-white">Global Distribution</h4>
           <p className="text-[10px] text-slate-500 font-medium">Post to YouTube, TikTok & Reels.</p>
        </div>
      </div>
    </div>
  );
}

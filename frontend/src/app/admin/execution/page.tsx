import { protectAdminPage } from "@/lib/admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target, XCircle, TrendingUp, AlertTriangle,
  CheckCircle2, ArrowRight, BarChart3, Zap,
  Clock, Lightbulb
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ExecutionPage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  // In production: fetched from a WeeklyReview DB model
  const lastWeek = {
    mrrDelta: +4200,
    trialsStarted: 12,
    demosBooked: 14,
    dealsClosed: 3,
    churnedAccounts: 1,
    contentPieces: 8,
    leadsContacted: 52,
  };

  const revenueMovers = [
    { action: "Agency outreach sequence sent to 18 leads", impact: "+$2,400 MRR", type: "SALES" },
    { action: "Published 'State of Finance Shorts' benchmark post", impact: "+6 inbound trials", type: "CONTENT" },
    { action: "Fixed onboarding bug reducing activation drop-off", impact: "+11% activation rate", type: "PRODUCT" },
  ];

  const bottlenecks = [
    { issue: "Demo-to-close rate fell from 34% to 28%", root: "Proposal template too generic. Not niche-specific.", fix: "Rewrite agency proposal template this week." },
    { issue: "Content output below target (8 vs 15 pieces)", root: "No dedicated content time blocked.", fix: "Block 2h per day for content. No exceptions." },
  ];

  const removeList = [
    "Rebuilding the settings page (no revenue impact)",
    "Responding to non-customer Twitter DMs",
    "Weekly internal reporting decks",
  ];

  const thisWeekPriorities = [
    { priority: "Close 2 agency deals in pipeline", owner: "Sales", dueDay: "Wednesday" },
    { priority: "Launch cold email sequence to 30 new SaaS leads", owner: "Growth", dueDay: "Monday" },
    { priority: "Publish 3 case studies (Skyline, TechPod, FitFlow)", owner: "Content", dueDay: "Friday" },
    { priority: "Fix scheduler timezone bug (1 support ticket/day)", owner: "Eng", dueDay: "Tuesday" },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Execution Review</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Weekly Discipline System â€” What Moved Revenue. What Didn't.</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
          Week of Apr 21 â€” 27
        </Badge>
      </div>

      {/* Last Week Numbers */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-10">
        {[
          { label: "MRR Delta", value: `+$${lastWeek.mrrDelta.toLocaleString()}`, good: true },
          { label: "Trials", value: lastWeek.trialsStarted, good: true },
          { label: "Demos", value: lastWeek.demosBooked, good: true },
          { label: "Closed", value: lastWeek.dealsClosed, good: true },
          { label: "Churned", value: lastWeek.churnedAccounts, good: false },
          { label: "Content", value: `${lastWeek.contentPieces}/15`, good: false },
          { label: "Leads Out", value: lastWeek.leadsContacted, good: true },
        ].map((item) => (
          <Card key={item.label} className="bg-slate-900/50 border-slate-800 p-4 rounded-[1.5rem] glass-panel text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">{item.label}</p>
            <p className={`text-xl font-black ${item.good ? 'text-white' : 'text-red-400'}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* What Moved Revenue */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">What Moved Revenue</h3>
          </div>
          <div className="space-y-4">
            {revenueMovers.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white mb-1">{item.action}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[9px] font-black uppercase px-2">
                      {item.impact}
                    </Badge>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottlenecks */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Bottlenecks Found</h3>
          </div>
          <div className="space-y-4">
            {bottlenecks.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs font-bold text-white mb-2">{item.issue}</p>
                <p className="text-[10px] text-amber-400 font-bold mb-2">Root: {item.root}</p>
                <div className="flex items-center gap-2 text-[10px] text-white font-black">
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  {item.fix}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* This Week Priorities */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">This Week â€” Do These Only</h3>
          </div>
          <div className="space-y-3">
            {thisWeekPriorities.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-black text-slate-600 mt-0.5">{i + 1}.</span>
                  <div>
                    <p className="text-xs font-bold text-white">{item.priority}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      {item.owner} Â· Due {item.dueDay}
                    </p>
                  </div>
                </div>
                <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </Card>

        {/* Remove This Week */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel border-red-500/10">
          <div className="flex items-center gap-3 mb-8">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Remove This Week</h3>
          </div>
          <div className="space-y-3 mb-8">
            {removeList.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                <XCircle className="w-3.5 h-3.5 text-red-500/50 shrink-0" />
                <p className="text-xs text-slate-400 line-through">{item}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Execution Rule</span>
            </div>
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              "If it doesn't increase revenue, retention, distribution, or conversion â€” it does not happen this week."
            </p>
          </div>
        </Card>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl h-14 text-sm">
        Lock In This Week's Execution Plan
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

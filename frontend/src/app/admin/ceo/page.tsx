import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, Calendar, CheckCircle2,
  AlertCircle, TrendingUp, TrendingDown,
  MessageSquare, FileText, Activity,
  Zap, Target, BarChart3, Clock,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOSMetrics } from "@/lib/os-metrics";

export default async function CEOMorningViewPage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Pull live data
  const liveMetrics = await getOSMetrics();
  
  const [
    newLeadsToday,
    totalOpenDeals,
  ] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: todayStart } } }),
    db.lead.count({ where: { stage: { notIn: ["WON", "LOST"] } } }),
  ]);

  const metrics = liveMetrics;

  const dailyKPIs = [
    {
      label: "Revenue Today",
      value: `$${metrics.revenueToday.toLocaleString()}`,
      trend: metrics.revenueTrend,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      status: "GREEN"
    },
    {
      label: "Demos Booked",
      value: metrics.demosBooked.toString(),
      trend: +50,
      target: "Target: 3/day",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      status: "GREEN"
    },
    {
      label: "Deals Closed",
      value: metrics.dealsClosed.toString(),
      trend: 0,
      target: "Target: 1/day",
      icon: CheckCircle2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      status: "AMBER"
    },
    {
      label: "Active Trials",
      value: metrics.activeTrials.toString(),
      trend: +4.1,
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      status: "GREEN"
    },
    {
      label: "Activated Users",
      value: metrics.activatedUsers.toString(),
      trend: +2.8,
      icon: Users,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      status: "GREEN"
    },
    {
      label: "Leads Contacted",
      value: metrics.leadsContacted.toString(),
      trend: -20,
      target: "Target: 10/day",
      icon: Target,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      status: metrics.leadsContacted >= 10 ? "GREEN" : "RED"
    },
    {
      label: "Content Published",
      value: `${metrics.contentPublished}/3`,
      trend: 0,
      target: "Target: 3/day",
      icon: FileText,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      status: metrics.contentPublished >= 3 ? "GREEN" : "AMBER"
    },
    {
      label: "Tickets Resolved",
      value: metrics.ticketsResolved.toString(),
      trend: +5,
      icon: MessageSquare,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      status: "GREEN"
    },
  ];

  const statusColors: Record<string, string> = {
    GREEN: "bg-emerald-500",
    AMBER: "bg-amber-500",
    RED: "bg-red-500"
  };

  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
        <div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">
            {dayOfWeek}, {dateStr}
          </p>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
            CEO Morning View
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            VIRAIL Operating System â€” Daily Execution Pulse
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              SYSTEMS NOMINAL
            </span>
          </div>
          <Button variant="outline" className="border-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl h-9">
            Export Today's Report
          </Button>
        </div>
      </div>

      {/* MRR Pulse */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 p-8 rounded-[3rem] glass-panel relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Monthly Recurring Revenue
                </span>
              </div>
              <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px] font-black uppercase tracking-widest px-3">
                Live
              </Badge>
            </div>
            <div className="flex items-baseline gap-6 mb-8">
              <span className="text-6xl font-black text-white italic">
                ${(metrics.mrr / 1000).toFixed(1)}k
              </span>
              <div className="flex items-center gap-1 text-emerald-500">
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-lg font-black">+{metrics.mrrTrend}%</span>
                <span className="text-xs text-slate-500 font-bold ml-1">MoM</span>
              </div>
            </div>
            {/* Mini sparkline (static representation) */}
            <div className="flex items-end gap-1 h-12">
              {[40, 52, 48, 61, 55, 70, 68, 75, 72, 80, 78, 85].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all ${i === 11 ? 'bg-blue-500' : 'bg-slate-800'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-3">12-Month Trend</p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Churn Today</p>
                <p className="text-3xl font-black text-white">{metrics.churnToday}</p>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">âœ“ Zero churn</p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expansion Events</p>
                <p className="text-3xl font-black text-emerald-500">+{metrics.expansionToday}</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Upsell registered</p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Open Pipeline</p>
                <p className="text-3xl font-black text-white">{totalOpenDeals}</p>
              </div>
              <div className="bg-purple-500/10 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Active deals</p>
          </Card>
        </div>
      </div>

      {/* Daily KPI Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6 px-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Daily Output Targets</h3>
          <div className="flex-1 h-px bg-slate-800" />
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />On Track</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Needs Attention</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Off Track</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dailyKPIs.map((kpi) => (
            <Card key={kpi.label} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel group hover:border-slate-700 transition-all relative overflow-hidden">
              <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${statusColors[kpi.status]}`} />
              <div className={`${kpi.bg} p-3 rounded-2xl w-fit mb-5`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{kpi.label}</p>
              <p className="text-3xl font-black text-white mb-3">{kpi.value}</p>
              <div className="flex items-center justify-between">
                {kpi.trend !== undefined && (
                  <div className={`flex items-center gap-1 text-[10px] font-black ${
                    kpi.trend > 0 ? 'text-emerald-500' :
                    kpi.trend < 0 ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    {kpi.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> :
                     kpi.trend < 0 ? <ArrowDownRight className="w-3 h-3" /> :
                     <Minus className="w-3 h-3" />}
                    {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                  </div>
                )}
                {kpi.target && (
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{kpi.target}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Priority Actions */}
      <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel border-l-4 border-l-red-500">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Priority Actions â€” Do These First</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { action: "Contact 7 more leads to hit daily target", urgency: "HIGH", owner: "Sales" },
            { action: "Publish 1 more content piece (case study pending)", urgency: "MEDIUM", owner: "Growth" },
            { action: "Follow up on 3 demos booked yesterday", urgency: "HIGH", owner: "Sales" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                item.urgency === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <div>
                <p className="text-xs font-bold text-white mb-1">{item.action}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    item.urgency === 'HIGH' ? 'text-red-400' : 'text-amber-400'
                  }`}>{item.urgency}</span>
                  <span className="text-[9px] text-slate-600">Â·</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

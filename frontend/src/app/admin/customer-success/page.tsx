import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Heart, AlertTriangle, AlertCircle,
  CheckCircle2, TrendingDown, Zap, Phone,
  Mail, ArrowRight, Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CustomerSuccessPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "SUPPORT"]);

  const users = await db.user.findMany({
    include: { memberships: { include: { workspace: true } } },
    orderBy: { updatedAt: 'asc' },
    take: 50
  });

  // Mock health segmentation (in production: from retention.ts batch run)
  const segments = {
    CHAMPION: users.slice(0, 8),
    HEALTHY:  users.slice(8, 22),
    AT_RISK:  users.slice(22, 35),
    CRITICAL: users.slice(35, 50),
  };

  const segmentConfig = {
    CHAMPION: {
      icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10",
      border: "border-emerald-500/20", label: "Champions",
      action: "Upsell / Referral Ask", count: segments.CHAMPION.length
    },
    HEALTHY: {
      icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10",
      border: "border-blue-500/20", label: "Healthy", 
      action: "Feature Adoption Nudge", count: segments.HEALTHY.length
    },
    AT_RISK: {
      icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10",
      border: "border-amber-500/20", label: "At Risk",
      action: "Re-engage Within 48h", count: segments.AT_RISK.length
    },
    CRITICAL: {
      icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10",
      border: "border-red-500/20", label: "Critical",
      action: "Call Today", count: segments.CRITICAL.length
    },
  };

  type Tier = keyof typeof segmentConfig;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Customer Success</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Segmented Health Dashboard â€” Act on the Right Users Every Day</p>
        </div>
        <Button variant="outline" className="border-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl h-9">
          Run Health Analysis
        </Button>
      </div>

      {/* Segment Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {(Object.keys(segmentConfig) as Tier[]).map((tier) => {
          const cfg = segmentConfig[tier];
          return (
            <Card key={tier} className={`bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel ${cfg.border} border`}>
              <div className={`${cfg.bg} p-3 rounded-2xl w-fit mb-4`}>
                <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{cfg.label}</p>
              <p className="text-4xl font-black text-white mb-2">{cfg.count}</p>
              <p className={`text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>{cfg.action}</p>
            </Card>
          );
        })}
      </div>

      {/* Priority Action List â€” CRITICAL + AT_RISK */}
      <div className="space-y-8">
        {(["CRITICAL", "AT_RISK"] as Tier[]).map((tier) => (
          <div key={tier}>
            <div className="flex items-center gap-3 mb-4 px-2">
              {tier === "CRITICAL"
                ? <AlertCircle className="w-4 h-4 text-red-500" />
                : <AlertTriangle className="w-4 h-4 text-amber-500" />
              }
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">
                {segmentConfig[tier].label} â€” {segmentConfig[tier].action}
              </h3>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="space-y-3">
              {segments[tier].slice(0, 5).map((user) => {
                const plan = user.memberships[0]?.workspace?.plan || "FREE";
                const daysSince = Math.floor(
                  (Date.now() - new Date(user.updatedAt || 0).getTime()) / 86400000
                );
                return (
                  <Card key={user.id} className="bg-slate-900/50 border-slate-800 p-5 rounded-[2rem] glass-panel hover:border-slate-700 transition-all group">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{user.name || user.email}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 shrink-0">
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Plan</p>
                          <Badge className={`text-[9px] font-black uppercase border-none mt-1 ${
                            plan === "FREE" ? "bg-slate-800 text-slate-400" :
                            plan === "PRO" ? "bg-blue-500/20 text-blue-400" :
                            "bg-purple-500/20 text-purple-400"
                          }`}>{plan}</Badge>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Last Seen</p>
                          <p className={`text-sm font-black mt-1 ${
                            daysSince > 14 ? "text-red-400" : daysSince > 7 ? "text-amber-400" : "text-white"
                          }`}>{daysSince}d ago</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white h-8 w-8">
                            <Mail className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white h-8 w-8">
                            <Phone className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white h-8 w-8">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

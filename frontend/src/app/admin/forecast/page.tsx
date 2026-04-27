import { protectAdminPage } from "@/lib/admin-auth";
import { Card } from "@/components/ui/card";
import {
  TrendingUp, AlertCircle, AlertTriangle,
  Info, CheckCircle2, BarChart3,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projectRevenue, CURRENT_INPUTS } from "@/lib/revenue-forecast";

export default async function ForecastPage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  const projection = projectRevenue(CURRENT_INPUTS);

  const confidenceStyle = {
    HIGH: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    LOW: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const severityIcon = {
    CRITICAL: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
    WARNING: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    INFO: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Revenue Forecast</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Predictability Engine â€” Remove Revenue Randomness</p>
        </div>
        <Badge variant="outline" className={`px-4 py-2 font-black text-xs ${confidenceStyle[projection.confidence]}`}>
          FORECAST CONFIDENCE: {projection.confidence}
        </Badge>
      </div>

      {/* Projections */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border-blue-500/20 p-10 rounded-[3rem] glass-panel">
          <TrendingUp className="w-8 h-8 text-blue-500 mb-6" />
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">7-Day Projection</p>
          <p className="text-6xl font-black text-white italic mb-4">
            ${projection.day7TotalMRR.toLocaleString()}
          </p>
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-500">
              +${projection.day7NewMRR.toLocaleString()} new MRR
            </span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 border-purple-500/20 p-10 rounded-[3rem] glass-panel">
          <BarChart3 className="w-8 h-8 text-purple-500 mb-6" />
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">30-Day Projection</p>
          <p className="text-6xl font-black text-white italic mb-4">
            ${projection.day30TotalMRR.toLocaleString()}
          </p>
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-500">
              +${projection.day30NewMRR.toLocaleString()} new MRR
            </span>
          </div>
        </Card>
      </div>

      {/* Risk Flags */}
      {projection.riskFlags.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel mb-8">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Revenue Risk Flags
          </h3>
          <div className="space-y-4">
            {projection.riskFlags.map((flag, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${
                flag.severity === 'CRITICAL' ? 'bg-red-500/5 border-red-500/20' :
                flag.severity === 'WARNING' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-blue-500/5 border-blue-500/20'
              }`}>
                <div className="flex items-start gap-3">
                  {severityIcon[flag.severity]}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{flag.metric}</span>
                      <Badge className={`text-[8px] font-black uppercase border-none ${
                        flag.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        flag.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>{flag.severity}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{flag.message}</p>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                      â†’ {flag.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sensitivity Analysis */}
      <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
        <div className="p-8 border-b border-slate-800 bg-slate-900/30">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Sensitivity Analysis â€” 30-Day Scenarios</h3>
        </div>
        {projection.sensitivity.map((s, i) => (
          <div key={i} className={`grid grid-cols-3 px-8 py-5 border-b border-slate-800/50 items-center ${i % 2 === 0 ? 'bg-white/[0.01]' : ''} ${i === 0 ? 'bg-blue-500/5' : ''}`}>
            <span className="text-sm font-bold text-white">{s.scenario}</span>
            <span className="text-lg font-black text-white text-center">${s.day30MRR.toLocaleString()}</span>
            <div className={`flex items-center justify-end gap-1 font-black text-sm ${s.delta >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
              {s.delta >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {s.delta >= 0 ? '+' : ''}${s.delta.toLocaleString()}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

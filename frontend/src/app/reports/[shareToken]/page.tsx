import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Play, 
  CheckCircle2,
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PublicReportPage({ params }: { params: { shareToken: string } }) {
  const report = await db.report.findUnique({
    where: { shareToken: params.shareToken },
    include: {
      client: {
        include: { brandKit: true }
      }
    }
  });

  if (!report) notFound();

  const data = report.data as any;
  const monthName = new Date(report.year, report.month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 py-20 px-6">
      {/* Premium Header */}
      <div className="max-w-5xl mx-auto mb-20 text-center">
        <div className="flex justify-center mb-10">
            <div className="bg-slate-900/50 p-4 rounded-[2rem] border border-white/5 flex items-center gap-4 px-8">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                    {report.client.logoUrl ? (
                        <img src={report.client.logoUrl} alt={report.client.name} className="w-full h-full object-cover" />
                    ) : (
                        <Zap className="w-6 h-6 text-blue-500" />
                    )}
                </div>
                <div className="text-left">
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">{report.client.name}</h1>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{report.client.niche || "Content Ecosystem"}</p>
                </div>
            </div>
        </div>
        
        <Badge variant="premium" className="mb-6">Monthly Performance Report</Badge>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {monthName} <span className="premium-gradient">{report.year}</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A comprehensive summary of your brand's growth and production efficiency powered by VIRAIL AI.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[2.5rem] glass-panel text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all" />
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-6" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Estimated Reach</p>
            <h3 className="text-5xl font-black text-white">{(data.reach || 0).toLocaleString()}</h3>
            <p className="text-xs text-emerald-500 font-bold mt-4">Brand Visibility Boost</p>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[2.5rem] glass-panel text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all" />
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-6" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Clips Published</p>
            <h3 className="text-5xl font-black text-white">{data.clips || 0}</h3>
            <p className="text-xs text-slate-400 mt-4">High-Retention Content</p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-10 rounded-[2.5rem] glass-panel text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
            <Clock className="w-8 h-8 text-emerald-500 mx-auto mb-6" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Work-Hours Saved</p>
            <h3 className="text-5xl font-black text-white">{data.hoursSaved || 0}h</h3>
            <p className="text-xs text-emerald-500 font-bold mt-4">Production Efficiency</p>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card className="bg-slate-900/50 border-slate-800 p-12 rounded-[3rem] glass-panel border-dashed">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h3 className="text-3xl font-black text-white mb-4">Executive Summary</h3>
                    <div className="space-y-4 max-w-xl">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                            <p className="leading-relaxed text-slate-400">
                                This month, our AI engine identified <span className="text-white font-bold">{data.clips} viral segments</span> from your raw footage, optimizing them for maximum cross-platform retention.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                            <p className="leading-relaxed text-slate-400">
                                All content was distributed automatically across <span className="text-white font-bold">TikTok, Reels, and Shorts</span>, maintaining a consistent brand presence without manual oversight.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center">
                    <div className="bg-blue-500/10 p-4 rounded-2xl mb-4">
                        <Share2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Total Impact</p>
                    <p className="text-xs text-slate-500 text-center uppercase tracking-widest leading-tight">Monthly Content <br/> Dominance Achieved</p>
                </div>
            </div>
        </Card>
      </div>

      <div className="mt-32 text-center text-slate-600">
          <p className="text-xs font-black uppercase tracking-[0.3em]">Powered by VIRAIL AI Technology</p>
      </div>
    </div>
  );
}

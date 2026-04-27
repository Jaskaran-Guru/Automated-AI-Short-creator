import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  ArrowUpRight,
  BarChart3,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function InsightsPage() {
  const { userId: clerkId } = await auth();
  const user = await db.user.findUnique({
    where: { clerkId: clerkId! },
    include: {
      recommendations: {
        where: { isDismissed: false },
        orderBy: { impactScore: 'desc' },
        take: 3
      }
    }
  });

  if (!user) return null;

  // Mocked ROI calculations for the demo
  const stats = {
    timeSaved: 142,
    reachEst: 85400,
    consistencyScore: 88,
    clipsToday: 12
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Growth Insights</h1>
          <p className="text-slate-400">Data-driven coaching to optimize your content strategy.</p>
        </div>
        <Badge variant="premium" className="px-4 py-2">
            AI CO-PILOT ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="bg-blue-500/10 p-4 rounded-2xl w-fit mb-6">
                <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Total Time Saved</p>
            <h3 className="text-5xl font-black text-white">{stats.timeSaved}h</h3>
            <p className="text-xs text-blue-400 font-bold mt-4 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Efficiency Boosted by 4.2x
            </p>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
            <div className="bg-purple-500/10 p-4 rounded-2xl w-fit mb-6">
                <Target className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Consistency Score</p>
            <h3 className="text-5xl font-black text-white">{stats.consistencyScore}%</h3>
            <p className="text-xs text-purple-400 font-bold mt-4 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                Top 12% of Creators
            </p>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="bg-emerald-500/10 p-4 rounded-2xl w-fit mb-6">
                <Users className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Est. Brand Reach</p>
            <h3 className="text-5xl font-black text-white">{stats.reachEst.toLocaleString()}</h3>
            <p className="text-xs text-emerald-500 font-bold mt-4 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% Growth vs Last Month
            </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4 px-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">AI Recommendations</h3>
            </div>
            
            {user.recommendations.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center rounded-[2.5rem] border-dashed">
                    <Zap className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generating your personalized strategy... Check back in 24h.</p>
                </Card>
            ) : (
                user.recommendations.map((rec) => (
                    <Card key={rec.id} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel group hover:border-yellow-500/30 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] font-black uppercase tracking-widest px-3">
                                {rec.type}
                            </Badge>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impact: {rec.impactScore}/100</span>
                        </div>
                        <p className="text-xl font-bold text-white leading-relaxed mb-6">
                            {rec.content}
                        </p>
                        <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="text-yellow-500 font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500/5">
                                Apply Strategy &rarr;
                            </Button>
                        </div>
                    </Card>
                ))
            )}
        </div>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <BarChart3 className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Platform Performance</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                    Based on your last 30 posts, your <span className="text-white font-bold">YouTube Shorts</span> are seeing the highest conversion rate to new followers.
                </p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">YouTube Shorts</span>
                        <span className="text-white">92% Engagement</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[92%]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mt-4">
                        <span className="text-slate-500">TikTok</span>
                        <span className="text-white">74% Engagement</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[74%]" />
                    </div>
                </div>
            </Card>

            <Card className="bg-slate-950/50 border-slate-800 p-8 rounded-[2.5rem] border-dashed text-center">
                <Zap className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Strategy Pro</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Unlock deep-niche benchmarks and competitor overlap analysis.
                </p>
                <Button variant="premium" className="w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">
                    Upgrade to Pro Insights
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

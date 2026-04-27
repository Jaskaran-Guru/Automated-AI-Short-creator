import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Gift, 
  Zap, 
  Copy, 
  Share2, 
  TrendingUp, 
  CheckCircle2,
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ReferralsPage() {
  const { userId: clerkId } = await auth();
  const user = await db.user.findUnique({
    where: { clerkId: clerkId! },
    include: {
      affiliate: true,
      referralsSent: { include: { referee: true } }
    }
  });

  if (!user) return null;

  const referralLink = `https://virail.com?ref=${user.affiliate?.code || user.id.slice(0, 8)}`;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Growth Program</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Invite creators & earn free generation credits</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
            PARTNER STATUS: ACTIVE
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-purple-700 p-10 rounded-[3rem] relative overflow-hidden border-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-20 -translate-y-20" />
            <div className="relative z-10">
                <Gift className="w-12 h-12 text-white mb-8" />
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4 leading-none">Give $50, Get $50.</h2>
                <p className="text-blue-100 font-medium max-w-lg mb-10 leading-relaxed">
                    Invite your creator friends to VIRAIL. When they upgrade to a paid plan, they get $50 off their first month, and you get $50 in generation credits.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex items-center justify-between">
                        <span className="text-sm font-mono text-white/80 px-4 truncate">{referralLink}</span>
                        <Button size="icon" className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest rounded-2xl px-8 h-14">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                    </Button>
                </div>
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <div className="flex items-center justify-between mb-8">
                    <div className="bg-blue-500/10 p-3 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">Live Stats</Badge>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Clicks</p>
                        <h3 className="text-3xl font-black text-white">{user.affiliate?.totalClicks || 0}</h3>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Signups</p>
                        <h3 className="text-3xl font-black text-white">{user.affiliate?.totalSignups || 0}</h3>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Credits Earned</p>
                    <h3 className="text-3xl font-black text-emerald-500">$250.00</h3>
                </div>
            </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Referrals</h3>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>
            <div className="p-8">
                {user.referralsSent.length === 0 ? (
                    <div className="text-center py-12">
                        <Zap className="w-8 h-8 text-slate-800 mx-auto mb-4" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No referrals yet. Send your first link!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {user.referralsSent.map((ref) => (
                            <div key={ref.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-500">
                                        {ref.referee?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{ref.referee?.name || "Pending Signup"}</p>
                                        <p className="text-[10px] text-slate-500">{ref.referee?.email || "Processing..."}</p>
                                    </div>
                                </div>
                                <Badge className={`text-[8px] font-black uppercase tracking-widest ${
                                    ref.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {ref.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel flex flex-col justify-between border-dashed">
            <div>
                <DollarSign className="w-8 h-8 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Join the Affiliate Program</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed max-w-sm">
                    Are you an agency or creator with a large audience? Apply for our high-ticket affiliate program and earn <span className="text-white font-bold">25% recurring commission</span> for life.
                </p>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Priority Support Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Custom Promo Codes</span>
                    </div>
                </div>
            </div>
            <Button variant="outline" className="w-full mt-10 border-slate-800 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-all rounded-xl h-12">
                Apply for Affiliate Status
            </Button>
        </Card>
      </div>
    </div>
  );
}

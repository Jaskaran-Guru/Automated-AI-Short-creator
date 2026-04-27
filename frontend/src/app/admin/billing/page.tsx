import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign,
  History,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminBillingPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "FINANCE"]);

  const subscriptions = await db.subscription.findMany({
    include: {
      workspace: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Calculate high-level stats
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const pastDueCount = subscriptions.filter(s => s.status === 'past_due').length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Billing Operations</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Revenue Monitoring & Subscription Lifecycle</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl">
                Stripe Dashboard
                <ArrowUpRight className="w-3 h-3 ml-2" />
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Subscriptions</p>
                <h3 className="text-4xl font-black text-white">{activeCount}</h3>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between border-red-500/20">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Past Due / Failed</p>
                <h3 className="text-4xl font-black text-red-500">{pastDueCount}</h3>
            </div>
            <div className="bg-red-500/10 p-4 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Coupon Usage</p>
                <h3 className="text-4xl font-black text-white">8.2%</h3>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Billing Events</h3>
            </div>
            <div className="divide-y divide-slate-800">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl border border-white/5 ${sub.status === 'active' ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
                                <CreditCard className={`w-5 h-5 ${sub.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Workspace: {sub.workspace.name}</p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Customer ID: {sub.stripeCustomerId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge 
                                variant="outline" 
                                className={`text-[10px] font-black uppercase tracking-widest
                                    ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                `}
                            >
                                {sub.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel border-red-500/10">
                <AlertCircle className="w-8 h-8 text-red-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Churn Risk Monitor</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    There are currently <span className="text-white font-bold">4 accounts</span> with failed payments in the last 24 hours. Automatic recovery emails have been sent.
                </p>
                <Button variant="outline" className="w-full border-slate-800 hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/30 transition-all rounded-xl">
                    Review Failed Payments
                </Button>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel">
                <DollarSign className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Refund Console</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Access the secure refund terminal to process client requests. Every refund requires an internal note for Audit Logs.
                </p>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
                    Open Refund Console
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

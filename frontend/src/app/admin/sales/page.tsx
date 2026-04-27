import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  User, 
  MoreVertical,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminSalesPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "SALES"]);

  const leads = await db.lead.findMany({
    include: {
      owner: true,
      deals: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  const stages = [
    { name: "LEAD", color: "bg-slate-800 text-slate-400" },
    { name: "QUALIFIED", color: "bg-blue-500/10 text-blue-500" },
    { name: "DEMO", color: "bg-purple-500/10 text-purple-500" },
    { name: "PROPOSAL", color: "bg-orange-500/10 text-orange-500" },
    { name: "WON", color: "bg-emerald-500/10 text-emerald-500" },
  ];

  const totalPipelineValue = leads
    .filter(l => l.stage !== 'WON' && l.stage !== 'LOST')
    .reduce((acc, lead) => acc + (lead.dealValue || 0), 0);

  const wonDeals = leads.filter(l => l.stage === 'WON');
  const wonValue = wonDeals.reduce((acc, l) => acc + (l.dealValue || 0), 0);
  
  const winRate = leads.length > 0 ? (wonDeals.length / leads.filter(l => l.stage === 'WON' || l.stage === 'LOST').length || 0) * 100 : 0;

  // Sales Velocity (Days from creation to WON)
  const avgVelocity = wonDeals.length > 0 
    ? wonDeals.reduce((acc, l) => acc + (new Date(l.updatedAt).getTime() - new Date(l.createdAt).getTime()), 0) / wonDeals.length / 86400000 
    : 0;

  const isStale = (updatedAt: Date) => {
    const daysSince = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
    return daysSince > 3;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Sales Pipeline</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">B2B Revenue & Partnership Management</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl h-10 px-6">
                Export Pipeline
            </Button>
            <Button variant="premium" className="rounded-xl h-10 px-6">
                <Plus className="w-4 h-4 mr-2" />
                New Deal
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Pipeline Value</p>
            <h3 className="text-4xl font-black text-white">${totalPipelineValue.toLocaleString()}</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-2">Weighted: ${(totalPipelineValue * 0.4).toLocaleString()}</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Deals</p>
            <h3 className="text-4xl font-black text-white">{leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST').length}</h3>
            <p className="text-[10px] text-purple-400 font-bold uppercase mt-2">Avg. Deal: $2,400</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Won (MTD)</p>
            <h3 className="text-4xl font-black text-emerald-500">${wonValue.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">Win Rate: {winRate.toFixed(0)}%</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Sales Velocity</p>
            <h3 className="text-4xl font-black text-white">{avgVelocity.toFixed(1)} Days</h3>
            <p className="text-[10px] text-orange-400 font-bold uppercase mt-2">Lead to Close</p>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6 px-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter by: All Stages</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Owner: All</span>
        </div>

        {leads.map((lead) => (
            <Card key={lead.id} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2.5rem] glass-panel hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 min-w-[300px]">
                        <div className={`p-3 rounded-2xl border transition-colors ${
                            isStale(lead.updatedAt) ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800 border-white/5 group-hover:bg-blue-500/10'
                        }`}>
                            <Briefcase className={`w-5 h-5 ${isStale(lead.updatedAt) ? 'text-red-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{lead.company}</h4>
                            <p className="text-xs text-slate-500 font-bold">{lead.contact} â€¢ {lead.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-12 flex-1">
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Stage</p>
                            <Badge className={`text-[10px] font-black uppercase tracking-widest border-none ${stages.find(s => s.name === lead.stage)?.color || 'bg-slate-800 text-slate-400'}`}>
                                {lead.stage}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Deal Value</p>
                            <p className="text-sm font-black text-white">${(lead.dealValue || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Owner</p>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                    {lead.owner?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-xs text-slate-400 font-bold">{lead.owner?.name || 'Unassigned'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Next Step</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-tighter">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(lead.nextFollowup || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
}

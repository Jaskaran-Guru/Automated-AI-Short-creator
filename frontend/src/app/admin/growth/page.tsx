import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Plus, 
  Building2, 
  Calendar, 
  MessageCircle, 
  ChevronRight,
  MoreVertical,
  Briefcase,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminGrowthPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN"]);

  const leads = await db.lead.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  const stages = [
    { name: "Prospect", color: "bg-slate-800 text-slate-400" },
    { name: "Demo Booked", color: "bg-blue-500/10 text-blue-500" },
    { name: "Proposal", color: "bg-purple-500/10 text-purple-500" },
    { name: "Closed-Won", color: "bg-emerald-500/10 text-emerald-500" },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Growth CRM</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">High-Ticket Agency Lead Pipeline & Pipeline Intelligence</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 h-12">
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stages.map((stage) => (
            <Card key={stage.name} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel border-dashed">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stage.name}</p>
                <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-white">
                        {leads.filter(l => l.stage === stage.name.toUpperCase().replace('-', '_')).length}
                    </h3>
                    <Badge variant="outline" className={`text-[10px] uppercase font-black tracking-widest border-none ${stage.color}`}>
                        {stage.name === "Closed-Won" ? "Revenue" : "Pipeline"}
                    </Badge>
                </div>
            </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4 px-4">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Pipeline</h3>
            </div>
            {leads.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800 p-20 text-center rounded-[2rem] border-dashed">
                    <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active leads in pipeline. Time to prospect!</p>
                </Card>
            ) : (
                leads.map((lead) => (
                    <Card key={lead.id} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel hover:border-blue-500/30 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 p-3 rounded-2xl border border-white/5">
                                    <Building2 className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{lead.company}</h4>
                                    <p className="text-xs text-slate-500 font-bold">{lead.contact} â€¢ {lead.email}</p>
                                </div>
                            </div>
                            <Badge className="bg-blue-500/10 text-blue-500 border-none text-[10px] font-black uppercase tracking-widest">
                                {lead.stage}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow-up: {lead.nextFollowup ? new Date(lead.nextFollowup).toLocaleDateString() : 'TBD'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last: {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : 'None'}</span>
                            </div>
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="h-8 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                                    Open Lead
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>

        <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel">
                <Star className="w-8 h-8 text-yellow-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Lead Intelligence</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Based on recent activity, <span className="text-white font-bold">2 users</span> have requested agency pricing in the last 48h. They have been automatically added to your "Hot Prospects" list.
                </p>
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-center justify-between">
                        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Upgrade Intent</span>
                        <Badge className="bg-yellow-500 text-black text-[8px] font-bold">HIGH</Badge>
                    </div>
                </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel border-blue-500/10">
                <TrendingUp className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Pipeline Value</h3>
                <h4 className="text-4xl font-black text-white mb-2">$12,400</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-tight">
                    Estimated Weighted MRR <br/> currently in Proposal stage.
                </p>
                <Button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px]">
                    Pipeline Forecast
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

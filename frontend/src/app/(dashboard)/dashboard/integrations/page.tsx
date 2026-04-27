import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Youtube, 
  FolderKanban, 
  HardDrive, 
  Cloud, 
  Link2, 
  CheckCircle2, 
  RefreshCcw,
  ArrowRight,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function IntegrationsPage() {
  const { userId: clerkId } = await auth();
  
  // Mock Integration Status (In production, these come from IntegrationAccount model)
  const integrations = [
    { 
        id: "youtube", 
        name: "YouTube", 
        icon: Youtube, 
        color: "text-red-500", 
        status: "CONNECTED", 
        description: "Publish shorts directly to your channel.",
        features: ["Direct Export", "Auto-Tags", "Scheduled Posting"]
    },
    { 
        id: "google-drive", 
        name: "Google Drive", 
        icon: HardDrive, 
        color: "text-blue-500", 
        status: "NOT_CONNECTED", 
        description: "Auto-import raw footage from shared folders.",
        features: ["Folder Watch", "Batch Import", "Sync Logs"]
    },
    { 
        id: "dropbox", 
        name: "Dropbox", 
        icon: Cloud, 
        color: "text-blue-400", 
        status: "NOT_CONNECTED", 
        description: "Connect your team's media library.",
        features: ["High-Res Export", "Team Folders"]
    },
    { 
        id: "zapier", 
        name: "Zapier", 
        icon: Link2, 
        color: "text-orange-500", 
        status: "NOT_CONNECTED", 
        description: "Automate workflows with 5,000+ apps.",
        features: ["Webhooks", "Custom Triggers"]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Integration Hub</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Connect your media ecosystem to VIRAIL</p>
        </div>
        <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Check Connection Health
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {integrations.map((app) => (
            <Card key={app.id} className={`bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel flex flex-col justify-between group hover:border-blue-500/20 transition-all ${app.status === 'CONNECTED' ? 'ring-1 ring-blue-500/30' : ''}`}>
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform`}>
                            <app.icon className={`w-8 h-8 ${app.color}`} />
                        </div>
                        <Badge variant="outline" className={`
                            text-[10px] font-black uppercase tracking-widest
                            ${app.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}
                        `}>
                            {app.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">{app.description}</p>
                    <div className="space-y-2 mb-8">
                        {app.features.map(f => (
                            <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
                <Button 
                    variant={app.status === 'CONNECTED' ? "outline" : "premium"} 
                    className={`w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-widest ${
                        app.status === 'CONNECTED' ? 'border-slate-800 text-slate-400' : ''
                    }`}
                >
                    {app.status === 'CONNECTED' ? 'Manage Connection' : `Connect ${app.name}`}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Card>
        ))}
      </div>

      <Card className="bg-slate-900/30 border border-slate-800 border-dashed p-10 rounded-[3rem] text-center">
            <div className="bg-blue-500/10 p-4 rounded-3xl w-fit mx-auto mb-6">
                <FolderKanban className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Build Custom Integrations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                Need a custom workflow for your agency? Access our Developer API and Webhooks.
            </p>
            <Button variant="ghost" className="text-blue-500 font-black uppercase tracking-widest text-[10px] hover:bg-blue-500/5">
                View API Documentation &rarr;
            </Button>
      </Card>
    </div>
  );
}

import { protectAdminPage } from "@/lib/admin-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ShieldAlert, 
  Zap, 
  Database, 
  Cpu, 
  Globe, 
  Lock,
  RefreshCcw,
  Save
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
export default async function AdminSettingsPage() {
  await protectAdminPage(["SUPER_ADMIN"]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">System Settings</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Infrastructure Controls & Global Overrides</p>
        </div>
        <Button variant="premium" className="rounded-xl px-8 h-12">
          <Save className="w-4 h-4 mr-2" />
          Save Global Config
        </Button>
      </div>

      <div className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-8">
            {/* Security & Access */}
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <div className="flex items-center gap-3 mb-8">
                    <Lock className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Security & Access</h3>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold text-white">Maintenance Mode</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Disable all user-facing dashboard access.</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold text-white">New Signups</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Allow new users to create accounts.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold text-white">Internal Admin 2FA</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Force TOTP for all staff accounts.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </Card>

            {/* AI Core Engine */}
            <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] glass-panel">
                <div className="flex items-center gap-3 mb-8">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">AI Core Engine</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-white">Primary Analysis Model</Label>
                        <select className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" defaultValue="gpt-4o">
                            <option value="gpt-4o">GPT-4o (Standard)</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                            <option value="claude-3-5">Claude 3.5 Sonnet</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold text-white">AI Captioning</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Auto-generate captions for every clip.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </Card>
        </div>

        {/* Infrastructure & Queues */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[3rem] glass-panel border-dashed">
            <div className="flex items-center gap-3 mb-8">
                <Database className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Infrastructure & Queues</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Rendering Priority</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white font-bold">Agency Tier</span>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px]">HIGH</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-bold">Pro Tier</span>
                            <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px]">NORMAL</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-bold">Free Tier</span>
                            <Badge className="bg-slate-800 text-slate-500 border-none text-[8px]">LOW</Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Worker Scaling</h4>
                    <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Currently running <span className="text-white font-bold">12 worker nodes</span> on AWS cluster.</p>
                        <Button variant="outline" className="w-full border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest h-10">
                            Scale Clusters
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cache Flush</h4>
                    <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Wipe the Redis cache for all transcribed segments and AI rewritten hooks.</p>
                        <Button variant="ghost" className="w-full text-red-500 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-widest h-10">
                            Flush System Cache
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}

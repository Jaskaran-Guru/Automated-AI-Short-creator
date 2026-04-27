import { getCurrentWorkspace } from "@/lib/agency-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Tag, 
  FileText,
  Upload,
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

export default async function NewClientPage() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  async function createClient(formData: FormData) {
    "use server"
    
    const name = formData.get("name") as string;
    const niche = formData.get("niche") as string;
    const website = formData.get("website") as string;
    const notes = formData.get("notes") as string;
    
    const workspace = await getCurrentWorkspace();
    if (!workspace) return;

    await db.client.create({
      data: {
        workspaceId: workspace.id,
        name,
        niche,
        website,
        notes,
        brandKit: {
          create: {} // Initialize empty brand kit
        }
      }
    });

    redirect("/dashboard/clients");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/dashboard/clients" className="flex items-center text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Clients
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Onboard New Client</h1>
        <p className="text-slate-400">Set up the brand profile and content defaults for your new client.</p>
      </div>

      <form action={createClient}>
        <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Basic Information</h3>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Client / Brand Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g. Acme Podcasting" 
                  required 
                  className="bg-slate-950 border-slate-800 rounded-xl h-12"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="niche" className="text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-500" />
                    Niche / Industry
                  </Label>
                  <Input 
                    id="niche" 
                    name="niche" 
                    placeholder="e.g. Fitness, SaaS, Finance" 
                    className="bg-slate-950 border-slate-800 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    Website URL
                  </Label>
                  <Input 
                    id="website" 
                    name="website" 
                    placeholder="https://client.com" 
                    className="bg-slate-950 border-slate-800 rounded-xl h-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Strategy & Notes</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-300">Internal Client Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="Mention target audience, content goals, or specific editor instructions..." 
                className="bg-slate-950 border-slate-800 rounded-2xl min-h-[120px] p-4"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
            <Link href="/dashboard/clients">
              <Button variant="ghost" type="button" className="text-slate-400 hover:text-white">
                Cancel
              </Button>
            </Link>
            <Button variant="premium" type="submit" className="rounded-xl px-8 h-12">
              <Sparkles className="w-5 h-5 mr-2" />
              Initialize Client
            </Button>
          </div>
        </Card>
      </form>

      <div className="mt-12 grid md:grid-cols-2 gap-6 opacity-60">
        <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-3 rounded-xl mt-1">
                <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <div>
                <h4 className="text-white font-bold mb-1 text-sm">Automated Brand Kits</h4>
                <p className="text-xs text-slate-500">We automatically initialize a brand kit for every client, allowing for consistent AI metadata generation.</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-3 rounded-xl mt-1">
                <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <div>
                <h4 className="text-white font-bold mb-1 text-sm">Secure Data Isolation</h4>
                <p className="text-xs text-slate-500">Every client's projects and social accounts are cryptographically separated within your workspace.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

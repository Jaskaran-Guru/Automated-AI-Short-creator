"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, Filter, Video, Play, 
  Trash2, RefreshCw, FileText, Download,
  ExternalLink, User, MoreVertical, Loader2
} from "lucide-react"

export default function AdminProjectsPage() {
  const projects = [
    { id: "PRJ-901", name: "Rogan Podcast #192", user: "alex_j@gmail.com", status: "Completed", type: "YouTube", date: "2m ago" },
    { id: "PRJ-902", name: "AI Tutorial Series", user: "tech_guru@me.com", status: "Processing", type: "TikTok", date: "14m ago" },
    { id: "PRJ-903", name: "Beach Vlog 2024", user: "wanderer@x.com", status: "Failed", type: "Instagram", date: "1h ago" },
    { id: "PRJ-904", name: "Coding Bootcamp Intro", user: "dev_mike@dev.to", status: "Completed", type: "YouTube", date: "3h ago" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Project <span className="text-red-500">Arsenal</span></h1>
          <p className="text-slate-500 font-medium mt-2">Oversee all media processing jobs and global video assets.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Total Renders", value: "84,102", icon: Video },
          { label: "Processing Now", value: "12", icon: Loader2 },
          { label: "Failed (24h)", value: "3", icon: Trash2 },
        ].map((s, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2rem] glass-panel flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
                <h4 className="text-3xl font-black text-white italic tracking-tighter">{s.value}</h4>
             </div>
             <div className="p-4 rounded-2xl bg-slate-800 text-red-500 border border-slate-700">
                <s.icon className={cn("w-6 h-6", s.label === "Processing Now" && "animate-spin")} />
             </div>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-slate-800 glass-panel rounded-[3rem] overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH PROJECTS BY NAME OR ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-2xl border-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] px-6 h-14 bg-slate-900/50">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </Button>
          </div>
        </div>

        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800/50 bg-slate-950/50">
                <th className="p-8">Video Asset</th>
                <th className="p-8">Operator (User)</th>
                <th className="p-8">Status</th>
                <th className="p-8">Platform</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {projects.map((p, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden group-hover:border-red-500/50 transition-all">
                          <Play className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-white uppercase tracking-tighter italic">{p.name}</span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{p.id}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       <User className="w-3 h-3 text-slate-500" />
                       <span className="text-xs font-bold text-slate-300">{p.user}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-widest border-none px-3 py-1 rounded-lg",
                      p.status === "Completed" ? "bg-green-500/10 text-green-400" :
                      p.status === "Processing" ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {p.type}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                       <button title="View Logs" className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                          <FileText className="w-4 h-4" />
                       </button>
                       <button title="Retry Job" className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                          <RefreshCw className="w-4 h-4" />
                       </button>
                       <button title="Delete Asset" className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-500 hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ")
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  UploadCloud, Video, Sparkles, TrendingUp, 
  Clock, Play, Loader2, Zap, MoreVertical,
  Download, Trash2, AlertCircle, Calendar, Timer, Share2
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Project {
  id: string
  name: string
  status: string
  progress: number
  createdAt: string
  thumbnailUrl?: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [statsData, setStatsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()
        setProjects(data)
        const statsRes = await fetch("/api/stats")
        const statsJson = await statsRes.json()
        setStatsData(statsJson)
      } catch (err) {
        console.error("Failed to fetch dashboard data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const usagePercent = statsData ? (statsData.minutesUsed / statsData.minutesLimit) * 100 : 0;
  let nudgeLevel = null;
  if (usagePercent >= 100) nudgeLevel = "critical";
  else if (usagePercent >= 90) nudgeLevel = "warning";
  else if (usagePercent >= 70) nudgeLevel = "info";

  const stats = [
    { title: "Total Clips", value: statsData?.totalClips || 0, icon: Video, trend: `+${statsData?.clipsThisWeek || 0} this week`, color: "text-blue-400" },
    { title: "Automated Posts", value: statsData?.totalScheduled || 0, icon: Calendar, trend: "Published/Scheduled", color: "text-purple-400" },
    { title: "Time Saved", value: statsData?.timeSavedMinutes >= 60 ? `${Math.round(statsData.timeSavedMinutes / 60)}h` : `${statsData?.timeSavedMinutes || 0}m`, icon: Timer, trend: "30m / clip saved", color: "text-green-400" },
    { title: "Est. Reach", value: statsData?.totalClips > 0 ? (statsData.totalClips * 1250).toLocaleString() : "0", icon: Share2, trend: "Viral impressions", color: "text-blue-400" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase letter-spacing-widest">Workspace</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and automate your short-form content pipeline.</p>
        </div>
        <Link href="/dashboard/new">
          <Button variant="premium" className="px-8 py-6 rounded-2xl font-bold shadow-lg shadow-blue-500/20">
            <UploadCloud className="w-5 h-5 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Soft Upgrade Nudges */}
      {nudgeLevel && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          nudgeLevel === 'critical' ? 'bg-red-500/10 border-red-500/50 text-red-200' :
          nudgeLevel === 'warning' ? 'bg-orange-500/10 border-orange-500/50 text-orange-200' :
          'bg-blue-500/10 border-blue-500/50 text-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-6 h-6 ${nudgeLevel === 'critical' ? 'text-red-500' : nudgeLevel === 'warning' ? 'text-orange-500' : 'text-blue-500'}`} />
            <div>
              <p className="font-bold">
                {nudgeLevel === 'critical' ? "You've reached your monthly processing limit." :
                 nudgeLevel === 'warning' ? "You're almost out of processing minutes!" :
                 "You've used 70% of your processing minutes."}
              </p>
              <p className="text-sm opacity-80">Upgrade to Pro for 5x more output and keep growing your audience.</p>
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button variant={nudgeLevel === 'critical' ? 'destructive' : 'default'} className="font-bold">Upgrade Now</Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-800 glass-panel rounded-[2rem] overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-slate-800/80 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.trend}</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Recent Projects</h2>
          <Button variant="ghost" className="text-blue-400 font-bold hover:text-blue-300">View All</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="border-2 border-dashed border-slate-800 rounded-[3rem] p-20 text-center glass-panel bg-slate-900/20">
             <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-blue-500" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4 uppercase">Let's Build Your First Viral Campaign</h3>
             <p className="text-slate-500 mb-12 max-w-lg mx-auto font-medium">Follow these 3 steps to turn one video into a month of automated social presence.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-white font-bold">1</div>
                   <h4 className="text-sm font-bold text-white uppercase">Upload Video</h4>
                   <p className="text-xs text-slate-500">Paste a YouTube link or upload an MP4.</p>
                </div>
                <div className="space-y-4">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-white font-bold">2</div>
                   <h4 className="text-sm font-bold text-white uppercase">AI Processing</h4>
                   <p className="text-xs text-slate-500">We find the viral moments and write captions.</p>
                </div>
                <div className="space-y-4">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-white font-bold">3</div>
                   <h4 className="text-sm font-bold text-white uppercase">Automate</h4>
                   <p className="text-xs text-slate-500">Schedule everything to your social accounts.</p>
                </div>
             </div>

             <Link href="/dashboard/new">
               <Button variant="premium" className="rounded-2xl px-12 py-7 font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40">
                 Start Onboarding <Zap className="w-4 h-4 ml-2" />
               </Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-[2.5rem] overflow-hidden glass-panel border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer h-full"
                >
                <div className="aspect-[16/9] relative bg-slate-800/50 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                   
                   {project.status === "processing" ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-full max-w-[150px] space-y-3">
                           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 1 }}
                              />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Processing... {project.progress}%</p>
                        </div>
                     </div>
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                           <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                     </div>
                   )}
                   
                   <div className="absolute top-4 left-4">
                      <Badge className={`uppercase text-[10px] font-black tracking-widest border-none ${
                        project.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                         {project.status}
                      </Badge>
                   </div>
                </div>
                
                <div className="p-8">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors truncate pr-4">{project.name}</h3>
                      <button className="text-slate-600 hover:text-white transition-colors">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-slate-500">
                         <Clock className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{project.createdAt}</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                            <Download className="w-4 h-4" />
                         </button>
                         <button className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

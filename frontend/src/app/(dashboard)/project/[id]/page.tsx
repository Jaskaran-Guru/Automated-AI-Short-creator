"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Play, Download, Share2, 
  Trash2, ChevronLeft, Sparkles,
  Scissors, Edit3, MoreVertical, Zap, Clock,
  Copy, Check, Calendar, Plus
} from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ProjectResultsPage() {
  const params = useParams()
  const posthog = usePostHog()
  const [project, setProject] = useState<any>(null)
  const [selectedClip, setSelectedClip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [socialAccounts, setSocialAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [scheduledTime, setScheduledTime] = useState<string>("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [activePlatformTab, setActivePlatformTab] = useState<"YouTube" | "TikTok" | "Instagram">("YouTube")
  const [isBatchMode, setIsBatchMode] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setProject(data);
        
        if (data.clips && data.clips.length > 0 && !selectedClip) {
          setSelectedClip(data.clips[0]);
        }

        // Poll if processing
        if (data.status === "PROCESSING" || data.status === "UPLOADING") {
          setTimeout(fetchProject, 5000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchAccounts();
  }, [params.id]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setSocialAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    posthog.capture('copied_' + field.toLowerCase(), { clipId: selectedClip?.id });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSchedule = async () => {
    if (!selectedAccount || !scheduledTime) return;
    setIsScheduling(true);
    try {
      const endpoint = isBatchMode ? "/api/posts/batch" : "/api/posts";
      const body = isBatchMode 
        ? { projectId: project.id, accountId: selectedAccount, startDate: scheduledTime }
        : {
            clipId: selectedClip.id,
            accountId: selectedAccount,
            scheduledFor: scheduledTime,
            title: selectedClip.youtubeTitle || selectedClip.title,
            caption: selectedClip.instagramCaption || selectedClip.captionText,
            hashtags: selectedClip.hashtags,
            thumbnailUrl: selectedClip.fileUrl 
          };

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      });
      if (res.ok) {
        posthog.capture(isBatchMode ? 'scheduled_batch' : 'scheduled_post', { 
          platform: socialAccounts.find(a => a.id === selectedAccount)?.platform,
          projectId: project.id 
        });
        setIsScheduleModalOpen(false);
        alert(isBatchMode ? "All clips scheduled!" : "Post scheduled successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScheduling(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (!project) {
    return <div className="max-w-7xl mx-auto py-32 text-center text-white">Project not found</div>
  }

  if (project.status === "PROCESSING" || project.status === "UPLOADING") {
    return (
      <div className="max-w-7xl mx-auto py-32 flex flex-col items-center text-center">
        <div className="relative w-48 h-48 mb-12">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Sparkles className="w-10 h-10 text-blue-400 mb-2 animate-bounce" />
            <span className="text-xl font-black text-white uppercase">Processing</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Your clips are being generated</h2>
        <p className="text-slate-400 max-w-md mx-auto">This page will automatically refresh when your clips are ready. You can safely leave this page.</p>
      </div>
    )
  }

  const clips = project.clips || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <Link href="/dashboard">
              <Button variant="ghost" className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
                 <ChevronLeft className="w-6 h-6" />
              </Button>
           </Link>
           <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{project.name}</h1>
              <p className="text-slate-500 font-medium">Project ID: {project.id}</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="glass" className="rounded-2xl px-6 border-slate-800 font-bold">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Source
           </Button>
           <Button variant="premium" className="rounded-2xl px-8 font-bold shadow-lg shadow-blue-500/20">
              <Download className="w-4 h-4 mr-2" /> Export All
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Preview Area */}
        <div className="lg:col-span-7 space-y-6">
           <div className="aspect-[9/16] max-h-[700px] w-full bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 relative group mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                 </div>
              </div>
              {selectedClip && (
                <video 
                  src={selectedClip.fileUrl} 
                  className="w-full h-full object-cover relative z-0"
                  controls
                />
              )}
              
              {/* Overlays */}
              {selectedClip && (
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20 pointer-events-none">
                   <Badge className="bg-blue-500 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                      Virality Score: {selectedClip.score}%
                   </Badge>
                   <button className="p-3 rounded-2xl bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all pointer-events-auto">
                      <Share2 className="w-5 h-5" />
                   </button>
                </div>
              )}

              {selectedClip && (
                <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                   <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">{selectedClip.title}</h2>
                   <div className="flex gap-2">
                      <Badge variant="outline" className="border-white/20 text-white/60 bg-white/5 uppercase text-[8px]">{(selectedClip.endTime - selectedClip.startTime).toFixed(1)}s</Badge>
                      <Badge variant="outline" className="border-white/20 text-white/60 bg-white/5 uppercase text-[8px]">{project.captionStyle} Style</Badge>
                   </div>
                </div>
              )}
           </div>

           <div className="flex justify-center gap-4">
              <Button className="rounded-2xl px-10 py-7 bg-slate-800 hover:bg-slate-700 text-white border-none font-bold uppercase tracking-widest text-xs">
                 <Download className="w-4 h-4 mr-2" /> Download MP4
              </Button>
              <Button variant="ghost" className="rounded-2xl px-10 py-7 text-slate-500 hover:text-white hover:bg-slate-800 font-bold uppercase tracking-widest text-xs">
                 <Scissors className="w-4 h-4 mr-2" /> Trim Clip
              </Button>
           </div>

           {/* AI Content Intelligence Panel */}
           {selectedClip && selectedClip.hookRewrite && (
              <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" /> AI Intelligence
                  </h3>
                  <div className="flex gap-2">
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1 mr-4">
                      {["YouTube", "TikTok", "Instagram"].map((tab: any) => (
                        <button
                          key={tab}
                          onClick={() => setActivePlatformTab(tab)}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            activePlatformTab === tab ? "bg-blue-500 text-white" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <Button 
                      variant="premium" 
                      size="sm" 
                      className="rounded-xl font-bold h-auto py-2"
                      onClick={() => {
                        setIsBatchMode(false);
                        setIsScheduleModalOpen(true);
                        posthog.capture('opened_scheduler', { clipId: selectedClip.id });
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" /> Schedule Post
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {activePlatformTab === "YouTube" ? "SEO Title" : activePlatformTab === "TikTok" ? "Viral Hook" : "Clip Title"}
                      </p>
                      <button 
                        onClick={() => handleCopy(activePlatformTab === "YouTube" ? (selectedClip.youtubeTitle || selectedClip.title) : activePlatformTab === "TikTok" ? (selectedClip.tiktokHook || selectedClip.hookRewrite) : selectedClip.title, "Title")} 
                        className="text-slate-500 hover:text-blue-400"
                      >
                        {copiedField === "Title" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {activePlatformTab === "YouTube" ? (selectedClip.youtubeTitle || selectedClip.title) : 
                       activePlatformTab === "TikTok" ? (selectedClip.tiktokHook || selectedClip.hookRewrite) : 
                       selectedClip.title}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Best Posting Time</p>
                    <p className="text-yellow-400 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {selectedClip.bestPostingTime}
                    </p>
                  </div>

                  <div className="space-y-2 relative group md:col-span-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {activePlatformTab === "Instagram" ? "Aesthetic Caption" : "Engaging Caption"}
                      </p>
                      <button 
                        onClick={() => handleCopy(activePlatformTab === "Instagram" ? (selectedClip.instagramCaption || selectedClip.captionText) : selectedClip.captionText, "Caption")} 
                        className="text-slate-500 hover:text-blue-400"
                      >
                        {copiedField === "Caption" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm italic">
                      {activePlatformTab === "Instagram" ? (selectedClip.instagramCaption || selectedClip.captionText) : selectedClip.captionText}
                    </p>
                  </div>

                  <div className="space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suggested Hashtags</p>
                      <button onClick={() => handleCopy(selectedClip.hashtags, "Hashtags")} className="text-slate-500 hover:text-blue-400">
                        {copiedField === "Hashtags" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-blue-400 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">{selectedClip.hashtags}</p>
                  </div>

                  <div className="space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Call to Action (CTA)</p>
                      <button onClick={() => handleCopy(selectedClip.ctaSuggestion, "CTA")} className="text-slate-500 hover:text-blue-400">
                        {copiedField === "CTA" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800">{selectedClip.ctaSuggestion}</p>
                  </div>
                </div>
              </Card>
           )}
        </div>

        {/* Clips List */}
        <div className="lg:col-span-5 space-y-6">
            {clips.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-[2rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500 text-white">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Your clips are ready!</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Schedule all this week in one click</p>
                  </div>
                </div>
                <Button 
                  variant="premium" 
                  size="sm" 
                  className="rounded-xl font-bold h-auto py-2 shadow-lg shadow-blue-500/20"
                  onClick={() => {
                    setIsBatchMode(true);
                    posthog.capture('clicked_batch_schedule', { projectId: project.id });
                    setIsScheduleModalOpen(true);
                  }}
                >
                  Schedule All
                </Button>
              </motion.div>
            )}

            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-black text-white uppercase tracking-widest">Generated Clips ({clips.length})</h3>
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-500 hover:text-white">
                    <Sparkles className="w-4 h-4" />
                 </Button>
              </div>
           </div>

           <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {clips.map((clip: any) => (
                <motion.div 
              key={clip.id}
                  onClick={() => setSelectedClip(clip)}
                  whileHover={{ x: 5 }}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex gap-6 ${
                    selectedClip.id === clip.id ? "bg-blue-500/10 border-blue-500/50" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="w-24 aspect-[9/16] bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                     <video src={clip.fileUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                     <Play className={`w-6 h-6 z-10 ${selectedClip?.id === clip.id ? "text-blue-500" : "text-white"}`} />
                     {selectedClip?.id === clip.id && (
                       <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                     )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white uppercase text-sm leading-tight line-clamp-2">{clip.title}</h4>
                        <button className="text-slate-600 hover:text-white">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{(clip.endTime - clip.startTime).toFixed(1)}s</span>
                        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Score: {clip.score}</span>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>

           <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/20 rounded-[2.5rem] p-8 mt-10">
              <div className="flex flex-col items-center text-center">
                 <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                 <h4 className="text-lg font-bold text-white uppercase mb-2">Need more clips?</h4>
                 <p className="text-slate-400 text-sm mb-6">Our AI can find even more moments from your video with a single click.</p>
                 <Button variant="premium" className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest">
                    Scan for more
                 </Button>
              </div>
           </Card>
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                {isBatchMode ? "Batch Schedule All" : "Schedule Post"}
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-500 hover:text-white">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {isBatchMode && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-widest text-center">
                  ✨ AI will spread your clips every 48 hours
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Account</label>
                {socialAccounts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <p className="text-sm text-slate-400 mb-4">No accounts connected</p>
                    <Button variant="outline" className="w-full rounded-xl" onClick={() => {
                      // Mock connect
                      fetch("/api/accounts", { 
                        method: "POST", 
                        body: JSON.stringify({ platform: "YOUTUBE" }) 
                      }).then(() => {
                        posthog.capture('connected_social_account', { platform: 'YOUTUBE' });
                        fetchAccounts();
                      });
                    }}>Connect YouTube</Button>
                  </div>
                ) : (
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    {socialAccounts.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>{acc.platform} - {acc.username}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pick Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button onClick={() => setIsScheduleModalOpen(false)} variant="ghost" className="flex-1 rounded-xl">Cancel</Button>
                <Button 
                  onClick={handleSchedule} 
                  variant="premium" 
                  className="flex-1 rounded-xl font-bold"
                  disabled={!selectedAccount || !scheduledTime || isScheduling}
                >
                  {isScheduling ? "Scheduling..." : "Confirm Slot"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

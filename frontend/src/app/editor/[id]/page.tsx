"use client"

import { useState, useEffect } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Type, Scissors, Wand2, Download, Check, Settings2, LayoutTemplate, Loader2, Share2, Image as ImageIcon } from "lucide-react"
import { getProjectStatus, BACKEND_URL } from "@/lib/api"

interface Project {
  id: string
  name: string
  status: string
  results: string[]
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const { currentTime, isPlaying, captions, setIsPlaying, updateCaption } = useEditorStore()
  const [activeTab, setActiveTab] = useState("captions")
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        // Here we assume params.id is the backend project_id
        const data = await getProjectStatus(params.id)
        setProject(data)
      } catch (error) {
        console.error("Failed to fetch project for editor:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400">Loading editor...</p>
      </div>
    )
  }

  const videoUrl = project?.results && project.results.length > 0 
    ? `${BACKEND_URL}/static/${project.id}/${project.results[0].split('/').pop()}`
    : "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600&h=1066&fit=crop"

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-semibold text-white">Project: {project?.name || "Untitled Project"}</h1>
          <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-md border border-slate-700">Auto-saved 2m ago</span>
        </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Project link copied to clipboard!");
            }}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => {
              const video = document.querySelector("video") as HTMLVideoElement;
              if (video) {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const link = document.createElement("a");
                  link.download = `frame-${project?.id}.png`;
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                }
              }
            }}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> PNG
          </Button>
          <Button variant="premium" size="sm" className="h-9 px-6 shadow-lg shadow-purple-500/20">
            <Download className="w-4 h-4 mr-2" /> Export Video
          </Button>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Video Preview (9:16) */}
        <div className="flex-1 border-r border-slate-800 bg-slate-900/50 flex items-center justify-center p-8 relative">
          <div className="aspect-[9/16] h-full max-h-[75vh] bg-black rounded-xl overflow-hidden relative shadow-2xl border border-slate-800 group">
            
            {project?.results && project.results.length > 0 ? (
               <video 
                src={videoUrl}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay={isPlaying}
               />
            ) : (
              <img src={videoUrl} className="w-full h-full object-cover opacity-80" alt="Video Preview" />
            )}
            
            {/* Active Caption Overlay (Simplified mock for now) */}
            <div className="absolute bottom-32 left-0 right-0 text-center px-8 z-10">
              <span className="text-3xl font-black text-white uppercase tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Impact, sans-serif' }}>
                <span className="text-yellow-400">THE SECRET</span> TO HIGH GROWTH
              </span>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-slate-300 hover:text-white"><SkipBack className="w-5 h-5" /></button>
              <button 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button className="text-slate-300 hover:text-white"><SkipForward className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Right: Tools & Settings */}
        <div className="w-96 bg-slate-950 flex flex-col shrink-0">
          <div className="flex border-b border-slate-800 p-2 gap-2 shrink-0">
            {[
              { id: "captions", icon: Type, label: "Captions" },
              { id: "styles", icon: LayoutTemplate, label: "Styles" },
              { id: "ai", icon: Wand2, label: "AI Magic" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-medium rounded-md flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "captions" && (
              <div className="space-y-2">
                {captions.map((caption) => (
                  <div key={caption.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                      <span>{caption.start.toFixed(1)}s</span>
                      <span>{caption.end.toFixed(1)}s</span>
                    </div>
                    <textarea 
                      className="w-full bg-transparent text-sm text-slate-200 outline-none resize-none h-12 focus:text-white"
                      value={caption.text}
                      onChange={(e) => updateCaption(caption.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === "styles" && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">Preset Templates</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Hormozi", "MrBeast", "Neon", "Minimal"].map(style => (
                      <div key={style} className="p-3 text-center text-sm font-medium border border-slate-800 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all text-slate-300">
                        {style}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">Font Family</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white outline-none">
                    <option>Impact (Default)</option>
                    <option>Montserrat</option>
                    <option>Inter</option>
                  </select>
                </div>
              </div>
            )}
            
            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                    <Wand2 className="w-4 h-4" /> B-Roll Suggestions
                  </div>
                  <p className="text-xs text-slate-400 mb-3">AI found 3 points where B-roll would increase retention.</p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">Apply Auto B-Roll</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-48 border-t border-slate-800 bg-slate-900 shrink-0 flex flex-col">
        {/* Timeline Header Tools */}
        <div className="flex items-center px-4 h-10 border-b border-slate-800 gap-4 shrink-0">
          <button className="text-slate-400 hover:text-white p-1"><Scissors className="w-4 h-4" /></button>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <span className="text-xs font-mono text-slate-500">00:00:00:00</span>
          <div className="ml-auto flex items-center gap-2">
             <input type="range" className="w-24 accent-blue-500 h-1 bg-slate-800 rounded-full appearance-none" />
          </div>
        </div>
        
        {/* Tracks Area */}
        <div className="flex-1 overflow-x-auto relative bg-slate-950 p-4">
          {/* Playhead */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-20 left-[20%]" style={{boxShadow: '0 0 10px rgba(239,68,68,0.5)'}}>
            <div className="w-3 h-3 bg-red-500 rounded-sm absolute top-0 -translate-x-1/2"></div>
          </div>
          
          <div className="space-y-2 w-[200%]">
            {/* Video Track */}
            <div className="h-10 bg-slate-800 rounded-md border border-slate-700 flex items-center overflow-hidden">
               <div className="h-full w-full bg-blue-900/20 border-r border-slate-700 p-1 flex">
                 {/* Thumbnails placeholder */}
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="h-full w-20 bg-slate-700/50 mr-1 rounded-sm"></div>
                 ))}
               </div>
            </div>
            {/* Caption Track */}
            <div className="h-8 bg-slate-800/50 rounded-md border border-slate-700 flex relative overflow-hidden">
              {captions.map((cap, i) => (
                <div 
                  key={cap.id} 
                  className="absolute h-full bg-purple-500/20 border border-purple-500/50 rounded-sm px-2 flex items-center cursor-pointer hover:bg-purple-500/40 transition-colors"
                  style={{ left: `${cap.start * 10}%`, width: `${(cap.end - cap.start) * 10}%` }}
                >
                  <span className="text-[10px] text-purple-200 truncate">{cap.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

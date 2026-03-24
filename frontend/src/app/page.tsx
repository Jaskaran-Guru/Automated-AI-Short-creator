"use client";

import { useState, useEffect } from "react";
import { Upload, Play, CheckCircle, Clock, Plus, Minus, Download, BarChart2, X, ChevronRight, Settings, Sliders, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  message: string;
  results: string[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [numShorts, setNumShorts] = useState(3);
  const [duration, setDuration] = useState(30);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'archive'>('dashboard');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000); 
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8000/projects");
      const data = await res.json();
      setProjects(data);
      if (viewProject) {
        const updated = data.find((p: Project) => p.id === viewProject.id);
        if (updated) setViewProject(updated);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setErrorMessage(null);
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setActiveProjectId(data.project_id);
      setShowConfig(true);
      setIsUploading(false);
    } catch (err: any) {
      console.error("Upload failed", err);
      setErrorMessage(`Network Error: Ensure the Python backend is running on port 8000. (${err.message})`);
      setIsUploading(false);
    }
  };

  const handleStartProcessing = async () => {
    if (!activeProjectId) return;
    setIsUploading(true); // Re-use for processing state

    try {
      setErrorMessage(null);
      const res = await fetch(`http://127.0.0.1:8000/process/${activeProjectId}?num_shorts=${numShorts}&duration=${duration}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      
      fetchProjects();
      setSelectedFile(null);
      setShowConfig(false);
      setActiveProjectId(null);
      setActiveTab('archive'); // Switch to archive to see progress
    } catch (err: any) {
      console.error("Processing failed", err);
      setErrorMessage(`Processing Failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelProcessing = async (id: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/cancel/${id}`, { method: 'POST' });
      fetchProjects(); // refresh to show cancelled status
    } catch (err) {
      console.error("Failed to cancel", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-white/20 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Navigation / Header */}
      <nav className="border-b border-white/5 sticky top-0 bg-[#020202]/60 backdrop-blur-2xl z-50">
        <div className="max-w-7xl mx-auto px-8 h-24 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-16"
          >
            <h1 className="text-3xl font-black tracking-tighter premium-gradient cursor-default">VIRAIL</h1>
            <div className="hidden lg:flex gap-12 text-[11px] font-black tracking-[0.25em] uppercase text-white/40">
              <span onClick={() => setActiveTab('dashboard')} className={`relative hover:text-white transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-white' : ''}`}>
                Dashboard
                {activeTab === 'dashboard' && <motion.div layoutId="nav-indicator" className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-t-full" />}
              </span>
              <span onClick={() => setActiveTab('intelligence')} className={`relative hover:text-white transition-all cursor-pointer ${activeTab === 'intelligence' ? 'text-white' : ''}`}>
                Intelligence
                {activeTab === 'intelligence' && <motion.div layoutId="nav-indicator" className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-t-full" />}
              </span>
              <span onClick={() => setActiveTab('archive')} className={`relative hover:text-white transition-all cursor-pointer ${activeTab === 'archive' ? 'text-white' : ''}`}>
                Archive
                {activeTab === 'archive' && <motion.div layoutId="nav-indicator" className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-t-full" />}
              </span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-8">
            <label className="group relative cursor-pointer bg-white text-black px-8 py-3.5 rounded-2xl flex items-center gap-3 hover:scale-[1.03] transition-all font-black text-xs active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 z-10">
                <Plus size={16} strokeWidth={3} />
                <span>NEW PRODUCTION</span>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                    setActiveTab('dashboard');
                  }
                }} 
              />
            </label>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-24">
        {activeTab === 'intelligence' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="inline-block px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-8 mt-12">
              Next-Gen Analytics
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tightest text-center">
              Intelligence <span className="premium-gradient">Hub.</span>
            </h2>
            <p className="max-w-xl mx-auto text-center text-white/30 text-lg mb-24 font-medium leading-relaxed">
              Unlock deep behavioral analytics, retention heatmaps, and AI-driven virality forecasting for your generated content.
            </p>
            
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Virality Horizon', value: '94.2%', desc: 'Based on multimodal visual-acoustic synthesis.', delay: 0 },
                { title: 'Retention Prediction', value: '+24s', desc: 'Average viewer watch-time expected increase.', delay: 0.1 },
                { title: 'Semantic Mapping', value: 'Sync', desc: 'Spatio-temporal alignment of speech & tracking.', delay: 0.2 }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-8 shadow-inner border border-white/5">
                    <BarChart2 className="text-white/40" size={28} />
                  </div>
                  <div className="text-4xl font-black tracking-tighter mb-3">{item.value}</div>
                  <div className="text-sm font-bold tracking-wide text-white/80 mb-3">{item.title}</div>
                  <p className="text-xs text-white/30 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-20 px-8 py-4 rounded-full border border-white/5 bg-white/[0.01] text-xs font-bold tracking-widest uppercase text-white/20 animate-pulse">
              System Training & Integration Pending
            </div>
          </motion.div>
        )}

        {/* Error Message Toast */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500 text-red-100 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-xl max-w-lg w-full"
            >
              <div className="flex-1 text-sm font-medium">{errorMessage}</div>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-white/10 rounded-full"><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State Hero */}
        {activeTab === 'dashboard' && projects.length === 0 && !selectedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="inline-block px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-12">
              Next-Gen AI Content Engine
            </div>
            <h2 className="text-7xl md:text-9xl font-black mb-12 leading-[0.9] tracking-tightest">
              Cinematic <br/> 
              <span className="premium-gradient">Precision.</span>
            </h2>
            <p className="max-w-xl mx-auto text-white/30 text-xl mb-16 font-medium leading-relaxed">
              VIRAIL distills your raw footage into high-impact viral assets using sophisticated visual appraisal.
            </p>
          </motion.div>
        )}

        {/* 3-Stage Interaction Flow */}
        {activeTab === 'dashboard' && (
          <AnimatePresence mode="wait">
            {selectedFile && !showConfig && (
              <motion.div 
                key="uploading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-12 rounded-[3rem] mb-20 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
                  <div className="flex items-center gap-10 flex-1 min-w-0 w-full">
                    <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-black shrink-0">
                      {isUploading ? <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <Upload size={32} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-2">Stage 1: Preparation</div>
                      <h3 className="text-4xl font-bold tracking-tight mb-2 truncate" title={selectedFile.name}>{selectedFile.name}</h3>
                      <p className="text-white/40 font-medium">Ready for high-fidelity analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 w-full lg:w-auto">
                    <button onClick={() => setSelectedFile(null)} className="px-8 py-4 text-white/40 font-bold hover:text-white transition-colors">Discard</button>
                    <button 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="bg-white text-black whitespace-nowrap px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 w-full lg:w-auto text-center"
                    >
                      {isUploading ? "UPLOADING..." : "UPLOAD & ANALYZE"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          {showConfig && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-12 rounded-[3rem] mb-20 bg-gradient-to-br from-white/[0.03] to-transparent border-white/10"
            >
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-1/3">
                  <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">Stage 2: Configuration</div>
                  <h3 className="text-5xl font-black tracking-tighter mb-6">Refine your <br/><span className="premium-gradient">Vision.</span></h3>
                  <p className="text-white/40 font-medium leading-relaxed">
                    Adjust the parameters below to determine the intensity and pace of your viral collection.
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Duration Slider */}
                  <div className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <Sliders size={18} className="text-white/40" />
                        <span className="text-xs font-black tracking-widest uppercase text-white/40">Clip Duration</span>
                      </div>
                      <span className="text-2xl font-bold italic">{duration}s</span>
                    </div>
                    <input 
                      type="range" min="15" max="60" step="1" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-white/20">
                      <span>QUICK (15s)</span>
                      <span>STORY (60s)</span>
                    </div>
                  </div>

                  {/* Count Stepper */}
                  <div className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-3 mb-8">
                      <Settings size={18} className="text-white/40" />
                      <span className="text-xs font-black tracking-widest uppercase text-white/40">Clip Quantity</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setNumShorts(Math.max(1, numShorts - 1))}
                        className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                      >
                       <Minus size={20} />
                      </button>
                      <span className="text-5xl font-black">{numShorts}</span>
                      <button 
                        onClick={() => setNumShorts(Math.min(10, numShorts + 1))}
                        className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/4 flex flex-col justify-end gap-4">
                  <button 
                    onClick={handleStartProcessing}
                    disabled={isUploading}
                    className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-lg hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
                  >
                    {isUploading ? "STARTING..." : "GENERATE"}
                  </button>
                  <button 
                    onClick={() => setShowConfig(false)}
                    className="w-full py-4 text-white/30 font-bold hover:text-white transition-colors"
                  >
                    Back to Upload
                  </button>
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Projects Grid */}
        {(activeTab === 'archive' || projects.length > 0 && activeTab !== 'dashboard' && activeTab !== 'intelligence') && (
          <>
            <div className="flex items-center gap-6 mb-12 mt-12">
              <h2 className="text-3xl font-black tracking-tight text-white/90">Your Archive</h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
            {projects.map((project: Project, idx: number) => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative min-w-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-[2.5rem] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="glass h-full p-10 rounded-[2.5rem] flex flex-col relative bg-[#0a0a0a] min-w-0">
                  <div className="flex justify-between items-start mb-10">
                    <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                      {project.status === "completed" ? "Finalized" : 
                       project.status === "cancelled" ? "Cancelled" : 
                       project.status === "failed" ? "Failed" : "Working..."}
                    </div>
                    {project.status === "completed" ? (
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    ) : project.status === "cancelled" || project.status === "failed" ? (
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-bold tracking-tight mb-4 truncate leading-none">{project.name}</h3>
                  <p className="text-white/40 font-medium mb-12 line-clamp-2 text-sm leading-relaxed">{project.message}</p>

                  <div className="mt-auto">
                    {project.status === "processing" ? (
                      <div className="space-y-6">
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-white/30 tracking-widest uppercase truncate max-w-[200px]">{project.message}</span>
                          <span className="text-lg font-bold italic">{Math.round(project.progress * 100)}%</span>
                        </div>
                        <button 
                          onClick={() => handleCancelProcessing(project.id)}
                          className="w-full mt-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          Cancel Operation
                        </button>
                      </div>
                    ) : project.status === "cancelled" || project.status === "failed" ? (
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="w-full bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 py-5 rounded-[1.5rem] font-bold text-red-500/60 hover:text-red-500 flex items-center justify-center gap-2 text-sm transition-all duration-300 group/btn"
                      >
                        <Trash2 size={16} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" /> DELETE RECORD
                      </button>
                    ) : (
                      <button 
                        onClick={() => setViewProject(project)}
                        className="w-full bg-white/[0.04] border border-white/5 hover:bg-white hover:text-black hover:scale-[1.02] py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all duration-300"
                      >
                        REVIEW COLLECTION <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 md:col-span-2 lg:col-span-3 border border-dashed border-white/10 bg-white/[0.01] rounded-[3rem] h-[400px] flex flex-col items-center justify-center text-center p-10"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                  <Play className="text-white/20" size={32} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Archive Empty</h3>
                <p className="text-white/30 font-medium max-w-sm">
                  Your generated viral collections and source media will automatically persist here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>
      )}
      </div>

      {/* Modern Fullscreen Modal */}
      <AnimatePresence>
        {viewProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[60px]"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark w-[95vw] h-[90vh] rounded-[4rem] overflow-hidden flex flex-col relative border-white/5"
            >
              <div className="p-12 md:p-20 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-20">
                  <div>
                    <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30 mb-4">Master Collection</div>
                    <h2 className="text-6xl font-black tracking-tighter premium-gradient inline-block truncate max-w-full" title={viewProject?.name}>{viewProject?.name}</h2>
                  </div>
                  <button 
                    onClick={() => setViewProject(null)}
                    className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all active:scale-90"
                  >
                    <X size={32} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {viewProject?.results.map((result: string, idx: number) => {
                    const cleanPath = result.replace(/^output[\\/]/, '').replace(/\\/g, '/');
                    const videoUrl = `http://127.0.0.1:8000/static/${cleanPath}`;
                    return (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex flex-col"
                      >
                        <div className="aspect-[9/16] bg-zinc-950 rounded-[3rem] overflow-hidden border border-white/5 relative group/vid mb-8 shadow-2xl">
                          <video 
                            src={videoUrl} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                        <a 
                          href={videoUrl} 
                          download
                          className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-center flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                        >
                          <Download size={18} /> SAVE TO DEVICE
                        </a>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

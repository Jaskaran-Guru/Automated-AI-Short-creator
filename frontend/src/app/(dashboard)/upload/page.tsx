"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Settings, Sparkles, Video, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadVideoToBackend, startProcessing, getProjectStatus } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

const steps = ["Upload Video", "Shorts Settings", "AI Processing", "Review Shorts"]

function UploadFlowContent() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Preparing...")
  const [backendId, setBackendId] = useState<string | null>(null)
  const [numShorts, setNumShorts] = useState(3)
  const [duration, setDuration] = useState(30)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const step = searchParams.get("step")
    const id = searchParams.get("id")
    if (step && id) {
      setCurrentStep(parseInt(step))
      setBackendId(id)
      if (parseInt(step) === 3) {
        getProjectStatus(id).then(status => {
          setResults(status.results)
        }).catch(() => {
          setError("Failed to load project results.")
        })
      }
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 2 && backendId) {
      interval = setInterval(async () => {
        try {
          const status = await getProjectStatus(backendId);
          setProgress(status.progress * 100);
          setStatusMessage(status.message);
          
          if (status.status === "completed") {
            setResults(status.results);
            setCurrentStep(3);
            clearInterval(interval);
          } else if (status.status === "failed") {
            setError(status.message);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error polling status:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [currentStep, backendId]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const { project_id } = await uploadVideoToBackend(file);
      setBackendId(project_id);
      setCurrentStep(1);
    } catch (err) {
      setError("Failed to upload video. Please check if the backend is running.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartProcessing = async () => {
    if (!backendId) return;
    setError(null);
    try {
      await startProcessing(backendId, numShorts, duration);
      setCurrentStep(2);
    } catch (err) {
      setError("Failed to start processing.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                index <= currentStep ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-slate-900 text-slate-500 border border-slate-800"
              }`}>
                {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-xs font-medium ${index <= currentStep ? "text-slate-200" : "text-slate-600"}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400"
        >
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center h-[500px]"
            >
              <div 
                className="w-full max-w-2xl border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center hover:border-blue-500 hover:bg-slate-900/50 transition-all cursor-pointer group glass-panel mb-8"
                onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
              >
                <div className={`w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all ${isUploading ? "animate-pulse" : ""}`}>
                  <UploadCloud className={`w-10 h-10 ${isUploading ? "text-blue-500" : "text-blue-400"}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {isUploading ? "Uploading Video..." : "Drag & Drop Long Video Here"}
                </h3>
                <p className="text-slate-400 mb-6">Supports MP4, MOV, WEBM up to 2GB</p>
                <Button 
                  variant="secondary" 
                  className="px-8" 
                  disabled={isUploading}
                  onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}
                >
                  {isUploading ? "Please Wait..." : "Browse Files"}
                </Button>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept="video/mp4,video/quicktime,video/webm" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUpload(e.target.files[0]);
                    }
                  }} 
                />
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-slate-900/50 border-slate-800 mb-8">
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Settings className="w-5 h-5 mr-2 text-blue-400"/> Output Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Number of Shorts</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                          value={numShorts}
                          onChange={(e) => setNumShorts(parseInt(e.target.value))}
                        >
                          <option value={1}>1 Short</option>
                          <option value={3}>3 Shorts</option>
                          <option value={5}>5 Shorts</option>
                          <option value={10}>10 Shorts</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Preferred Length (seconds)</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                        >
                          <option value={15}>15 Seconds</option>
                          <option value={30}>30 Seconds</option>
                          <option value={45}>45 Seconds</option>
                          <option value={60}>60 Seconds</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Video className="w-5 h-5 mr-2 text-purple-400"/> AI Style Template</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {["Hormozi Style", "MrBeast Gaming", "Minimal Clean"].map((style, i) => (
                        <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-600"}`}>
                          <div className="aspect-[9/16] bg-slate-800 rounded-lg mb-3"></div>
                          <p className="text-sm font-medium text-center text-white">{style}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(0)} variant="ghost" className="w-1/3">Back</Button>
                <Button onClick={handleStartProcessing} variant="premium" className="w-2/3">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Magic
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-[500px] text-center"
            >
              <div className="relative w-40 h-40 mb-12">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    className="text-blue-500 transition-all duration-300 ease-out" 
                    strokeWidth="4" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="48" 
                    cx="50" 
                    cy="50"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 - (progress / 100) * 301.59}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <Sparkles className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
                  <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI is working its magic...</h3>
              <p className="text-slate-400">{statusMessage}</p>
              <Button variant="ghost" className="mt-8 text-slate-500 hover:text-white" onClick={async () => {
                if (backendId) await getProjectStatus(backendId);
              }}>
                Refresh Status
              </Button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">We found {results.length} viral clips!</h2>
                  <p className="text-slate-400">Your shorts are ready to download.</p>
                </div>
                <Button variant="premium">Export All ({results.length})</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((videoUrl, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden glass border-slate-800 hover:border-blue-500/50 transition-all p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-green-500/20 text-green-400">
                        Viral Score: {90 + Math.floor(Math.random() * 10)}
                      </Badge>
                      <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md">Short #{i+1}</span>
                    </div>
                    <div className="aspect-[9/16] relative bg-slate-900 rounded-lg mb-4 overflow-hidden group/video">
                      <video 
                        src={`http://localhost:8000/static/${backendId}/${videoUrl.split('/').pop()}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-4 line-clamp-2">Viral Clip #{i+1}</h3>
                    <div className="flex gap-2">
                      <a 
                        href={`http://localhost:8000/static/${backendId}/${videoUrl.split('/').pop()}`} 
                        download 
                        className="flex-1"
                      >
                        <Button variant="secondary" className="w-full text-xs h-8">Download</Button>
                      </a>
                      <Button variant="outline" className="flex-1 text-xs h-8">Edit Clip</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <Link href="/dashboard">
                  <Button variant="ghost">Return to Dashboard</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function UploadFlow() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium italic text-sm tracking-wide">Initializing AI Environment...</p>
      </div>
    }>
      <UploadFlowContent />
    </Suspense>
  )
}

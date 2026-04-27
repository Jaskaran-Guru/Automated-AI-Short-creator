"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UploadCloud, Settings, Sparkles, Video, 
  CheckCircle2, Play, AlertCircle, Scissors,
  Type, Smartphone, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import Link from "next/link"

const steps = ["Upload Video", "Configure Shorts", "Processing"]

export default function NewProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [estimatedDurationSeconds, setEstimatedDurationSeconds] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Form State
  const [numShorts, setNumShorts] = useState("3")
  const [duration, setDuration] = useState("30")
  const [captionStyle, setCaptionStyle] = useState("Hormozi")
  const [platform, setPlatform] = useState("TikTok")

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    setIsUploading(true)
    setError(null)

    const file = acceptedFiles[0];

    // Extract duration
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      setEstimatedDurationSeconds(videoElement.duration);
    };
    videoElement.src = URL.createObjectURL(file);
    
    try {
      // 1. Get signature from our API
      const sigRes = await fetch("/api/upload", { method: "POST" });
      if (!sigRes.ok) {
        const errData = await sigRes.json().catch(() => ({}));
        if (sigRes.status === 503) {
          throw new Error("Upload service is not configured on the server. Please add Cloudinary environment variables in Vercel.");
        }
        throw new Error(errData.error || `Server error ${sigRes.status}: Could not get upload signature.`);
      }
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      // 2. Upload to Cloudinary using Chunked Upload (supports up to 2GB)
      const chunkSize = 20 * 1024 * 1024; // 20MB chunks
      const totalSize = file.size;
      const uniqueUploadId = Math.random().toString(36).substring(2, 15);
      
      let uploadResponse = null;

      for (let start = 0; start < totalSize; start += chunkSize) {
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: "POST",
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[CLOUDINARY_UPLOAD_ERROR]", errorData);
          throw new Error(errorData.error?.message || "Cloudinary upload failed. Check your Cloudinary allowed origins.");
        }
        
        // Only the last chunk returns the full upload data
        if (end === totalSize) {
          uploadResponse = await response.json();
        } else {
          // Update progress
          setUploadProgress(Math.round((end / totalSize) * 100));
        }
      }

      if (!uploadResponse || !uploadResponse.secure_url) {
        throw new Error("Upload completed but no URL was returned.");
      }

      setVideoUrl(uploadResponse.secure_url);
      setIsUploading(false);
      setCurrentStep(1);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.webm'] },
    multiple: false
  })

  const handleStartGeneration = async () => {
    setCurrentStep(2)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          numShorts,
          duration,
          captionStyle,
          platform,
          estimatedDurationSeconds,
        }),
      });

      if (res.status === 402) {
        setShowUpgradeModal(true);
        setCurrentStep(1);
        return;
      }

      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();
      
      router.push(`/project/${data.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to start generation.");
      setCurrentStep(1);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-slate-400">Transform your long video into viral shorts in minutes.</p>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                index <= currentStep ? "bg-blue-500 text-white" : "bg-slate-900 text-slate-500 border border-slate-800"
              }`}>
                {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${index <= currentStep ? "text-slate-200" : "text-slate-600"}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div 
              {...getRootProps()}
              className={`border-2 border-dashed rounded-[2.5rem] p-20 text-center transition-all cursor-pointer glass-panel group ${
                isDragActive ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-600"
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
                <UploadCloud className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {isUploading ? "Uploading your video..." : "Drop your video here"}
              </h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                Upload podcasts, interviews, or any long video. We support MP4, MOV, and WEBM up to 2GB.
              </p>
              
              {isUploading ? (
                <div className="max-w-xs mx-auto w-full">
                  <Progress value={uploadProgress} className="h-2 mb-4" />
                  <p className="text-sm font-medium text-blue-400">{uploadProgress}% uploaded</p>
                </div>
              ) : (
                <Button variant="premium" className="px-10 py-6 rounded-2xl font-bold">
                  Select Video File
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800 rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Clip Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Number of Shorts</label>
                      <select 
                        value={numShorts}
                        onChange={(e) => setNumShorts(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                      >
                        <option value="1">1 Clip</option>
                        <option value="3">3 Clips</option>
                        <option value="5">5 Clips</option>
                        <option value="10">10 Clips</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Clip Duration</label>
                      <select 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                      >
                        <option value="15">15 Seconds</option>
                        <option value="30">30 Seconds</option>
                        <option value="60">60 Seconds</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Target Platform</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["TikTok", "Instagram", "Shorts", "Reels"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                              platform === p ? "border-blue-500 bg-blue-500/10 text-white" : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Type className="w-5 h-5 text-purple-500" />
                    Caption Style
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "Hormozi", name: "Alex Hormozi", color: "text-yellow-400" },
                      { id: "Minimal", name: "Clean Minimal", color: "text-blue-400" },
                      { id: "Neon", name: "Neon Viral", color: "text-pink-500" },
                      { id: "TikTok", name: "TikTok Pop", color: "text-cyan-400" }
                    ].map((style) => (
                      <div 
                        key={style.id}
                        onClick={() => setCaptionStyle(style.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          captionStyle === style.id ? "border-purple-500 bg-purple-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-700"
                        }`}
                      >
                        <div className="aspect-[9/16] bg-slate-800 rounded-lg mb-3 flex items-end p-2 overflow-hidden">
                           <div className={`text-[10px] font-black uppercase ${style.color}`}>CAPTION PREVIEW</div>
                        </div>
                        <p className="text-xs font-bold text-center text-white">{style.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={() => setCurrentStep(0)} variant="ghost" className="px-8 py-6 rounded-2xl font-bold">Back</Button>
              <Button onClick={handleStartGeneration} variant="premium" className="flex-1 py-6 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Clips
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative w-48 h-48 mb-12">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full"></div>
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="text-blue-500 transition-all duration-1000 ease-linear" 
                  strokeWidth="6" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="47" 
                  cx="50" 
                  cy="50"
                  strokeDasharray="295.3"
                  strokeDashoffset="70" // Mock progress
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Sparkles className="w-10 h-10 text-blue-400 mb-2 animate-bounce" />
                <span className="text-3xl font-black text-white font-mono tracking-tighter">75%</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Analyzing & Cutting...</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              Our AI is currently transcribing your video and identifying the most viral moments. This usually takes 2-3 minutes.
            </p>

            <div className="mt-12 space-y-4 w-full max-w-xs mx-auto">
              {[
                { label: "Transcription", status: "complete" },
                { label: "Moment Detection", status: "processing" },
                { label: "Video Rendering", status: "pending" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                   <span className="text-sm font-medium text-slate-300">{item.label}</span>
                   {item.status === "complete" ? (
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                   ) : item.status === "processing" ? (
                     <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <div className="w-4 h-4 border-2 border-slate-700 rounded-full" />
                   )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Usage Limit Reached</h3>
            <p className="text-slate-400 mb-8">
              This video will put you over your monthly processing limit. Upgrade your plan to continue growing your audience.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setShowUpgradeModal(false)} variant="ghost" className="flex-1">Cancel</Button>
              <Link href="/dashboard" className="flex-1">
                <Button variant="premium" className="w-full">Upgrade Now</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

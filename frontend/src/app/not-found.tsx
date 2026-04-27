"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Home, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000" />
      
      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex p-4 rounded-3xl bg-slate-900 border border-slate-800 mb-8 glass-panel shadow-2xl">
            <Sparkles className="w-12 h-12 text-blue-500" />
          </div>
          
          <h1 className="text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Lost in Space</h2>
          <p className="text-slate-400 mb-10 font-medium">
            The page you're looking for doesn't exist or has been moved to another dimension.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button variant="premium" className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20">
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-slate-800 text-slate-400 font-bold hover:bg-slate-900 transition-all"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

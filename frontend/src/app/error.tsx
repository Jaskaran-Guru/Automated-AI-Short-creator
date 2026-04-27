"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full animate-blob" />
      
      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex p-4 rounded-3xl bg-slate-900 border border-red-500/20 mb-8 glass-panel shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">System Error</h1>
          <p className="text-slate-400 mb-10 font-medium">
            Something went wrong on our end. We've logged the error and are looking into it.
          </p>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => reset()}
              variant="premium" 
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Link href="/dashboard" className="w-full">
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-slate-800 text-slate-400 font-bold hover:bg-slate-900 transition-all"
              >
                <Home className="w-5 h-5 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-[#05070a] text-white flex items-center justify-center min-h-screen p-6 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 mb-8 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter italic uppercase">Critical System Failure</h1>
          <p className="text-slate-400 mb-10 font-medium">
            A critical error occurred in the root layout. This has been logged for immediate review by the engineering team.
          </p>
          <Button 
            onClick={() => reset()}
            variant="default" 
            className="w-full h-14 rounded-2xl font-bold text-lg bg-white text-black hover:bg-slate-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Recover System
          </Button>
        </div>
      </body>
    </html>
  )
}

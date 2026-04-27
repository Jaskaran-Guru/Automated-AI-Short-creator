"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Scissors, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (signupError) {
        setError(signupError.message)
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.session) {
          router.push("/dashboard")
        } else {
          setError("Verification email sent! Please check your inbox.")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mb-4 shadow-lg shadow-purple-500/20">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Join ClipGen AI</h1>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-white">Create an account</CardTitle>
            <CardDescription className="text-slate-400">Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {error && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${error.includes("sent") ? "bg-blue-500/10 text-blue-400 border border-blue-500/50" : "bg-red-500/10 text-red-400 border border-red-500/50"}`}>
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <Button type="submit" variant="premium" className="w-full h-12 text-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-500">Or register with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full text-slate-300 border-slate-700 hover:bg-slate-800">
                Google
              </Button>
              <Button variant="outline" className="w-full text-slate-300 border-slate-700 hover:bg-slate-800">
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  )
}

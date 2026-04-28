"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { BACKEND_URL } from "@/lib/api"

export default function SettingsPage() {
  const [name, setName] = useState("Alex")
  const [email, setEmail] = useState("alex@example.com")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`${BACKEND_URL}/user/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 italic uppercase">Account Settings</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Manage your profile and workspace preferences.</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 max-w-2xl rounded-[2.5rem] glass-panel p-4">
        <CardHeader>
          <CardTitle className="text-white uppercase italic">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Name</label>
            <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
            <input 
                type="email" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-500 outline-none" 
                value={email} 
                disabled 
            />
          </div>
          <Button 
            variant="premium" 
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Changes Saved</span>
            ) : (
                "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

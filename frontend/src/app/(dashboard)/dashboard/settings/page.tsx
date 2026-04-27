"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-slate-400">Manage your profile and workspace preferences.</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Name</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" defaultValue="Alex" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Email</label>
            <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-500 outline-none" defaultValue="alex@example.com" disabled />
          </div>
          <Button variant="premium">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

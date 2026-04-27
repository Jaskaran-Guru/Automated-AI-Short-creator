"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { getBrandKits, createBrandKit, deleteBrandKit, type BrandKit } from "@/lib/api"

export default function TemplatesPage() {
  const [kits, setKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [name, setName] = useState("")
  const [fontFamily, setFontFamily] = useState("Impact")
  const [primaryColor, setPrimaryColor] = useState("#ffffff")

  useEffect(() => {
    fetchKits()
  }, [])

  const fetchKits = async () => {
    setLoading(true)
    const data = await getBrandKits()
    setKits(data)
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!name) return
    // In a real app, pass the logged-in user's ID
    const newKit = await createBrandKit({ name, font_family: fontFamily, primary_color: primaryColor, user_id: 'mock-uuid' })
    if (newKit) {
      setKits([...kits, ...newKit])
      setName("")
    }
  }

  const handleDelete = async (id: string) => {
    const success = await deleteBrandKit(id)
    if (success) {
      setKits(kits.filter(k => k.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Templates & Brand Kit</h1>
          <p className="text-slate-400">Manage your caption styles, fonts, and brand colors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <Card className="bg-slate-900/50 border-slate-800 lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-white">Create New Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Template Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hormozi Style"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Font Family</label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
              >
                <option value="Impact">Impact</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Primary Color</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 bg-transparent border-0 rounded cursor-pointer" 
                />
                <span className="text-white font-mono">{primaryColor}</span>
              </div>
            </div>
            <Button variant="premium" className="w-full mt-4" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" /> Save Template
            </Button>
          </CardContent>
        </Card>

        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading templates...</div>
          ) : kits.length === 0 ? (
            <div className="text-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-xl">
              No custom templates created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kits.map((kit) => (
                <Card key={kit.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-lg font-bold text-white">{kit.name}</h3>
                      <div className="flex gap-2">
                        <button className="text-slate-500 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button className="text-slate-500 hover:text-red-400 transition-colors" onClick={() => kit.id && handleDelete(kit.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden mb-4 border border-slate-800">
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span 
                          className="text-2xl font-black uppercase tracking-tight drop-shadow-md" 
                          style={{ fontFamily: kit.font_family, color: kit.primary_color }}
                        >
                          SAMPLE TEXT
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Font: {kit.font_family}</span>
                      <div className="flex items-center gap-1">Color: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kit.primary_color }}></div></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

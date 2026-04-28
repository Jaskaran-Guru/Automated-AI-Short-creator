"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Trash2, Clock, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react"
import Link from "next/link"
import { getProjects, BACKEND_URL, deleteProject } from "@/lib/api"

interface Project {
  id: string
  name: string
  status: string
  progress: number
  message: string
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/projects`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/project/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProjects(prev => prev.filter(p => p.id !== id));
        } else {
          alert("Failed to delete project from backend.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete project.");
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Failed</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">Uploaded</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-outfit">My Projects</h1>
          <p className="text-slate-400">Track and manage your AI video creations.</p>
        </div>
        <Link href="/upload">
          <Button variant="premium">Create New Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800 rounded-3xl">
            <CardContent className="p-6 text-center text-slate-500 py-20">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="mb-6">Start by uploading your first long-form video.</p>
              <Link href="/upload">
                <Button variant="secondary">Upload Video</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group overflow-hidden glass rounded-3xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-48 h-32 bg-slate-800 relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/20" />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {project.created_at}</span>
                        <span className="flex items-center gap-1">{getStatusBadge(project.status)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {project.status === "completed" ? (
                        <Link href={`/upload?step=3&id=${project.id}`}>
                          <Button variant="secondary" size="sm">View Results</Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" disabled className="text-slate-500">
                          {Math.round(project.progress * 100)}% Complete
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

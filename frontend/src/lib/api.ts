import { supabase } from "./supabase"

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// --- Backend API Functions ---

export async function uploadVideoToBackend(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BACKEND_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload video to backend')
  }

  return response.json() // { project_id: string }
}

export async function startProcessing(projectId: string, numShorts: number = 3, duration: number = 30) {
  const response = await fetch(`${BACKEND_URL}/process/${projectId}?num_shorts=${numShorts}&duration=${duration}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to start processing')
  }

  return response.json()
}

export async function getProjectStatus(projectId: string) {
  const response = await fetch(`${BACKEND_URL}/status/${projectId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch project status')
  }

  return response.json()
}

export async function cancelProcessing(projectId: string) {
  const response = await fetch(`${BACKEND_URL}/cancel/${projectId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to cancel processing')
  }

  return response.json()
}

// --- Projects CRUD ---

export async function createProject(title: string, userId: string, projectId?: string) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      title, 
      user_id: userId,
      backend_id: projectId // Store the backend project ID
    }])
    .select()
  if (error) console.error("Error creating project:", error)
  return data
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error("Error fetching projects:", error)
  return data || []
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) console.error("Error deleting project:", error)
  return error == null
}

// --- Brand Kits (Templates) CRUD ---

export interface BrandKit {
  id?: string
  user_id?: string
  name: string
  font_family: string
  primary_color: string
}

export async function createBrandKit(kit: BrandKit) {
  const { data, error } = await supabase
    .from('brand_kits')
    .insert([kit])
    .select()
  if (error) console.error("Error creating brand kit:", error)
  return data
}

export async function getBrandKits() {
  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
  if (error) console.error("Error fetching brand kits:", error)
  return data || []
}

export async function updateBrandKit(id: string, updates: Partial<BrandKit>) {
  const { data, error } = await supabase
    .from('brand_kits')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) console.error("Error updating brand kit:", error)
  return data
}

export async function deleteBrandKit(id: string) {
  const { error } = await supabase
    .from('brand_kits')
    .delete()
    .eq('id', id)
  if (error) console.error("Error deleting brand kit:", error)
  return error == null
}

// --- Users (Admin) ---

export async function getAllUsers() {
  // Note: Depending on Supabase RLS policies, this usually requires a service_role key
  // We mock it here for the UI if auth.users is restricted.
  const { data, error } = await supabase
    .from('auth.users') // or a custom public.profiles table
    .select('*')
  if (error) console.error("Error fetching users:", error)
  return data || []
}

import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/5 via-slate-950 to-slate-950">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  )
}

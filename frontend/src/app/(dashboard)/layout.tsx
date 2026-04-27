import { Sidebar } from "@/components/dashboard/Sidebar"
import { Bell, Search } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { PageWrapper } from "@/components/dashboard/PageWrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="relative w-96 text-slate-400 focus-within:text-white transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <button className="hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <PageWrapper>
            {children}
          </PageWrapper>
        </main>
      </div>
    </div>
  )
}

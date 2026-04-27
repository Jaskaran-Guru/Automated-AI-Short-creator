"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, Users, CreditCard, 
  MessageSquare, ShieldAlert, Settings,
  LogOut, ShieldCheck, Activity, Zap,
  Terminal, TrendingUp, Brain, DollarSign,
  Sunrise, LineChart, Heart, ClipboardList
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"

const menuItems = [
  // Phase 9: Operating System
  { icon: Sunrise,         label: "CEO Morning",       href: "/admin/ceo" },
  { icon: LineChart,       label: "Forecast",          href: "/admin/forecast" },
  { icon: ClipboardList,   label: "Execution",         href: "/admin/execution" },
  // Phase 8: Intelligence
  { icon: LayoutDashboard, label: "Executive",         href: "/admin" },
  { icon: Brain,           label: "Intelligence",      href: "/admin/intelligence" },
  // Phase 7: Scale
  { icon: TrendingUp,      label: "Sales CRM",         href: "/admin/sales" },
  { icon: DollarSign,      label: "Finance",           href: "/admin/finance" },
  { icon: Heart,           label: "Customer Success",  href: "/admin/customer-success" },
  { icon: ShieldCheck,     label: "Enterprise",        href: "/admin/enterprise" },
  // Phase 5: Operations
  { icon: Users,           label: "Users",             href: "/admin/users" },
  { icon: CreditCard,      label: "Billing Ops",       href: "/admin/billing" },
  { icon: MessageSquare,   label: "Support Desk",      href: "/admin/tickets" },
  { icon: Activity,        label: "Worker Health",     href: "/admin/jobs" },
  { icon: Terminal,        label: "System Logs",       href: "/admin/logs" },
  { icon: ShieldAlert,     label: "Risk & Fraud",      href: "/admin/risk" },
  { icon: Zap,             label: "Growth CRM",        href: "/admin/growth" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-72 h-screen bg-slate-950 border-r border-slate-900 flex flex-col sticky top-0 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white uppercase">VIRAIL</span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] -mt-1">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                pathname === item.href 
                  ? "bg-red-500/10 text-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-red-500" : "text-slate-500")} />
              {item.label}
              {pathname === item.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <UserButton />
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Super Admin</span>
                 <span className="text-[10px] text-slate-500">v1.2.4</span>
              </div>
           </div>
        </div>
        
        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
          <Zap className="w-4 h-4" />
          Back to App
        </Link>
      </div>
    </div>
  )
}

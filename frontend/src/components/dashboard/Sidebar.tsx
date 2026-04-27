"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Video, 
  CreditCard, 
  Settings,
  Zap,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Lightbulb,
  Trophy,
  Link2,
  Gift,
  Cpu,
  ShoppingBag,
  Share2
} from "lucide-react"

const sidebarGroups = [
  {
    label: "Core",
    items: [
      { name: "Projects", href: "/dashboard", icon: Video },
      { name: "Clients", href: "/dashboard/clients", icon: Users },
      { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { name: "Intelligence", href: "/dashboard/intelligence", icon: Cpu },
      { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
      { name: "Benchmarks", href: "/dashboard/benchmarks", icon: Trophy },
    ]
  },
  {
    label: "Growth",
    items: [
      { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
      { name: "Integrations", href: "/dashboard/integrations", icon: Link2 },
      { name: "Referrals", href: "/dashboard/referrals", icon: Gift },
      { name: "Share Report", href: "/dashboard/share", icon: Share2 },
    ]
  },
  {
    label: "Account",
    items: [
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Team", href: "/dashboard/team", icon: Shield },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen border-r border-slate-800 bg-sidebar flex flex-col pt-6 fixed left-0 top-0 overflow-y-auto">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase">Virail</span>
      </div>

      <nav className="flex-1 px-4">
        {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`relative flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}>
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          className="absolute inset-0 bg-slate-800/80 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-4 h-4 mr-3 relative z-10" />
                      <span className="text-sm font-medium relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 blur-xl rounded-full" />
          <h4 className="text-sm font-semibold text-white mb-1">Pro Plan</h4>
          <p className="text-xs text-slate-400 mb-3">142 / 200 credits used</p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-500 w-[71%]" />
          </div>
          <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors w-full text-left">
            Upgrade Plan &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

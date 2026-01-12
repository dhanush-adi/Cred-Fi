"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Zap, ShoppingCart, Sliders, Settings } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/credit", icon: TrendingUp, label: "Credit" },
  { href: "/dashboard/agents", icon: Zap, label: "Agents" },
  { href: "/dashboard/marketplace", icon: ShoppingCart, label: "Marketplace" },
  { href: "/dashboard/demo", icon: Sliders, label: "Demo" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/40 h-[calc(100vh-4rem)]">
      <div className="flex-1 px-6 py-8 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

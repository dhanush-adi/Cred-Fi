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

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border/40 bg-card/80 backdrop-blur-md z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-16 h-16 gap-1 transition ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

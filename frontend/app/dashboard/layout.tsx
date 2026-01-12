"use client"

import type React from "react"

import { useState } from "react"
import { TopNav } from "@/components/dashboard/top-nav"
import { SideNav } from "@/components/dashboard/side-nav"
import { BottomNav } from "@/components/dashboard/bottom-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  const handleDisconnect = () => {
    // TODO: Implement wallet disconnect
    console.log("Disconnect wallet")
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        creditScore={72}
        walletAddress="0x1234567890abcdef"
        onMenuToggle={setNavOpen}
        onDisconnect={handleDisconnect}
      />

      <div className="flex">
        <SideNav />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}

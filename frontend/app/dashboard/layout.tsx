"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/dashboard/top-nav"
import { SideNav } from "@/components/dashboard/side-nav"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { useWallet } from "@/hooks/use-wallet"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)
  const [creditScore, setCreditScore] = useState(0)
  const { address, isConnected } = useWallet()

  // Fetch credit score when wallet changes
  useEffect(() => {
    if (!isConnected || !address) {
      setCreditScore(0)
      return
    }

    const fetchCreditScore = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/${address}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setCreditScore(data.creditScore || 0)
        }
      } catch (error) {
        console.error("Error fetching credit score:", error)
        setCreditScore(0)
      }
    }

    fetchCreditScore()
  }, [address, isConnected])

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        creditScore={creditScore}
        onMenuToggle={setNavOpen}
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

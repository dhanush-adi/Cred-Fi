"use client"

import type React from "react"
import { DashboardContext } from "@/lib/context"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState(null)
  const [creditAnalysis, setCreditAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <DashboardContext.Provider
      value={{
        userProfile,
        creditAnalysis,
        isLoading,
        error,
        setUserProfile,
        setCreditAnalysis,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

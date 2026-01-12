import React from "react"
import type { UserProfile, CreditAnalysis } from "./types"

export interface DashboardContextType {
  userProfile: UserProfile | null
  creditAnalysis: CreditAnalysis | null
  isLoading: boolean
  error: string | null
  setUserProfile: (profile: UserProfile | null) => void
  setCreditAnalysis: (analysis: CreditAnalysis | null) => void
}

export const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)

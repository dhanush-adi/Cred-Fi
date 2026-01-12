// Smart Contract Types
export interface ContractAddresses {
  agentWalletFactory: string
  flexCreditCore: string
  marketplaceRouter: string
  tokenVault: string
  creditOracle: string
}

// User & Wallet Types
export interface UserProfile {
  walletAddress: string
  creditScore: number
  riskTier: "excellent" | "good" | "fair" | "building"
  monthlyIncome?: number
  incomeVerified: boolean
  joinedAt: Date
}

// Credit Score Types
export interface CreditFactor {
  name: string
  value: number
  weight: number
  description: string
}

export interface CreditAnalysis {
  creditScore: number
  riskTier: "excellent" | "good" | "fair" | "building"
  factors: CreditFactor[]
  availableCredit: number
  usedCredit: number
  apr: number
}

// Agent Types
export type AgentType = "Trading" | "Yield" | "Payment" | "Shopping"

export interface Agent {
  id: string
  name: string
  type: AgentType
  icon: string
  status: "active" | "paused"
  dailyLimit: number
  reputation: number
  performance: number
  deployed?: boolean
}

// Marketplace Types
export type MarketplaceCategory = "E-commerce" | "Food"

export interface Product {
  id: string
  title: string
  description: string
  image: string
  category: MarketplaceCategory
  priceShm: number
  priceUsdc: number
  inStock: boolean
}

// Demo Contract Types
export interface DemoContract {
  id: string
  name: string
  description: string
  requiredCreditScore: number
  functionName: string
  params: string[]
}

// Transaction Types
export interface Transaction {
  id: string
  timestamp: Date
  type: "send" | "receive" | "borrow" | "repay" | "swap"
  amount: number
  token: string
  recipient?: string
  sender?: string
  status: "pending" | "confirmed" | "failed"
  hash?: string
}

// Income Verification Types
export type VerificationProvider = "Wise" | "Binance" | "Stripe" | "PayPal"

export interface IncomeVerificationRequest {
  walletAddress: string
  provider: VerificationProvider
}

export interface IncomeVerificationStatus {
  requestId: string
  status: "pending" | "verified" | "failed"
  monthlyIncome?: number
  verifiedAt?: Date
}

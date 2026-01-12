// Network Configuration
export const SHARDEUM_TESTNET = {
  chainId: 8119,
  name: "Shardeum Mezame",
  nativeCurrency: { name: "SHM", symbol: "SHM", decimals: 18 },
  rpcUrls: ["https://api-mezame.shardeum.org"],
  blockExplorerUrls: ["https://explorer-mezame.shardeum.org/"],
}

// Smart Contract Addresses (Placeholders - will be replaced after deployment)
export const CONTRACT_ADDRESSES = {
  agentWalletFactory: "0x0000000000000000000000000000000000000000",
  flexCreditCore: "0x0000000000000000000000000000000000000000",
  marketplaceRouter: "0x0000000000000000000000000000000000000000",
  tokenVault: "0x0000000000000000000000000000000000000000",
  creditOracle: "0x0000000000000000000000000000000000000000",
}

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Feature Gate Score Requirements
export const FEATURE_GATES = {
  marketplace: 30,
  borrowing: 40,
  agents: 50,
  dexTrading: 60,
}

// Credit Score Tiers
export const CREDIT_TIERS = {
  excellent: { min: 80, label: "Excellent", color: "#10b981" },
  good: { min: 60, max: 79, label: "Good", color: "#3b82f6" },
  fair: { min: 40, max: 59, label: "Fair", color: "#f59e0b" },
  building: { min: 0, max: 39, label: "Building", color: "#ef4444" },
}

// Verification Providers
export const VERIFICATION_PROVIDERS = ["Wise", "Binance", "Stripe", "PayPal"] as const

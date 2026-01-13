// Network Configuration
export const SHARDEUM_TESTNET = {
  chainId: 8119,
  name: "Shardeum Mezame",
  nativeCurrency: { name: "SHM", symbol: "SHM", decimals: 18 },
  rpcUrls: ["https://api-mezame.shardeum.org"],
  blockExplorerUrls: ["https://explorer-mezame.shardeum.org/"],
}

// Smart Contract Addresses (Deployed on Shardeum Mezame Testnet)
export const CONTRACT_ADDRESSES = {
  flexCreditCore: "0x787ce73eEC3182c6E9Bdd6bC48844541F8A16b63",
  agentPolicy: "0x4e1111768eB562d0f551DB76acd139510445B997",
  incomeProofVerifier: "0xB32EE796D1c7f98cC53A229B136b4977AE28050b",
  agentPerformanceVerifier: "0xEDFAEF37272dB1E71D474443Ed8bCa2152C851c5",
  confidentialScore: "0x3de03AB80fdDDa888598303FF34E496bD29E140F", // Update after Inco deployment
  // Legacy placeholders
  agentWalletFactory: "0x0000000000000000000000000000000000000000",
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

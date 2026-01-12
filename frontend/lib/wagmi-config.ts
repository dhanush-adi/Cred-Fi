import { getDefaultConfig } from "@rainbow-me/rainbowkit"

// Custom Shardeum chain definition
const shardeum = {
  id: 8119,
  name: "Shardeum Mezame",
  nativeCurrency: { name: "SHM", symbol: "SHM", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api-mezame.shardeum.org"] },
    public: { http: ["https://api-mezame.shardeum.org"] },
  },
  blockExplorers: {
    default: { name: "Shardeum Explorer", url: "https://explorer-mezame.shardeum.org/" },
  },
} as const

// Get WalletConnect Project ID from env, or skip WalletConnect if not configured
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const config = getDefaultConfig({
  appName: "Cred-Fi",
  projectId: projectId || "default", // Use 'default' if no project ID
  chains: [shardeum as any],
  ssr: true,
})

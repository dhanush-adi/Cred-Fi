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

export const config = getDefaultConfig({
  appName: "Cred-Fi",
  projectId: "YOUR_PROJECT_ID", // Get from WalletConnect Cloud
  chains: [shardeum as any],
  ssr: true,
})

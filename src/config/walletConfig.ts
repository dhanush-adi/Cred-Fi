import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { NETWORK_CONFIG } from './network';

// WalletConnect Project ID (get from https://cloud.walletconnect.com)
export const WALLETCONNECT_PROJECT_ID = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '6caa6e548b90c8f33f8d7b4a6bcf8d9e';

// Metadata for your app
const metadata = {
  name: 'Cred-Fi',
  description: 'DeFi Credit Platform on Shardeum',
  url: 'https://cred-fi.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Define Shardeum network
const shardeumNetwork = {
  chainId: NETWORK_CONFIG.chainId,
  name: NETWORK_CONFIG.chainName,
  currency: NETWORK_CONFIG.nativeCurrency.symbol,
  explorerUrl: NETWORK_CONFIG.blockExplorer,
  rpcUrl: NETWORK_CONFIG.rpcUrl,
};

// Create Web3Modal configuration
export const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true, // Enable EIP-6963 for better wallet discovery
  enableInjected: true, // Enable injected wallets (MetaMask, etc.)
  enableCoinbase: true, // Enable Coinbase Wallet
  defaultChainId: NETWORK_CONFIG.chainId,
  rpcUrl: NETWORK_CONFIG.rpcUrl,
});

// Initialize Web3Modal
export const web3Modal = createWeb3Modal({
  ethersConfig,
  chains: [shardeumNetwork],
  projectId: WALLETCONNECT_PROJECT_ID,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#9333EA',
    '--w3m-border-radius-master': '8px',
  },
});

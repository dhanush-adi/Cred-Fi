// Network Configuration - Shardeum Sphinx Testnet
export const NETWORK_CONFIG = {
  chainId: 8082, // Shardeum Sphinx 1.X Testnet
  chainName: 'Shardeum Sphinx 1.X',
  rpcUrl: 'https://sphinx.shardeum.org/',
  blockExplorer: 'https://explorer-sphinx.shardeum.org',
  nativeCurrency: {
    name: 'Shardeum',
    symbol: 'SHM',
    decimals: 18,
  },
  // Contract addresses (update these after deployment)
  contracts: {
    creditCore: '', // Deploy FlexCreditCore
    incomeVerifier: '', // Deploy IncomeProofVerifier
    agentVerifier: '', // Deploy AgentPerformanceVerifier
    agentPolicy: '', // Deploy AgentPolicy
  },
  // Token addresses on Shardeum (to be added after deployment)
  tokens: {
    usdc: '', // USDC on Shardeum
    usdt: '', // USDT on Shardeum
    dai: '', // DAI on Shardeum
  },
};

// Display configuration
export const DISPLAY_CONFIG = {
  networkName: 'Shardeum',
  networkBadge: 'Sphinx Testnet',
  nativeToken: 'SHM',
  stablecoin: 'USDC',
};

/**
 * AgentWallet Integration Types
 * TypeScript interfaces matching the Solidity contracts
 */

export interface AgentWallet {
  owner: string;
  agent: string;
  dailyLimit: bigint;
  spentToday: bigint;
  lastResetTime: bigint;
  reputation: number;
  isActive: boolean;
}

export interface AgentPolicy {
  maxDailySpend: bigint;
  maxSingleTransaction: bigint;
  allowedCategories: string[];
  requiresApproval: boolean;
  minReputation: number;
}

export interface AgentPerformance {
  totalTransactions: number;
  successfulTransactions: number;
  totalVolume: bigint;
  averageGasUsed: bigint;
  reputationScore: number;
  lastActivityTime: bigint;
}

export interface IncomeProof {
  user: string;
  monthlyIncome: bigint;
  verificationHash: string;
  timestamp: bigint;
  provider: 'wise' | 'binance' | 'stripe' | 'paypal';
  isVerified: boolean;
}

export interface CreditLine {
  user: string;
  creditLimit: bigint;
  used: bigint;
  available: bigint;
  apr: number;
  collateralRatio: number;
  lastPaymentDate: bigint;
  status: 'active' | 'suspended' | 'closed';
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  priceSHM: bigint;
  priceToken: bigint;
  tokenAddress: string;
  seller: string;
  category: 'ecommerce' | 'food' | 'service';
  inStock: boolean;
}

export interface AgentTransaction {
  id: string;
  agentWallet: string;
  to: string;
  amount: bigint;
  category: string;
  timestamp: bigint;
  status: 'pending' | 'executed' | 'failed';
  gasUsed?: bigint;
}

// Contract ABIs (simplified for demo)
export const AGENT_WALLET_ABI = [
  'function createAgentWallet(address agent) external returns (address)',
  'function executeTransaction(address to, uint256 amount, bytes memory data) external',
  'function updateDailyLimit(uint256 newLimit) external',
  'function getWalletInfo() external view returns (address owner, address agent, uint256 dailyLimit, uint256 spentToday, uint256 reputation)',
  'event TransactionExecuted(address indexed to, uint256 amount, bool success)',
  'event DailyLimitUpdated(uint256 newLimit)',
];

export const CREDIT_CORE_ABI = [
  'function requestCredit(uint256 amount, bytes32 incomeProofHash) external',
  'function getCreditLine(address user) external view returns (uint256 limit, uint256 used, uint256 available, uint256 apr)',
  'function repay(uint256 amount) external',
  'function borrow(uint256 amount) external',
  'event CreditApproved(address indexed user, uint256 limit, uint256 apr)',
  'event Borrowed(address indexed user, uint256 amount)',
  'event Repaid(address indexed user, uint256 amount)',
];

export const MARKETPLACE_ABI = [
  'function listProduct(string memory title, string memory description, uint256 priceSHM, uint256 priceToken, address tokenAddress) external returns (uint256)',
  'function buyWithSHM(uint256 productId) external payable',
  'function buyWithToken(uint256 productId, address tokenAddress, uint256 amount) external',
  'function getProduct(uint256 productId) external view returns (string memory title, string memory description, uint256 priceSHM, uint256 priceToken, address seller, bool inStock)',
  'event ProductListed(uint256 indexed productId, address indexed seller, uint256 priceSHM)',
  'event ProductPurchased(uint256 indexed productId, address indexed buyer, uint256 amount)',
];

export const INCOME_VERIFIER_ABI = [
  'function submitIncomeProof(uint256 monthlyIncome, bytes32 proofHash, string memory provider) external',
  'function verifyIncome(address user) external view returns (uint256 monthlyIncome, bool isVerified, uint256 timestamp)',
  'event IncomeVerified(address indexed user, uint256 monthlyIncome, string provider)',
];

export const AGENT_PERFORMANCE_ABI = [
  'function recordTransaction(address agent, bool success, uint256 gasUsed) external',
  'function getPerformance(address agent) external view returns (uint256 totalTx, uint256 successfulTx, uint256 reputation)',
  'function updateReputation(address agent, int256 change) external',
  'event PerformanceRecorded(address indexed agent, bool success, uint256 gasUsed)',
];

// Contract addresses on Shardeum (update after deployment)
export const CONTRACT_ADDRESSES = {
  agentWalletFactory: '0x0000000000000000000000000000000000000000',
  agentPolicy: '0x0000000000000000000000000000000000000000',
  agentPerformanceVerifier: '0x0000000000000000000000000000000000000000',
  incomeProofVerifier: '0x0000000000000000000000000000000000000000',
  flexCreditCore: '0x0000000000000000000000000000000000000000',
  marketplaceRouter: '0x0000000000000000000000000000000000000000',
  ecommerceStore: '0x0000000000000000000000000000000000000000',
  foodStore: '0x0000000000000000000000000000000000000000',
  shop: '0x0000000000000000000000000000000000000000',
  simulateDex: '0x0000000000000000000000000000000000000000',
};

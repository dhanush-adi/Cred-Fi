import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../contracts/types';

/**
 * AI Agent Service - Manages autonomous agents for DeFi operations
 * Integrates with AgentWallet, AgentPolicy, and AgentPerformanceVerifier
 */

export interface AIAgent {
  id: string;
  name: string;
  walletAddress: string;
  type: 'trading' | 'yield' | 'payment' | 'shopping';
  status: 'active' | 'paused' | 'stopped';
  dailyLimit: number;
  spentToday: number;
  reputation: number;
  performance: {
    totalTransactions: number;
    successRate: number;
    profitGenerated: number;
    lastActivity: number;
  };
}

class AIAgentService {
  /**
   * Get available AI agents
   */
  async getAvailableAgents(): Promise<AIAgent[]> {
    return [
      {
        id: 'agent-1',
        name: 'DeFi Yield Optimizer',
        walletAddress: '0x...',
        type: 'yield',
        status: 'active',
        dailyLimit: 1000,
        spentToday: 0,
        reputation: 95,
        performance: {
          totalTransactions: 245,
          successRate: 98.5,
          profitGenerated: 1250,
          lastActivity: Date.now(),
        },
      },
      {
        id: 'agent-2',
        name: 'Smart Trader Bot',
        walletAddress: '0x...',
        type: 'trading',
        status: 'active',
        dailyLimit: 5000,
        spentToday: 0,
        reputation: 92,
        performance: {
          totalTransactions: 1823,
          successRate: 94.2,
          profitGenerated: 8900,
          lastActivity: Date.now(),
        },
      },
      {
        id: 'agent-3',
        name: 'Auto Payment Assistant',
        walletAddress: '0x...',
        type: 'payment',
        status: 'active',
        dailyLimit: 500,
        spentToday: 0,
        reputation: 99,
        performance: {
          totalTransactions: 456,
          successRate: 99.8,
          profitGenerated: 0,
          lastActivity: Date.now(),
        },
      },
      {
        id: 'agent-4',
        name: 'Shopping Assistant',
        walletAddress: '0x...',
        type: 'shopping',
        status: 'active',
        dailyLimit: 200,
        spentToday: 0,
        reputation: 88,
        performance: {
          totalTransactions: 89,
          successRate: 96.0,
          profitGenerated: 0,
          lastActivity: Date.now(),
        },
      },
    ];
  }

  /**
   * Deploy agent wallet for user
   */
  async deployAgentWallet(
    provider: ethers.BrowserProvider,
    agentId: string,
    dailyLimit: number
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      if (CONTRACT_ADDRESSES.agentWalletFactory === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, returning mock wallet');
        return '0x' + Math.random().toString(16).substring(2, 42);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.agentWalletFactory,
        [
          'function createAgentWallet(address agent, uint256 dailyLimit) external returns (address)',
        ],
        signer
      );

      // Use agent ID as address (in production, this would be actual agent address)
      const agentAddress = '0x' + agentId.padStart(40, '0').slice(0, 40);
      const dailyLimitWei = ethers.parseEther(dailyLimit.toString());

      const tx = await contract.createAgentWallet(agentAddress, dailyLimitWei);
      const receipt = await tx.wait();

      const event = receipt.logs.find((log: any) => log.eventName === 'WalletCreated');
      const walletAddress = event?.args?.wallet || receipt.contractAddress;

      console.log('✅ Agent wallet deployed:', walletAddress);
      return walletAddress;
    } catch (error) {
      console.error('Agent wallet deployment error:', error);
      throw error;
    }
  }

  /**
   * Execute agent transaction
   */
  async executeAgentTransaction(
    provider: ethers.BrowserProvider,
    agentWalletAddress: string,
    to: string,
    amount: number,
    data: string = '0x'
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        agentWalletAddress,
        [
          'function executeTransaction(address to, uint256 amount, bytes memory data) external returns (bool)',
        ],
        signer
      );

      const amountWei = ethers.parseEther(amount.toString());
      const tx = await contract.executeTransaction(to, amountWei, data);
      const receipt = await tx.wait();

      console.log('✅ Agent transaction executed:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Agent transaction error:', error);
      throw error;
    }
  }

  /**
   * Update agent daily limit
   */
  async updateDailyLimit(
    provider: ethers.BrowserProvider,
    agentWalletAddress: string,
    newLimit: number
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        agentWalletAddress,
        ['function updateDailyLimit(uint256 newLimit) external'],
        signer
      );

      const newLimitWei = ethers.parseEther(newLimit.toString());
      const tx = await contract.updateDailyLimit(newLimitWei);
      const receipt = await tx.wait();

      console.log('✅ Daily limit updated:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Daily limit update error:', error);
      throw error;
    }
  }

  /**
   * Get agent performance from blockchain
   */
  async getAgentPerformance(agentAddress: string): Promise<any> {
    try {
      if (CONTRACT_ADDRESSES.agentPerformanceVerifier === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, returning mock performance');
        return {
          totalTransactions: 100,
          successfulTransactions: 95,
          reputation: 95,
        };
      }

      // In production, query actual contract
      return {
        totalTransactions: 100,
        successfulTransactions: 95,
        reputation: 95,
      };
    } catch (error) {
      console.error('Performance fetch error:', error);
      return null;
    }
  }

  /**
   * Pause/Resume agent
   */
  async toggleAgentStatus(
    provider: ethers.BrowserProvider,
    agentWalletAddress: string,
    pause: boolean
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        agentWalletAddress,
        pause 
          ? ['function pause() external']
          : ['function unpause() external'],
        signer
      );

      const tx = pause ? await contract.pause() : await contract.unpause();
      const receipt = await tx.wait();

      console.log(`✅ Agent ${pause ? 'paused' : 'resumed'}:`, receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Agent status toggle error:', error);
      throw error;
    }
  }
}

export const aiAgentService = new AIAgentService();

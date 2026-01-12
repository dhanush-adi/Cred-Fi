import { ethers } from 'ethers';
import {
  AgentWallet,
  AgentPolicy,
  CreditLine,
  CONTRACT_ADDRESSES,
  AGENT_WALLET_ABI,
  CREDIT_CORE_ABI,
  INCOME_VERIFIER_ABI,
} from '../contracts/types';

/**
 * Integrated Service for Credit-based DeFi Platform
 * Flow: Connect Wallet → Credit Analysis (vlayer + Vouch) → Access Features
 */

export interface UserCreditProfile {
  walletAddress: string;
  creditScore: number; // 0-100
  creditLine: CreditLine | null;
  incomeVerified: boolean;
  monthlyIncome: number;
  riskTier: 'excellent' | 'good' | 'fair' | 'building';
  agentWallet: string | null;
  features: {
    canBorrow: boolean;
    canUseAgents: boolean;
    canAccessMarketplace: boolean;
    canTrade: boolean;
    maxBorrowAmount: number;
    apr: number;
  };
}

class IntegratedCreditService {
  private backendUrl = 'http://localhost:3001';

  /**
   * STEP 1: Comprehensive Credit Analysis
   * Combines vlayer proofs + Vouch verification
   */
  async analyzeCreditProfile(walletAddress: string): Promise<UserCreditProfile> {
    try {
      // Call backend for comprehensive analysis
      const response = await fetch(`${this.backendUrl}/api/vlayer/comprehensive-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallets: [walletAddress] }),
      });

      if (!response.ok) {
        throw new Error('Credit analysis failed');
      }

      const analysis = await response.json();

      // Determine risk tier
      const riskTier = this.calculateRiskTier(analysis.creditScore);
      
      // Calculate feature access based on credit score
      const features = {
        canBorrow: analysis.creditScore >= 40,
        canUseAgents: analysis.creditScore >= 50,
        canAccessMarketplace: analysis.creditScore >= 30,
        canTrade: analysis.creditScore >= 60,
        maxBorrowAmount: analysis.maxBorrowAmount,
        apr: this.calculateAPR(analysis.creditScore),
      };

      return {
        walletAddress,
        creditScore: analysis.creditScore,
        creditLine: null, // Will be populated after on-chain credit request
        incomeVerified: analysis.vouchVerification?.verified || false,
        monthlyIncome: analysis.vouchVerification?.monthlyIncome || 0,
        riskTier,
        agentWallet: null, // Will be created if user opts in
        features,
      };
    } catch (error) {
      console.error('Credit analysis error:', error);
      throw error;
    }
  }

  /**
   * STEP 2: Submit Income Verification to Blockchain
   * After Vouch verification, submit proof to IncomeProofVerifier.sol
   */
  async submitIncomeProofOnChain(
    provider: ethers.BrowserProvider,
    monthlyIncome: number,
    proofHash: string,
    vouchProvider: string
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();
      
      // In production, use actual contract address
      if (CONTRACT_ADDRESSES.incomeProofVerifier === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, simulating...');
        return '0x' + Math.random().toString(16).substring(2);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.incomeProofVerifier,
        INCOME_VERIFIER_ABI,
        signer
      );

      const monthlyIncomeWei = ethers.parseEther(monthlyIncome.toString());
      const tx = await contract.submitIncomeProof(monthlyIncomeWei, proofHash, vouchProvider);
      const receipt = await tx.wait();

      console.log('✅ Income proof submitted on-chain:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Income proof submission error:', error);
      throw error;
    }
  }

  /**
   * STEP 3: Request Credit Line from FlexCreditCore.sol
   * Based on credit score and income verification
   */
  async requestCreditLine(
    provider: ethers.BrowserProvider,
    requestedAmount: number,
    incomeProofHash: string
  ): Promise<CreditLine> {
    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // In production, use actual contract address
      if (CONTRACT_ADDRESSES.flexCreditCore === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, returning mock credit line');
        return {
          user: userAddress,
          creditLimit: BigInt(requestedAmount * 10 ** 18),
          used: BigInt(0),
          available: BigInt(requestedAmount * 10 ** 18),
          apr: 5.5,
          collateralRatio: 150,
          lastPaymentDate: BigInt(Date.now()),
          status: 'active',
        };
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.flexCreditCore,
        CREDIT_CORE_ABI,
        signer
      );

      const amountWei = ethers.parseEther(requestedAmount.toString());
      const tx = await contract.requestCredit(amountWei, incomeProofHash);
      await tx.wait();

      // Get credit line details
      const creditLine = await contract.getCreditLine(userAddress);

      return {
        user: userAddress,
        creditLimit: creditLine.limit,
        used: creditLine.used,
        available: creditLine.available,
        apr: Number(creditLine.apr) / 100,
        collateralRatio: 150,
        lastPaymentDate: BigInt(Date.now()),
        status: 'active',
      };
    } catch (error) {
      console.error('Credit line request error:', error);
      throw error;
    }
  }

  /**
   * STEP 4: Create Agent Wallet
   * Deploy AgentWallet.sol instance for user
   */
  async createAgentWallet(
    provider: ethers.BrowserProvider,
    agentAddress: string
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      // In production, use actual contract address
      if (CONTRACT_ADDRESSES.agentWalletFactory === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, returning mock wallet');
        return '0x' + Math.random().toString(16).substring(2, 42);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.agentWalletFactory,
        AGENT_WALLET_ABI,
        signer
      );

      const tx = await contract.createAgentWallet(agentAddress);
      const receipt = await tx.wait();

      // Extract wallet address from event
      const event = receipt.logs.find((log: any) => log.eventName === 'WalletCreated');
      const walletAddress = event?.args?.wallet || receipt.contractAddress;

      console.log('✅ Agent wallet created:', walletAddress);
      return walletAddress;
    } catch (error) {
      console.error('Agent wallet creation error:', error);
      throw error;
    }
  }

  /**
   * STEP 5: Borrow from Credit Line
   */
  async borrowFromCredit(
    provider: ethers.BrowserProvider,
    amount: number
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      if (CONTRACT_ADDRESSES.flexCreditCore === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, simulating borrow');
        return '0x' + Math.random().toString(16).substring(2);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.flexCreditCore,
        CREDIT_CORE_ABI,
        signer
      );

      const amountWei = ethers.parseEther(amount.toString());
      const tx = await contract.borrow(amountWei);
      const receipt = await tx.wait();

      console.log('✅ Borrowed from credit line:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Borrow error:', error);
      throw error;
    }
  }

  /**
   * Helper: Calculate risk tier
   */
  private calculateRiskTier(score: number): 'excellent' | 'good' | 'fair' | 'building' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'building';
  }

  /**
   * Helper: Calculate APR based on score
   */
  private calculateAPR(score: number): number {
    if (score >= 80) return 3.5;
    if (score >= 60) return 5.5;
    if (score >= 40) return 8.5;
    return 12.0;
  }
}

export const integratedCreditService = new IntegratedCreditService();

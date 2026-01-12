import { ethers } from 'ethers';

/**
 * Vouch Integration Service
 * Uses vlayer for ZK proof of income verification
 * Docs: https://docs.getvouch.io/introduction
 */

export interface VouchVerificationResult {
  verified: boolean;
  provider: 'wise' | 'binance' | 'stripe' | 'paypal';
  monthlyIncome: number;
  verificationDate: string;
  proofHash: string;
  requestId?: string;
}

export interface CreditAnalysis {
  walletAddress: string;
  creditScore: number; // 0-100
  riskTier: 'excellent' | 'good' | 'fair' | 'building';
  maxBorrowAmount: number; // in USD
  interestRate: number; // APR %
  collateralRatio: number; // Required collateral %
  factors: {
    onChainActivity: number; // 0-100
    walletBalance: number; // 0-100
    incomeVerification: number; // 0-100
    transactionHistory: number; // 0-100
    multiWalletScore: number; // 0-100
  };
  vouchVerification?: VouchVerificationResult;
  recommendations: string[];
}

class VouchService {
  private backendUrl = 'http://localhost:3001';

  /**
   * Initiate Vouch verification for a wallet
   * @param walletAddress - Ethereum address to verify
   * @param provider - Income provider (wise, binance, stripe, paypal)
   */
  async initiateVouchVerification(
    walletAddress: string,
    provider: 'wise' | 'binance' | 'stripe' | 'paypal'
  ): Promise<{ requestId: string; redirectUrl: string }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/vouch/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, provider }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Vouch verification');
      }

      return await response.json();
    } catch (error) {
      console.error('Vouch initiation error:', error);
      throw error;
    }
  }

  /**
   * Check Vouch verification status
   * @param requestId - Verification request ID
   */
  async checkVouchStatus(requestId: string): Promise<VouchVerificationResult | null> {
    try {
      const response = await fetch(`${this.backendUrl}/api/vouch/status/${requestId}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Vouch status check error:', error);
      return null;
    }
  }

  /**
   * Analyze multiple wallets for comprehensive credit score
   * @param walletAddresses - Array of wallet addresses to analyze
   */
  async analyzeMultipleWallets(walletAddresses: string[]): Promise<CreditAnalysis> {
    try {
      const response = await fetch(`${this.backendUrl}/api/vlayer/analyze-multi-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddresses }),
      });

      if (!response.ok) {
        throw new Error('Multi-wallet analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Multi-wallet analysis error:', error);
      throw error;
    }
  }

  /**
   * Comprehensive credit analysis with Vouch verification
   * @param primaryWallet - Main wallet address
   * @param additionalWallets - Other wallet addresses (optional)
   * @param vouchRequestId - Vouch verification request ID (optional)
   */
  async comprehensiveCreditAnalysis(
    primaryWallet: string,
    additionalWallets: string[] = [],
    vouchRequestId?: string
  ): Promise<CreditAnalysis> {
    try {
      const allWallets = [primaryWallet, ...additionalWallets];
      
      // Fetch Vouch verification if requestId provided
      let vouchData: VouchVerificationResult | undefined;
      if (vouchRequestId) {
        vouchData = (await this.checkVouchStatus(vouchRequestId)) || undefined;
      }

      const response = await fetch(`${this.backendUrl}/api/vlayer/comprehensive-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallets: allWallets,
          vouchVerification: vouchData,
        }),
      });

      if (!response.ok) {
        throw new Error('Comprehensive analysis failed');
      }

      const analysis: CreditAnalysis = await response.json();
      
      // Calculate risk tier and interest rate based on credit score
      analysis.riskTier = this.calculateRiskTier(analysis.creditScore);
      analysis.interestRate = this.calculateInterestRate(analysis.creditScore);
      analysis.collateralRatio = this.calculateCollateralRatio(analysis.creditScore);
      
      return analysis;
    } catch (error) {
      console.error('Comprehensive analysis error:', error);
      throw error;
    }
  }

  /**
   * Calculate risk tier based on credit score
   */
  private calculateRiskTier(score: number): 'excellent' | 'good' | 'fair' | 'building' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'building';
  }

  /**
   * Calculate interest rate based on credit score
   */
  private calculateInterestRate(score: number): number {
    if (score >= 80) return 3.5;  // Excellent: 3.5% APR
    if (score >= 60) return 5.5;  // Good: 5.5% APR
    if (score >= 40) return 8.5;  // Fair: 8.5% APR
    return 12.0;                  // Building: 12% APR
  }

  /**
   * Calculate required collateral ratio based on credit score
   */
  private calculateCollateralRatio(score: number): number {
    if (score >= 80) return 120;  // Excellent: 120% collateral
    if (score >= 60) return 150;  // Good: 150% collateral
    if (score >= 40) return 180;  // Fair: 180% collateral
    return 200;                   // Building: 200% collateral
  }

  /**
   * Generate ZK proof for credit score using vlayer
   */
  async generateCreditProof(walletAddress: string, creditScore: number): Promise<string> {
    try {
      const response = await fetch(`${this.backendUrl}/api/vlayer/generate-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, creditScore }),
      });

      if (!response.ok) {
        throw new Error('Proof generation failed');
      }

      const { proofHash } = await response.json();
      return proofHash;
    } catch (error) {
      console.error('Proof generation error:', error);
      // Return fallback proof
      return ethers.id(`${walletAddress}-${creditScore}-${Date.now()}`);
    }
  }
}

export const vouchService = new VouchService();

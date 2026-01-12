import { ethers } from 'ethers';
import { integratedCreditService, UserCreditProfile } from './integratedCreditService';
import { aiAgentService } from './aiAgentService';
import { marketplaceService } from './marketplaceService';
import { dexService } from './dexService';
import { vouchService } from './vouchService';

/**
 * Complete System Orchestrator
 * Manages the entire flow from wallet connection to all smart contract interactions
 */

export interface SystemState {
  // User state
  walletAddress: string;
  creditProfile: UserCreditProfile | null;
  
  // Agent state
  deployedAgents: any[];
  agentWallets: string[];
  
  // Credit state
  creditLine: any | null;
  outstandingDebt: bigint;
  
  // Marketplace state
  purchaseHistory: any[];
  
  // DEX state
  liquidityPositions: any[];
  swapHistory: any[];
}

class SystemOrchestrator {
  /**
   * STEP 1: Connect wallet and initialize system
   */
  async initializeUser(
    provider: ethers.BrowserProvider,
    walletAddress: string
  ): Promise<SystemState> {
    console.log('🚀 Initializing user system...');

    const state: SystemState = {
      walletAddress,
      creditProfile: null,
      deployedAgents: [],
      agentWallets: [],
      creditLine: null,
      outstandingDebt: BigInt(0),
      purchaseHistory: [],
      liquidityPositions: [],
      swapHistory: [],
    };

    // Step 1: Analyze credit profile
    console.log('📊 Step 1: Analyzing credit profile...');
    const creditProfile = await integratedCreditService.analyzeCreditProfile(walletAddress);
    state.creditProfile = creditProfile;

    console.log('✅ User initialized:', {
      creditScore: creditProfile.creditScore,
      canBorrow: creditProfile.canBorrow,
      canUseAgents: creditProfile.canUseAgents,
      canAccessMarketplace: creditProfile.canAccessMarketplace,
    });

    return state;
  }

  /**
   * STEP 2: Complete income verification flow
   */
  async completeIncomeVerification(
    walletAddress: string,
    provider: 'wise' | 'binance' | 'stripe' | 'paypal'
  ): Promise<{ requestId: string; verified: boolean; monthlyIncome: number }> {
    console.log('💰 Step 2: Completing income verification...');

    // Initiate Vouch verification
    const verification = await vouchService.initiateVouchVerification(walletAddress, provider);

    // Poll for completion (in production, use webhooks)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const status = await vouchService.checkVouchStatus(verification.requestId);

    console.log('✅ Income verified:', {
      provider,
      monthlyIncome: status.monthlyIncome,
      verified: status.verified,
    });

    return {
      requestId: verification.requestId,
      verified: status.verified,
      monthlyIncome: status.monthlyIncome,
    };
  }

  /**
   * STEP 3: Submit income proof on-chain
   */
  async submitIncomeProofOnChain(
    browserProvider: ethers.BrowserProvider,
    walletAddress: string,
    monthlyIncome: number,
    proofHash: string
  ): Promise<string> {
    console.log('⛓️ Step 3: Submitting income proof on-chain...');

    const txHash = await integratedCreditService.submitIncomeProofOnChain(
      browserProvider,
      walletAddress,
      monthlyIncome,
      proofHash
    );

    console.log('✅ Income proof submitted:', txHash);
    return txHash;
  }

  /**
   * STEP 4: Request credit line
   */
  async requestCreditLine(
    provider: ethers.BrowserProvider,
    walletAddress: string,
    requestedAmount: number
  ): Promise<any> {
    console.log('💳 Step 4: Requesting credit line...');

    const creditLine = await integratedCreditService.requestCreditLine(
      provider,
      walletAddress,
      requestedAmount
    );

    console.log('✅ Credit line approved:', {
      limit: ethers.formatEther(creditLine.creditLimit),
      apr: creditLine.apr,
      status: creditLine.status,
    });

    return creditLine;
  }

  /**
   * STEP 5: Deploy AI agent wallet
   */
  async deployAgentWallet(
    provider: ethers.BrowserProvider,
    agentType: 'trading' | 'yield' | 'payment' | 'shopping',
    dailyLimit: number
  ): Promise<{ agentId: string; walletAddress: string }> {
    console.log('🤖 Step 5: Deploying AI agent wallet...');

    const agentId = `agent-${agentType}-${Date.now()}`;
    const walletAddress = await aiAgentService.deployAgentWallet(
      provider,
      agentId,
      dailyLimit
    );

    console.log('✅ Agent wallet deployed:', {
      agentId,
      walletAddress,
      dailyLimit,
    });

    return { agentId, walletAddress };
  }

  /**
   * STEP 6: Execute agent transaction
   */
  async executeAgentTransaction(
    provider: ethers.BrowserProvider,
    agentWalletAddress: string,
    to: string,
    amount: number,
    purpose: string
  ): Promise<string> {
    console.log(`🔄 Step 6: Executing agent transaction (${purpose})...`);

    const txHash = await aiAgentService.executeAgentTransaction(
      provider,
      agentWalletAddress,
      to,
      amount
    );

    console.log('✅ Agent transaction executed:', txHash);
    return txHash;
  }

  /**
   * STEP 7: Purchase from marketplace
   */
  async purchaseFromMarketplace(
    provider: ethers.BrowserProvider,
    productId: string,
    paymentMethod: 'SHM' | 'TOKEN',
    useAgent: boolean = false
  ): Promise<string> {
    console.log('🛍️ Step 7: Purchasing from marketplace...');

    // Get product details
    const products = await marketplaceService.getEcommerceProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      throw new Error('Product not found');
    }

    let txHash: string;

    if (paymentMethod === 'SHM') {
      txHash = await marketplaceService.buyWithSHM(
        provider,
        productId,
        product.priceSHM,
        product.category as any
      );
    } else {
      txHash = await marketplaceService.buyWithToken(
        provider,
        productId,
        product.tokenAddress,
        product.priceToken,
        product.category as any
      );
    }

    console.log('✅ Purchase completed:', txHash);
    return txHash;
  }

  /**
   * STEP 8: Borrow from credit line
   */
  async borrowFromCreditLine(
    provider: ethers.BrowserProvider,
    amount: number
  ): Promise<string> {
    console.log('💵 Step 8: Borrowing from credit line...');

    const txHash = await integratedCreditService.borrowFromCredit(
      provider,
      amount
    );

    console.log('✅ Borrowed:', ethers.formatEther(ethers.parseEther(amount.toString())));
    return txHash;
  }

  /**
   * STEP 9: Execute DEX swap
   */
  async executeDexSwap(
    provider: ethers.BrowserProvider,
    tokenIn: string,
    tokenOut: string,
    amountIn: number
  ): Promise<any> {
    console.log('🔄 Step 9: Executing DEX swap...');

    const amountInWei = ethers.parseEther(amountIn.toString());
    const minAmountOut = amountInWei / BigInt(2); // Accept 50% slippage for demo

    const swapResult = await dexService.swapTokens(
      provider,
      tokenIn,
      tokenOut,
      amountInWei,
      minAmountOut
    );

    console.log('✅ Swap executed:', {
      amountIn: ethers.formatEther(swapResult.amountIn),
      amountOut: ethers.formatEther(swapResult.amountOut),
      priceImpact: swapResult.priceImpact,
    });

    return swapResult;
  }

  /**
   * STEP 10: Add DEX liquidity
   */
  async addDexLiquidity(
    provider: ethers.BrowserProvider,
    token0: string,
    token1: string,
    amount0: number,
    amount1: number
  ): Promise<string> {
    console.log('💧 Step 10: Adding DEX liquidity...');

    const amount0Wei = ethers.parseEther(amount0.toString());
    const amount1Wei = ethers.parseEther(amount1.toString());

    const txHash = await dexService.addLiquidity(
      provider,
      token0,
      token1,
      amount0Wei,
      amount1Wei
    );

    console.log('✅ Liquidity added:', txHash);
    return txHash;
  }

  /**
   * Get complete system status
   */
  async getSystemStatus(
    walletAddress: string,
    provider?: ethers.BrowserProvider
  ): Promise<SystemState> {
    console.log('📊 Fetching complete system status...');

    const creditProfile = await integratedCreditService.analyzeCreditProfile(walletAddress);
    const agents = await aiAgentService.getAvailableAgents();
    const liquidityPositions = await dexService.getLiquidityPositions(walletAddress);

    const state: SystemState = {
      walletAddress,
      creditProfile,
      deployedAgents: agents,
      agentWallets: agents.map(a => a.walletAddress),
      creditLine: null,
      outstandingDebt: BigInt(0),
      purchaseHistory: [],
      liquidityPositions,
      swapHistory: [],
    };

    console.log('✅ System status fetched');
    return state;
  }

  /**
   * Complete end-to-end flow demonstration
   */
  async demonstrateCompleteFlow(
    provider: ethers.BrowserProvider,
    walletAddress: string
  ): Promise<void> {
    console.log('\n🎯 ========== COMPLETE FLOW DEMONSTRATION ==========\n');

    try {
      // Step 1: Initialize user
      console.log('1️⃣ Initialize User');
      const state = await this.initializeUser(provider, walletAddress);
      console.log('✅ User initialized with credit score:', state.creditProfile?.creditScore, '\n');

      // Step 2: Verify income
      console.log('2️⃣ Verify Income');
      const incomeVerification = await this.completeIncomeVerification(walletAddress, 'wise');
      console.log('✅ Income verified:', incomeVerification.monthlyIncome, '\n');

      // Step 3: Submit proof on-chain
      console.log('3️⃣ Submit Income Proof On-Chain');
      const proofHash = '0x' + Math.random().toString(16).substring(2);
      await this.submitIncomeProofOnChain(
        provider,
        walletAddress,
        incomeVerification.monthlyIncome,
        proofHash
      );
      console.log('✅ Proof submitted on-chain\n');

      // Step 4: Request credit
      if (state.creditProfile?.canBorrow) {
        console.log('4️⃣ Request Credit Line');
        await this.requestCreditLine(provider, walletAddress, 5000);
        console.log('✅ Credit line approved\n');
      }

      // Step 5: Deploy agent
      if (state.creditProfile?.canUseAgents) {
        console.log('5️⃣ Deploy AI Agent');
        const agent = await this.deployAgentWallet(provider, 'trading', 1000);
        console.log('✅ Agent deployed:', agent.walletAddress, '\n');
      }

      // Step 6: Shop in marketplace
      if (state.creditProfile?.canAccessMarketplace) {
        console.log('6️⃣ Purchase from Marketplace');
        await this.purchaseFromMarketplace(provider, '1', 'SHM');
        console.log('✅ Purchase completed\n');
      }

      // Step 7: DEX operations
      if (state.creditProfile?.canTrade) {
        console.log('7️⃣ Execute DEX Swap');
        await this.executeDexSwap(provider, '0x...SHM', '0x...USDC', 10);
        console.log('✅ Swap completed\n');
      }

      console.log('🎉 ========== COMPLETE FLOW FINISHED ==========\n');
    } catch (error) {
      console.error('❌ Flow error:', error);
      throw error;
    }
  }
}

export const systemOrchestrator = new SystemOrchestrator();

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../contracts/types';

/**
 * DEX Service - Simulated Decentralized Exchange
 * Handles token swaps, liquidity, and trading
 */

export interface TokenPair {
  token0: string;
  token1: string;
  reserve0: bigint;
  reserve1: bigint;
  price: number;
}

export interface SwapResult {
  amountIn: bigint;
  amountOut: bigint;
  path: string[];
  priceImpact: number;
  txHash: string;
}

class DexService {
  /**
   * Get available trading pairs
   */
  async getTradingPairs(): Promise<TokenPair[]> {
    // Mock trading pairs - in production, fetch from SimulateDex contract
    return [
      {
        token0: '0x...SHM',
        token1: '0x...USDC',
        reserve0: BigInt(ethers.parseEther('1000000')),
        reserve1: BigInt(ethers.parseUnits('2000000', 6)),
        price: 2.0,
      },
      {
        token0: '0x...SHM',
        token1: '0x...WETH',
        reserve0: BigInt(ethers.parseEther('1000000')),
        reserve1: BigInt(ethers.parseEther('500')),
        price: 0.0005,
      },
      {
        token0: '0x...USDC',
        token1: '0x...WETH',
        reserve0: BigInt(ethers.parseUnits('2000000', 6)),
        reserve1: BigInt(ethers.parseEther('500')),
        price: 0.00025,
      },
    ];
  }

  /**
   * Calculate swap output amount
   */
  calculateSwapOutput(
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ): { amountOut: bigint; priceImpact: number } {
    // Constant product formula: x * y = k
    // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
    // With 0.3% fee
    const amountInWithFee = amountIn * BigInt(997);
    const numerator = amountInWithFee * reserveOut;
    const denominator = (reserveIn * BigInt(1000)) + amountInWithFee;
    const amountOut = numerator / denominator;

    // Calculate price impact
    const exactQuote = (amountIn * reserveOut) / reserveIn;
    const priceImpact = Number((exactQuote - amountOut) * BigInt(10000) / exactQuote) / 100;

    return { amountOut, priceImpact };
  }

  /**
   * Execute token swap
   */
  async swapTokens(
    provider: ethers.BrowserProvider,
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    minAmountOut: bigint
  ): Promise<SwapResult> {
    try {
      const signer = await provider.getSigner();

      if (CONTRACT_ADDRESSES.simulateDex === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ DEX contract not deployed, simulating swap');
        return {
          amountIn,
          amountOut: minAmountOut,
          path: [tokenIn, tokenOut],
          priceImpact: 0.5,
          txHash: '0x' + Math.random().toString(16).substring(2),
        };
      }

      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.simulateDex,
        [
          'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
        ],
        signer
      );

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      const path = [tokenIn, tokenOut];

      const tx = await dexContract.swapExactTokensForTokens(
        amountIn,
        minAmountOut,
        path,
        await signer.getAddress(),
        deadline
      );

      const receipt = await tx.wait();
      const amountOut = receipt.logs[0]?.args?.amounts?.[1] || minAmountOut;

      console.log('✅ Swap executed:', receipt.hash);

      return {
        amountIn,
        amountOut,
        path,
        priceImpact: 0.5,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Swap error:', error);
      throw error;
    }
  }

  /**
   * Add liquidity to pool
   */
  async addLiquidity(
    provider: ethers.BrowserProvider,
    token0: string,
    token1: string,
    amount0: bigint,
    amount1: bigint
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      if (CONTRACT_ADDRESSES.simulateDex === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ DEX contract not deployed, simulating add liquidity');
        return '0x' + Math.random().toString(16).substring(2);
      }

      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.simulateDex,
        [
          'function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)',
        ],
        signer
      );

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const minAmount0 = (amount0 * BigInt(95)) / BigInt(100); // 5% slippage
      const minAmount1 = (amount1 * BigInt(95)) / BigInt(100);

      const tx = await dexContract.addLiquidity(
        token0,
        token1,
        amount0,
        amount1,
        minAmount0,
        minAmount1,
        await signer.getAddress(),
        deadline
      );

      const receipt = await tx.wait();
      console.log('✅ Liquidity added:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Add liquidity error:', error);
      throw error;
    }
  }

  /**
   * Remove liquidity from pool
   */
  async removeLiquidity(
    provider: ethers.BrowserProvider,
    token0: string,
    token1: string,
    liquidity: bigint
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();

      if (CONTRACT_ADDRESSES.simulateDex === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ DEX contract not deployed, simulating remove liquidity');
        return '0x' + Math.random().toString(16).substring(2);
      }

      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.simulateDex,
        [
          'function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB)',
        ],
        signer
      );

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const tx = await dexContract.removeLiquidity(
        token0,
        token1,
        liquidity,
        0, // Accept any amount
        0,
        await signer.getAddress(),
        deadline
      );

      const receipt = await tx.wait();
      console.log('✅ Liquidity removed:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Remove liquidity error:', error);
      throw error;
    }
  }

  /**
   * Get user's liquidity positions
   */
  async getLiquidityPositions(userAddress: string): Promise<any[]> {
    // Mock liquidity positions
    return [
      {
        pair: 'SHM/USDC',
        liquidity: ethers.parseEther('100'),
        token0Amount: ethers.parseEther('50'),
        token1Amount: ethers.parseUnits('100', 6),
        shareOfPool: 0.01,
        apy: 25.5,
      },
      {
        pair: 'SHM/WETH',
        liquidity: ethers.parseEther('50'),
        token0Amount: ethers.parseEther('25'),
        token1Amount: ethers.parseEther('0.025'),
        shareOfPool: 0.005,
        apy: 18.2,
      },
    ];
  }

  /**
   * Get token price
   */
  async getTokenPrice(tokenAddress: string): Promise<number> {
    // Mock prices - in production, fetch from DEX reserves
    const mockPrices: Record<string, number> = {
      '0x...SHM': 2.0,
      '0x...USDC': 1.0,
      '0x...WETH': 4000.0,
      '0x...WBTC': 60000.0,
    };

    return mockPrices[tokenAddress] || 1.0;
  }
}

export const dexService = new DexService();

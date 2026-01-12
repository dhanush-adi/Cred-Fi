import { ethers } from 'ethers';
import { MarketplaceProduct, CONTRACT_ADDRESSES, MARKETPLACE_ABI } from '../contracts/types';

/**
 * Marketplace Service - E-commerce, Food, Shop
 * Access controlled by credit score
 */

export interface MarketplaceOrder {
  orderId: string;
  productId: string;
  buyer: string;
  amount: number;
  paymentMethod: 'SHM' | 'TOKEN';
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  timestamp: number;
}

class MarketplaceService {
  /**
   * Get products from E-commerce store
   */
  async getEcommerceProducts(): Promise<MarketplaceProduct[]> {
    // Mock products - in production, fetch from contract
    return [
      {
        id: '1',
        title: 'Premium Laptop',
        description: 'High-performance laptop for developers',
        priceSHM: BigInt(ethers.parseEther('2.5')),
        priceToken: BigInt(ethers.parseUnits('500', 6)), // 500 USDC
        tokenAddress: '0x...', // USDC address
        seller: '0x...',
        category: 'ecommerce',
        inStock: true,
      },
      {
        id: '2',
        title: 'Wireless Headphones',
        description: 'Noise-cancelling bluetooth headphones',
        priceSHM: BigInt(ethers.parseEther('0.5')),
        priceToken: BigInt(ethers.parseUnits('100', 6)),
        tokenAddress: '0x...',
        seller: '0x...',
        category: 'ecommerce',
        inStock: true,
      },
      {
        id: '3',
        title: 'Smart Watch',
        description: 'Fitness tracking smartwatch',
        priceSHM: BigInt(ethers.parseEther('0.8')),
        priceToken: BigInt(ethers.parseUnits('150', 6)),
        tokenAddress: '0x...',
        seller: '0x...',
        category: 'ecommerce',
        inStock: true,
      },
    ];
  }

  /**
   * Get food products
   */
  async getFoodProducts(): Promise<MarketplaceProduct[]> {
    return [
      {
        id: 'f1',
        title: 'Gourmet Pizza',
        description: 'Fresh Italian pizza with premium toppings',
        priceSHM: BigInt(ethers.parseEther('0.05')),
        priceToken: BigInt(ethers.parseUnits('10', 6)),
        tokenAddress: '0x...',
        seller: '0x...',
        category: 'food',
        inStock: true,
      },
      {
        id: 'f2',
        title: 'Sushi Platter',
        description: '12-piece fresh sushi assortment',
        priceSHM: BigInt(ethers.parseEther('0.08')),
        priceToken: BigInt(ethers.parseUnits('15', 6)),
        tokenAddress: '0x...',
        seller: '0x...',
        category: 'food',
        inStock: true,
      },
      {
        id: 'f3',
        title: 'Burger Combo',
        description: 'Premium burger with fries and drink',
        priceSHM: BigInt(ethers.parseEther('0.03')),
        priceToken: BigInt(ethers.parseUnits('6', 6)),
        tokenAddress: '0x...',
        seller: '0x...',
        category: 'food',
        inStock: true,
      },
    ];
  }

  /**
   * Purchase product with SHM
   */
  async buyWithSHM(
    provider: ethers.BrowserProvider,
    productId: string,
    priceSHM: bigint,
    category: 'ecommerce' | 'food' | 'service'
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();
      
      // Select contract based on category
      const contractAddress = category === 'food' 
        ? CONTRACT_ADDRESSES.foodStore 
        : CONTRACT_ADDRESSES.ecommerceStore;

      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, simulating purchase');
        return '0x' + Math.random().toString(16).substring(2);
      }

      const contract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, signer);

      const tx = await contract.buyWithSHM(productId, {
        value: priceSHM,
      });

      const receipt = await tx.wait();
      console.log('✅ Purchase successful:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }

  /**
   * Purchase product with token (USDC, etc.)
   */
  async buyWithToken(
    provider: ethers.BrowserProvider,
    productId: string,
    tokenAddress: string,
    amount: bigint,
    category: 'ecommerce' | 'food' | 'service'
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();
      
      const contractAddress = category === 'food' 
        ? CONTRACT_ADDRESSES.foodStore 
        : CONTRACT_ADDRESSES.ecommerceStore;

      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, simulating purchase');
        return '0x' + Math.random().toString(16).substring(2);
      }

      // First approve token spending
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) external returns (bool)'],
        signer
      );

      const approveTx = await tokenContract.approve(contractAddress, amount);
      await approveTx.wait();

      // Then purchase
      const contract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, signer);
      const tx = await contract.buyWithToken(productId, tokenAddress, amount);
      const receipt = await tx.wait();

      console.log('✅ Token purchase successful:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Token purchase error:', error);
      throw error;
    }
  }

  /**
   * List new product (for sellers)
   */
  async listProduct(
    provider: ethers.BrowserProvider,
    product: {
      title: string;
      description: string;
      priceSHM: bigint;
      priceToken: bigint;
      tokenAddress: string;
    },
    category: 'ecommerce' | 'food' | 'service'
  ): Promise<string> {
    try {
      const signer = await provider.getSigner();
      
      const contractAddress = category === 'food' 
        ? CONTRACT_ADDRESSES.foodStore 
        : CONTRACT_ADDRESSES.ecommerceStore;

      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ Contract not deployed, simulating listing');
        return Math.random().toString();
      }

      const contract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, signer);

      const tx = await contract.listProduct(
        product.title,
        product.description,
        product.priceSHM,
        product.priceToken,
        product.tokenAddress
      );

      const receipt = await tx.wait();
      
      // Extract product ID from event
      const event = receipt.logs.find((log: any) => log.eventName === 'ProductListed');
      const productId = event?.args?.productId?.toString() || Math.random().toString();

      console.log('✅ Product listed:', productId);
      return productId;
    } catch (error) {
      console.error('Listing error:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();

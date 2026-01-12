import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { marketplaceService, MarketplaceProduct } from '../services/marketplaceService';
import { ethers } from 'ethers';

interface Props {
  provider: ethers.BrowserProvider | null;
  canAccessMarketplace: boolean;
  creditScore: number;
}

export default function MarketplaceScreen({ provider, canAccessMarketplace, creditScore }: Props) {
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'food'>('ecommerce');
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [activeTab]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'food' 
        ? await marketplaceService.getFoodProducts()
        : await marketplaceService.getEcommerceProducts();
      setProducts(data);
    } catch (error) {
      console.error('Load products error:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: MarketplaceProduct, paymentMethod: 'SHM' | 'TOKEN') => {
    if (!provider) {
      Alert.alert('Error', 'Please connect your wallet');
      return;
    }

    if (!canAccessMarketplace) {
      Alert.alert(
        'Access Denied',
        `Marketplace requires credit score ≥30. Your score: ${creditScore}`
      );
      return;
    }

    setPurchasing(product.id);
    try {
      let txHash: string;
      
      if (paymentMethod === 'SHM') {
        txHash = await marketplaceService.buyWithSHM(
          provider,
          product.id,
          product.priceSHM,
          product.category as any
        );
      } else {
        txHash = await marketplaceService.buyWithToken(
          provider,
          product.id,
          product.tokenAddress,
          product.priceToken,
          product.category as any
        );
      }

      Alert.alert(
        'Purchase Successful! 🎉',
        `Transaction: ${txHash.substring(0, 10)}...`,
        [{ text: 'OK', onPress: loadProducts }]
      );
    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Failed', error.message || 'Transaction failed');
    } finally {
      setPurchasing(null);
    }
  };

  const renderProduct = (product: MarketplaceProduct) => {
    const priceSHMFormatted = ethers.formatEther(product.priceSHM);
    const priceTokenFormatted = ethers.formatUnits(product.priceToken, 6);

    return (
      <View key={product.id} style={styles.productCard}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>
            {product.category === 'food' ? '🍕' : '📦'}
          </Text>
        </View>
        
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>SHM:</Text>
            <Text style={styles.priceValue}>{priceSHMFormatted}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>USDC:</Text>
            <Text style={styles.priceValue}>{priceTokenFormatted}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buyButton, styles.buyButtonSHM]}
            onPress={() => handlePurchase(product, 'SHM')}
            disabled={purchasing === product.id || !canAccessMarketplace}
          >
            {purchasing === product.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buyButtonText}>Pay SHM</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buyButton, styles.buyButtonToken]}
            onPress={() => handlePurchase(product, 'TOKEN')}
            disabled={purchasing === product.id || !canAccessMarketplace}
          >
            {purchasing === product.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buyButtonText}>Pay USDC</Text>
            )}
          </TouchableOpacity>
        </View>

        {!product.inStock && (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    );
  };

  if (!canAccessMarketplace) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedEmoji}>🔒</Text>
          <Text style={styles.accessDeniedTitle}>Marketplace Locked</Text>
          <Text style={styles.accessDeniedText}>
            Credit score ≥30 required to access marketplace
          </Text>
          <Text style={styles.accessDeniedScore}>Your score: {creditScore}</Text>
          <Text style={styles.accessDeniedHint}>
            Complete income verification to boost your score
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Marketplace</Text>
        <Text style={styles.subtitle}>Shop with SHM or USDC</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ecommerce' && styles.tabActive]}
          onPress={() => setActiveTab('ecommerce')}
        >
          <Text style={[styles.tabText, activeTab === 'ecommerce' && styles.tabTextActive]}>
            🛒 E-Commerce
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'food' && styles.tabActive]}
          onPress={() => setActiveTab('food')}
        >
          <Text style={[styles.tabText, activeTab === 'food' && styles.tabTextActive]}>
            🍔 Food
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map(renderProduct)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#1a1a3e',
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d5f',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#2d2d5f',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productEmoji: {
    fontSize: 48,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2d2d5f',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonSHM: {
    backgroundColor: '#6366f1',
  },
  buyButtonToken: {
    backgroundColor: '#10b981',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  outOfStock: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  accessDeniedEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 10,
  },
  accessDeniedScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
  },
  accessDeniedHint: {
    fontSize: 14,
    color: '#6366f1',
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { ethers } from 'ethers';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from './src/theme/colors';
import { NETWORK_CONFIG } from './src/config/network';
import { SimpleLandingScreen } from './src/screens/SimpleLandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreditScreen } from './src/screens/CreditScreen';
import { AgentsScreen } from './src/screens/AgentsScreen';
import { EarnScreen } from './src/screens/EarnScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { SendScreen } from './src/screens/SendScreen';
import { FXPayScreen } from './src/screens/FXPayScreen';

const isWeb = Platform.OS === 'web';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function AppSimpleComplete() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showFXPayModal, setShowFXPayModal] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectMetaMask = async () => {
    if (!isWeb) {
      alert('MetaMask is only available on web. Please use a web browser.');
      return;
    }

    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask extension.');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🔗 Connecting to MetaMask...');

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      
      console.log('✅ Connected:', address);
      
      // Check if on Shardeum network
      const network = await browserProvider.getNetwork();
      const chainId = Number(network.chainId);
      
      console.log('🌐 Current network:', chainId);
      
      // Switch to Shardeum if needed
      if (chainId !== NETWORK_CONFIG.chainId) {
        console.log('🔄 Switching to Shardeum...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            console.log('➕ Adding Shardeum network...');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                  chainName: NETWORK_CONFIG.name,
                  nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                  rpcUrls: [NETWORK_CONFIG.rpcUrl],
                  blockExplorerUrls: [NETWORK_CONFIG.explorerUrl],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Get balance
      const balanceWei = await browserProvider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      const balanceFormatted = parseFloat(balanceEth).toFixed(4);
      
      setProvider(browserProvider);
      setWalletAddress(address);
      setBalance(balanceFormatted);
      setShowLanding(false);
      
      console.log('💰 Balance:', balanceFormatted, NETWORK_CONFIG.nativeCurrency.symbol);
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      alert(`Failed to connect: ${error.message || 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setBalance('0.00');
    setProvider(null);
    setShowLanding(true);
    setActiveTab('Home');
  };

  const handleLaunchApp = () => {
    if (!walletAddress) {
      connectMetaMask();
    } else {
      setShowLanding(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (isWeb && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          handleDisconnect();
        } else if (accounts[0] !== walletAddress) {
          // User switched accounts
          setWalletAddress(accounts[0]);
          // Refresh balance
          if (provider) {
            provider.getBalance(accounts[0]).then((bal) => {
              const balanceEth = ethers.formatEther(bal);
              setBalance(parseFloat(balanceEth).toFixed(4));
            });
          }
        }
      };

      const handleChainChanged = () => {
        // Reload page when network changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [walletAddress, provider]);

  if (showLanding) {
    return <SimpleLandingScreen onLaunchApp={handleLaunchApp} />;
  }

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            walletAddress={walletAddress}
            balance={balance}
            onSendClick={() => setShowSendModal(true)}
            onFXPayClick={() => setShowFXPayModal(true)}
          />
        );
      case 'Credit':
        return <CreditScreen walletAddress={walletAddress} />;
      case 'Agents':
        return <AgentsScreen />;
      case 'Earn':
        return <EarnScreen walletAddress={walletAddress} />;
      case 'More':
        return <MoreScreen walletAddress={walletAddress} onDisconnect={handleDisconnect} />;
      default:
        return (
          <HomeScreen
            walletAddress={walletAddress}
            balance={balance}
            onSendClick={() => setShowSendModal(true)}
            onFXPayClick={() => setShowFXPayModal(true)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Cred</Text>
          <Text style={styles.subtitle}>powered by Shardeum</Text>
        </View>
        
        {walletAddress ? (
          <View style={styles.walletInfo}>
            <View style={styles.walletBadge}>
              <View style={styles.connectedDot} />
              <Text style={styles.walletText}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
            </View>
            <Text style={styles.balanceText}>{balance} SHM</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={connectMetaMask}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="wallet-outline" size={18} color="#fff" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TabButton
          icon="home"
          label="Home"
          active={activeTab === 'Home'}
          onPress={() => setActiveTab('Home')}
        />
        <TabButton
          icon="card"
          label="Credit"
          active={activeTab === 'Credit'}
          onPress={() => setActiveTab('Credit')}
        />
        <TabButton
          icon="people"
          label="Agents"
          active={activeTab === 'Agents'}
          onPress={() => setActiveTab('Agents')}
        />
        <TabButton
          icon="trending-up"
          label="Earn"
          active={activeTab === 'Earn'}
          onPress={() => setActiveTab('Earn')}
        />
        <TabButton
          icon="ellipsis-horizontal"
          label="More"
          active={activeTab === 'More'}
          onPress={() => setActiveTab('More')}
        />
      </View>

      {/* Modals */}
      {showSendModal && (
        <SendScreen
          walletAddress={walletAddress}
          onClose={() => setShowSendModal(false)}
        />
      )}
      
      {showFXPayModal && (
        <FXPayScreen
          walletAddress={walletAddress}
          onClose={() => setShowFXPayModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

// Tab Button Component
const TabButton = ({ icon, label, active, onPress }: { icon: any; label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={styles.tabButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons
      name={active ? icon : `${icon}-outline`}
      size={24}
      color={active ? COLORS.primary : COLORS.textSecondary}
    />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  walletInfo: {
    alignItems: 'flex-end',
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  walletText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  balanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { ethers } from 'ethers';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from './src/theme/colors';
import { NETWORK_CONFIG } from './src/config/network';
import { SimpleLandingScreen } from './src/screens/SimpleLandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EnhancedCreditScreen } from './src/screens/EnhancedCreditScreen';
import AgentsScreenNew from './src/screens/AgentsScreenNew';
import { EarnScreen } from './src/screens/EarnScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import ContractDemoScreen from './src/screens/ContractDemoScreen';
import { SendScreen } from './src/screens/SendScreen';
import { FXPayScreen } from './src/screens/FXPayScreen';
import { integratedCreditService, UserCreditProfile } from './src/services/integratedCreditService';

const isWeb = Platform.OS === 'web';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function AppIntegrated() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showFXPayModal, setShowFXPayModal] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  
  // Credit profile state
  const [creditProfile, setCreditProfile] = useState<UserCreditProfile | null>(null);
  const [analyzingCredit, setAnalyzingCredit] = useState(false);

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
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      
      console.log('✅ Connected:', address);
      
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
      let balanceFormatted = '0.00';
      try {
        const balanceWei = await browserProvider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        balanceFormatted = parseFloat(balanceEth).toFixed(4);
        console.log('💰 Balance:', balanceFormatted, NETWORK_CONFIG.nativeCurrency.symbol);
      } catch (balanceError) {
        console.warn('⚠️ Could not fetch balance, continuing anyway:', balanceError);
      }
      
      setProvider(browserProvider);
      setWalletAddress(address);
      setBalance(balanceFormatted);
      
      // Auto-analyze credit on connect
      setTimeout(() => {
        analyzeCreditProfile(address);
      }, 1000);
      
      setShowLanding(false);
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      alert(`Failed to connect: ${error.message || 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const analyzeCreditProfile = async (address: string) => {
    if (!address) return;
    
    setAnalyzingCredit(true);
    try {
      console.log('🔍 Analyzing credit profile...');
      const profile = await integratedCreditService.analyzeCreditProfile(address);
      setCreditProfile(profile);
      console.log('✅ Credit profile:', profile);
    } catch (error) {
      console.error('❌ Credit analysis error:', error);
    } finally {
      setAnalyzingCredit(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setBalance('0.00');
    setProvider(null);
    setCreditProfile(null);
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
          handleDisconnect();
        } else if (accounts[0] !== walletAddress) {
          setWalletAddress(accounts[0]);
          analyzeCreditProfile(accounts[0]);
          if (provider) {
            provider.getBalance(accounts[0])
              .then((bal) => {
                const balanceEth = ethers.formatEther(bal);
                setBalance(parseFloat(balanceEth).toFixed(4));
              })
              .catch((err) => {
                console.warn('⚠️ Could not refresh balance:', err);
                setBalance('0.00');
              });
          }
        }
      };

      const handleChainChanged = () => {
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

  // Show credit analysis loading if still analyzing
  if (analyzingCredit && !creditProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Analyzing your credit profile...</Text>
        <Text style={styles.loadingSubtext}>Using vlayer + Vouch verification</Text>
      </View>
    );
  }

  // Render active screen with credit profile
  const renderScreen = () => {
    const creditScore = creditProfile?.creditScore || 0;
    const canBorrow = creditProfile?.canBorrow || false;
    const canUseAgents = creditProfile?.canUseAgents || false;
    const canAccessMarketplace = creditProfile?.canAccessMarketplace || false;

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
        return (
          <EnhancedCreditScreen 
            walletAddress={walletAddress} 
            onCreditUpdated={(newProfile) => setCreditProfile(newProfile)}
          />
        );
      case 'Agents':
        return (
          <AgentsScreenNew
            provider={provider}
            walletAddress={walletAddress || ''}
            canUseAgents={canUseAgents}
            creditScore={creditScore}
          />
        );
      case 'Marketplace':
        return (
          <MarketplaceScreen
            provider={provider}
            canAccessMarketplace={canAccessMarketplace}
            creditScore={creditScore}
          />
        );
      case 'Earn':
        return <EarnScreen walletAddress={walletAddress} />;
      case 'Demo':
        return (
          <ContractDemoScreen
            provider={provider}
            walletAddress={walletAddress || ''}
            creditScore={creditScore}
          />
        );
      case 'More':
        return <MoreScreen walletAddress={walletAddress} onDisconnect={handleDisconnect} />;
      default:
        return null;
    }
  };

  // Tab bar with credit-based indicators
  const getTabIcon = (tab: string) => {
    const creditScore = creditProfile?.creditScore || 0;
    
    switch (tab) {
      case 'Home':
        return 'home';
      case 'Credit':
        return 'analytics';
      case 'Agents':
        return creditProfile?.canUseAgents ? 'flash' : 'lock-closed';
      case 'Marketplace':
        return creditProfile?.canAccessMarketplace ? 'cart' : 'lock-closed';
      case 'Earn':
        return 'trending-up';
      case 'Demo':
        return 'flask';
      case 'More':
        return 'menu';
      default:
        return 'home';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header with credit score badge */}
      {creditProfile && (
        <View style={styles.creditBadgeHeader}>
          <Text style={styles.creditBadgeLabel}>Credit Score</Text>
          <View style={[
            styles.creditScoreBadge,
            { backgroundColor: creditProfile.creditScore >= 60 ? '#10b981' : creditProfile.creditScore >= 40 ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.creditScoreText}>{creditProfile.creditScore}</Text>
          </View>
          <Text style={styles.creditTierText}>{creditProfile.riskTier}</Text>
        </View>
      )}

      <View style={styles.container}>
        {renderScreen()}

        {/* Send Modal */}
        {showSendModal && (
          <SendScreen
            provider={provider}
            walletAddress={walletAddress}
            balance={balance}
            onClose={() => setShowSendModal(false)}
          />
        )}

        {/* FXPay Modal */}
        {showFXPayModal && (
          <FXPayScreen
            provider={provider}
            walletAddress={walletAddress}
            balance={balance}
            onClose={() => setShowFXPayModal(false)}
          />
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {['Home', 'Credit', 'Agents', 'Marketplace', 'Demo', 'More'].map((tab) => {
            const isActive = activeTab === tab;
            const isLocked = 
              (tab === 'Agents' && !creditProfile?.canUseAgents) ||
              (tab === 'Marketplace' && !creditProfile?.canAccessMarketplace);
            
            return (
              <TouchableOpacity
                key={tab}
                style={styles.navItem}
                onPress={() => setActiveTab(tab)}
              >
                <Ionicons
                  name={getTabIcon(tab) as any}
                  size={24}
                  color={isActive ? COLORS.primary : isLocked ? '#ef4444' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.navLabel,
                    isActive && styles.navLabelActive,
                    isLocked && styles.navLabelLocked,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  creditBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a3e',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d5f',
  },
  creditBadgeLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginRight: 8,
  },
  creditScoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  creditScoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditTierText: {
    color: '#9ca3af',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  loadingSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1a1a3e',
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#2d2d5f',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  navLabelLocked: {
    color: '#ef4444',
  },
});

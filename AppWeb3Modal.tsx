import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform, Alert } from 'react-native';
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { BrowserProvider, formatEther } from 'ethers';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from './src/theme/colors';
import { SimpleLandingScreen } from './src/screens/SimpleLandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EnhancedCreditScreen } from './src/screens/EnhancedCreditScreen';
import { AgentsScreen } from './src/screens/AgentsScreen';
import { EarnScreen } from './src/screens/EarnScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { SendScreen } from './src/screens/SendScreen';
import { FXPayScreen } from './src/screens/FXPayScreen';
import './src/config/walletConfig'; // Initialize Web3Modal

const isWeb = Platform.OS === 'web';

export default function AppWeb3Modal() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [balance, setBalance] = useState<string>('0.00');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showFXPayModal, setShowFXPayModal] = useState(false);
  const [additionalWallets, setAdditionalWallets] = useState<string[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Web3Modal hooks
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Fetch balance when wallet connects
  useEffect(() => {
    if (isConnected && address && walletProvider) {
      fetchBalance();
      setShowLanding(false);
    }
  }, [isConnected, address, walletProvider, chainId]);

  const fetchBalance = async () => {
    if (!walletProvider || !address) return;

    try {
      setIsLoadingBalance(true);
      const provider = new BrowserProvider(walletProvider);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = formatEther(balanceWei);
      const balanceFormatted = parseFloat(balanceEth).toFixed(4);
      setBalance(balanceFormatted);
      console.log('💰 Balance updated:', balanceFormatted, 'SHM');
    } catch (error) {
      console.warn('⚠️ Balance fetch error:', error);
      setBalance('0.00');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await open();
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Error', 'Failed to open wallet selector');
    }
  };

  const handleAddWallet = async () => {
    try {
      Alert.alert(
        'Add Additional Wallet',
        'This will allow you to connect multiple wallets for better credit analysis',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Connect',
            onPress: async () => {
              await open();
              // After connection, the new address will be in the account
              if (address && !additionalWallets.includes(address)) {
                setAdditionalWallets([...additionalWallets, address]);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Add wallet error:', error);
    }
  };

  const handleDisconnect = () => {
    setShowLanding(true);
    setActiveTab('Home');
    setBalance('0.00');
    setAdditionalWallets([]);
  };

  const handleLaunchApp = () => {
    if (!isConnected) {
      handleConnectWallet();
    } else {
      setShowLanding(false);
    }
  };

  if (showLanding) {
    return <SimpleLandingScreen onLaunchApp={handleLaunchApp} />;
  }

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            walletAddress={address || null}
            balance={balance}
            onSendClick={() => setShowSendModal(true)}
            onFXPayClick={() => setShowFXPayModal(true)}
          />
        );
      case 'Credit':
        return (
          <EnhancedCreditScreen
            walletAddress={address || null}
            additionalWallets={additionalWallets}
            onAddWallet={handleAddWallet}
          />
        );
      case 'Agents':
        return <AgentsScreen />;
      case 'Earn':
        return <EarnScreen walletAddress={address || null} />;
      case 'More':
        return <MoreScreen walletAddress={address || null} onDisconnect={handleDisconnect} />;
      default:
        return (
          <HomeScreen
            walletAddress={address || null}
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
        
        {isConnected && address ? (
          <View style={styles.walletInfo}>
            <TouchableOpacity
              style={styles.walletBadge}
              onPress={handleConnectWallet}
              activeOpacity={0.7}
            >
              <View style={styles.connectedDot} />
              <Text style={styles.walletText}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>
                {isLoadingBalance ? '...' : balance} SHM
              </Text>
              {additionalWallets.length > 0 && (
                <View style={styles.multiWalletBadge}>
                  <Ionicons name="wallet" size={12} color={COLORS.primary} />
                  <Text style={styles.multiWalletText}>+{additionalWallets.length}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnectWallet}
            activeOpacity={0.7}
          >
            <Ionicons name="wallet-outline" size={18} color="#fff" />
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
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
          badge={additionalWallets.length > 0 ? additionalWallets.length : undefined}
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
          walletAddress={address || null}
          onClose={() => setShowSendModal(false)}
        />
      )}
      
      {showFXPayModal && (
        <FXPayScreen
          walletAddress={address || null}
          onClose={() => setShowFXPayModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

// Tab Button Component
const TabButton = ({
  icon,
  label,
  active,
  badge,
  onPress,
}: {
  icon: any;
  label: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.7}>
    <View>
      <Ionicons
        name={active ? icon : `${icon}-outline`}
        size={24}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
      {badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
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
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  balanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  multiWalletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  multiWalletText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
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
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { SimpleLandingScreen } from './src/screens/SimpleLandingScreen';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from './src/theme/colors';
import { NETWORK_CONFIG, DISPLAY_CONFIG } from './src/config/network';

const isWeb = Platform.OS === 'web';

// Simple wallet analysis component
interface WalletAnalysisProps {
  walletAddress: string;
  onBack: () => void;
}

const WalletAnalysis: React.FC<WalletAnalysisProps> = ({ walletAddress, onBack }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeWallet();
  }, [walletAddress]);

  const analyzeWallet = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      console.log('🔍 Analyzing wallet:', walletAddress);

      // Call backend API with full URL
      const backendUrl = 'http://localhost:3001/api/vlayer/analyze-wallet';
      console.log('📡 Calling backend:', backendUrl);

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ walletAddress }),
      });

      console.log('📥 Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check backend server.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to analyze wallet');
      }

      const data = await response.json();
      console.log('✅ Analysis complete:', data);
      
      // Validate response data
      if (!data.creditScore || !data.lendingCapacity) {
        throw new Error('Invalid analysis data received');
      }
      
      setAnalysis(data);

    } catch (err: any) {
      console.error('❌ Analysis error:', err);
      let errorMessage = err.message || 'Failed to analyze wallet';
      
      // Provide helpful error messages
      if (errorMessage.includes('Failed to fetch') || err.name === 'TypeError') {
        errorMessage = 'Cannot connect to backend server.\n\nMake sure it\'s running:\n  Terminal 1: npm run server\n  Terminal 2: npm run web:simple';
      } else if (errorMessage.includes('non-JSON')) {
        errorMessage = 'Backend server error. Please restart the server with: npm run server';
      }
      
      setError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet Analysis</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Connected Wallet</Text>
          <Text style={styles.walletAddress}>
            {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
          </Text>
        </View>

        {analyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing wallet with vlayer...</Text>
            <Text style={styles.loadingSubtext}>
              • Fetching transaction history{'\n'}
              • Calculating credit score{'\n'}
              • Generating ZK proof{'\n'}
              • Determining lending capacity
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={analyzeWallet} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry Analysis</Text>
            </TouchableOpacity>
          </View>
        )}

        {analysis && !analyzing && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultCard}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
              <Text style={styles.resultTitle}>Credit Analysis Complete</Text>
              
              {/* Credit Score */}
              <View style={styles.creditScoreContainer}>
                <Text style={styles.creditScoreLabel}>Credit Score</Text>
                <Text style={styles.creditScoreValue}>{analysis.creditScore}/100</Text>
                <View style={styles.riskBadge}>
                  <Text style={styles.riskBadgeText}>{analysis.riskTier}</Text>
                </View>
              </View>

              {/* Lending Capacity */}
              <View style={styles.lendingCard}>
                <Text style={styles.lendingLabel}>💰 Lending Capacity</Text>
                <Text style={styles.lendingValue}>${analysis.lendingCapacity}</Text>
                <Text style={styles.lendingSubtext}>
                  Interest Rate: {analysis.interestRate}% APR
                </Text>
              </View>
              
              {/* Stats Container */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Network</Text>
                  <Text style={styles.statValue}>{analysis.network}</Text>
                </View>

                {analysis.dataSource === 'mock' && (
                  <View style={styles.demoNotice}>
                    <Text style={styles.demoNoticeText}>
                      ℹ️ Using demo data (Shardeum RPC unavailable)
                    </Text>
                  </View>
                )}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Transactions</Text>
                  <Text style={styles.statValue}>{analysis.totalTransactions || 0}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Balance</Text>
                  <Text style={styles.statValue}>
                    {parseFloat(analysis.balance || 0).toFixed(4)} SHM
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Balance (USD)</Text>
                  <Text style={styles.statValue}>${analysis.balanceUSD || '0.00'}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Activity Score</Text>
                  <Text style={styles.statValue}>{analysis.activityScore}/100</Text>
                </View>
              </View>

              {/* ZK Proof Section */}
              {analysis.proof && (
                <View style={styles.proofSection}>
                  <Text style={styles.proofLabel}>
                    🔐 {analysis.proofVerified ? 'vlayer' : 'Hash-based'} Proof Generated
                  </Text>
                  <Text style={styles.proofHash}>
                    {analysis.proof.substring(0, 20)}...{analysis.proof.substring(analysis.proof.length - 10)}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.borrowButton}>
                  <Text style={styles.borrowButtonText}>Borrow Funds</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Main App Component
function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    if (!isWeb) return false;
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect MetaMask
  const connectMetaMask = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        alert('Please install MetaMask to continue');
        return;
      }

      setConnecting(true);
      console.log('🔌 Connecting to MetaMask...');

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      console.log('✅ Connected:', address);

      // Switch to Shardeum network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1F92' }], // 8082 in hex
        });
        console.log('✅ Switched to Shardeum network');
      } catch (switchError: any) {
        // Network not added, try to add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x1F92',
                chainName: 'Shardeum Sphinx 1.X',
                nativeCurrency: {
                  name: 'Shardeum',
                  symbol: 'SHM',
                  decimals: 18
                },
                rpcUrls: ['https://sphinx.shardeum.org/'],
                blockExplorerUrls: ['https://explorer-sphinx.shardeum.org']
              }]
            });
            console.log('✅ Added Shardeum network');
          } catch (addError) {
            console.error('Failed to add Shardeum network:', addError);
          }
        }
      }

      setWalletAddress(address);
      setShowLanding(false);

    } catch (error: any) {
      console.error('❌ Connection failed:', error);
      alert(error.message || 'Failed to connect MetaMask');
    } finally {
      setConnecting(false);
    }
  };

  // Handle launch from landing screen
  const handleLaunch = () => {
    if (isWeb) {
      connectMetaMask();
    } else {
      alert('Please use a web browser to connect MetaMask');
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    setWalletAddress(null);
    setShowLanding(true);
  };

  // Show landing screen
  if (showLanding) {
    return (
      <View style={{ flex: 1 }}>
        <SimpleLandingScreen onLaunchApp={handleLaunch} />
        {connecting && (
          <View style={styles.connectingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.connectingText}>Connecting MetaMask...</Text>
          </View>
        )}
      </View>
    );
  }

  // Show wallet analysis
  if (walletAddress) {
    return <WalletAnalysis walletAddress={walletAddress} onBack={handleDisconnect} />;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  walletCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  walletAddress: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  loadingSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  retryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  creditScoreContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  creditScoreLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  creditScoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  riskBadge: {
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  riskBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  lendingCard: {
    width: '100%',
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  lendingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  lendingValue: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: SPACING.xs,
  },
  lendingSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    width: '100%',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  proofSection: {
    width: '100%',
    backgroundColor: `${COLORS.success}15`,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  proofLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  proofHash: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  actionButtons: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  borrowButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  borrowButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  demoNotice: {
    width: '100%',
    backgroundColor: `${COLORS.accent}20`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: SPACING.sm,
  },
  demoNoticeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  connectingText: {
    fontSize: FONT_SIZES.lg,
    color: '#fff',
    fontWeight: '600',
  },
});

export default App;

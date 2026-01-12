import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../theme/colors';
import { vouchService, VouchVerificationResult, CreditAnalysis } from '../services/vouchService';

interface EnhancedCreditScreenProps {
  walletAddress: string | null;
}

export const EnhancedCreditScreen = ({
  walletAddress,
}: EnhancedCreditScreenProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CreditAnalysis | null>(null);
  const [vouchVerification, setVouchVerification] = useState<VouchVerificationResult | null>(null);
  const [showVouchOptions, setShowVouchOptions] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      performAnalysis();
    }
  }, [walletAddress]);

  const performAnalysis = async () => {
    if (!walletAddress) return;

    try {
      setIsAnalyzing(true);
      const result = await vouchService.comprehensiveCreditAnalysis(walletAddress);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Error', 'Failed to analyze credit. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVouchVerification = async (provider: 'wise' | 'binance' | 'stripe' | 'paypal') => {
    if (!walletAddress) return;

    try {
      setShowVouchOptions(false);
      Alert.alert(
        'Income Verification',
        `Opening ${provider} verification with Vouch...`,
        [{ text: 'OK' }]
      );

      const { requestId, redirectUrl } = await vouchService.initiateVouchVerification(
        walletAddress,
        provider
      );

      // Open verification URL
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(redirectUrl, '_blank');
      } else {
        Alert.alert('Verification Link', redirectUrl);
      }

      // Poll for verification result
      const pollInterval = setInterval(async () => {
        const result = await vouchService.checkVouchStatus(requestId);
        if (result && result.verified) {
          clearInterval(pollInterval);
          setVouchVerification(result);
          performAnalysis(); // Re-analyze with Vouch data
          Alert.alert('Verification Complete', `Verified monthly income: $${result.monthlyIncome}`);
        }
      }, 5000);

      // Stop polling after 5 minutes
      setTimeout(() => clearInterval(pollInterval), 300000);
    } catch (error) {
      console.error('Vouch verification error:', error);
      Alert.alert('Verification Error', 'Failed to initiate verification');
    }
  };

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return '#10B981';
      case 'good':
        return '#3B82F6';
      case 'fair':
        return '#F59E0B';
      case 'building':
        return '#EF4444';
      default:
        return COLORS.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!walletAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Connect Wallet</Text>
          <Text style={styles.emptyText}>Connect your wallet to view credit analysis</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Credit Score Card */}
      {isAnalyzing ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Analyzing credit profile...</Text>
          <Text style={styles.loadingSubtext}>
            Checking on-chain activity, balances, and verification status
          </Text>
        </View>
      ) : analysis ? (
        <>
          {/* Main Credit Score */}
          <LinearGradient
            colors={['#9333EA', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scoreCard}
          >
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>Credit Score</Text>
              <View style={[styles.tierBadge, { backgroundColor: getRiskColor(analysis.riskTier) }]}>
                <Text style={styles.tierText}>{analysis.riskTier.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.scoreValue}>{analysis.creditScore}</Text>
            <Text style={styles.scoreMax}>/ 100</Text>
            
            <View style={styles.scoreDetails}>
              <View style={styles.scoreDetail}>
                <Text style={styles.scoreDetailLabel}>Max Borrow</Text>
                <Text style={styles.scoreDetailValue}>{formatCurrency(analysis.maxBorrowAmount)}</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreDetail}>
                <Text style={styles.scoreDetailLabel}>APR</Text>
                <Text style={styles.scoreDetailValue}>{analysis.interestRate}%</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreDetail}>
                <Text style={styles.scoreDetailLabel}>Collateral</Text>
                <Text style={styles.scoreDetailValue}>{analysis.collateralRatio}%</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Credit Factors */}
          <View style={styles.factorsCard}>
            <Text style={styles.sectionTitle}>Score Breakdown</Text>
            {Object.entries(analysis.factors)
              .filter(([key]) => key !== 'multiWalletScore') // Remove multi-wallet factor
              .map(([key, value]) => (
              <View key={key} style={styles.factorRow}>
                <Text style={styles.factorLabel}>{formatFactorName(key)}</Text>
                <View style={styles.factorBar}>
                  <View style={[styles.factorProgress, { width: `${value}%` }]} />
                </View>
                <Text style={styles.factorValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Vouch Verification */}
          {analysis.vouchVerification ? (
            <View style={styles.vouchCard}>
              <View style={styles.vouchHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.vouchTitle}>Income Verified</Text>
              </View>
              <Text style={styles.vouchProvider}>
                Via {analysis.vouchVerification.provider.toUpperCase()}
              </Text>
              <Text style={styles.vouchIncome}>
                Monthly Income: {formatCurrency(analysis.vouchVerification.monthlyIncome)}
              </Text>
              <Text style={styles.vouchDate}>
                Verified: {new Date(analysis.vouchVerification.verificationDate).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => setShowVouchOptions(true)}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.verifyGradient}
              >
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
                <Text style={styles.verifyButtonText}>Verify Income with Vouch</Text>
                <Text style={styles.verifyButtonSubtext}>
                  +20 score boost
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {analysis.recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recommendationRow}>
                  <Ionicons name="bulb-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity style={styles.analyzeButton} onPress={performAnalysis}>
          <LinearGradient
            colors={['#9333EA', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyzeGradient}
          >
            <Ionicons name="analytics-outline" size={20} color="#fff" />
            <Text style={styles.analyzeButtonText}>Analyze Credit</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Vouch Provider Options Modal */}
      {showVouchOptions && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Income Source</Text>
            <TouchableOpacity
              style={styles.providerButton}
              onPress={() => handleVouchVerification('wise')}
            >
              <Text style={styles.providerText}>Wise (TransferWise)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.providerButton}
              onPress={() => handleVouchVerification('binance')}
            >
              <Text style={styles.providerText}>Binance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.providerButton}
              onPress={() => handleVouchVerification('stripe')}
            >
              <Text style={styles.providerText}>Stripe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.providerButton}
              onPress={() => handleVouchVerification('paypal')}
            >
              <Text style={styles.providerText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowVouchOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const formatFactorName = (key: string): string => {
  const names: Record<string, string> = {
    onChainActivity: 'On-Chain Activity',
    walletBalance: 'Wallet Balance',
    incomeVerification: 'Income Verification',
    transactionHistory: 'Transaction History',
    multiWalletScore: 'Multi-Wallet Score',
  };
  return names[key] || key;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  multiWalletCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  multiWalletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  multiWalletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  multiWalletText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginLeft: 28,
    marginTop: 4,
  },
  addWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addWalletText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  loadingSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  scoreCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 72,
  },
  scoreMax: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.lg,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  scoreDetail: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scoreDetailLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  scoreDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  factorsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 12,
  },
  factorLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  factorBar: {
    flex: 2,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  factorProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  factorValue: {
    width: 32,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
  },
  vouchCard: {
    backgroundColor: '#10B981' + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#10B981' + '40',
  },
  vouchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vouchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  vouchProvider: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  vouchIncome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  vouchDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  verifyButton: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  verifyGradient: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  verifyButtonSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  recommendationsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: SPACING.sm,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  analyzeButton: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  analyzeGradient: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  providerButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  providerText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

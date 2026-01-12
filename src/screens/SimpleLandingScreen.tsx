import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONTS, GRADIENTS, ANIMATION } from '../theme/colors';

interface SimpleLandingScreenProps {
  onLaunchApp: () => void;
}

export const SimpleLandingScreen: React.FC<SimpleLandingScreenProps> = ({ onLaunchApp }) => {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <AnimatedBackground />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim1 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.logoGradient}>
                <Text style={styles.logoText}>C</Text>
              </LinearGradient>
            </View>
            <Text style={styles.appName}>CRED</Text>
          </View>
        </Animated.View>

        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.hero,
            {
              opacity: fadeAnim2,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
            <Text style={styles.badgeText}>Powered by vlayer ZK Proofs</Text>
          </View>

          <Text style={styles.heroTitle}>
            Verify Your Wallet{'\n'}
            <Text style={styles.heroTitleAccent}>Activity</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Connect your MetaMask wallet to Shardeum network and get instant 
            zero-knowledge credit analysis using vlayer technology.
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View style={[styles.features, { opacity: fadeAnim3 }]}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Privacy First</Text>
            <Text style={styles.featureDescription}>
              Your data stays private with zero-knowledge proofs
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash-outline" size={28} color={COLORS.accent} />
            </View>
            <Text style={styles.featureTitle}>Instant Analysis</Text>
            <Text style={styles.featureDescription}>
              Get real-time insights about your wallet activity
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="git-network-outline" size={28} color={COLORS.success} />
            </View>
            <Text style={styles.featureTitle}>On-Chain Verified</Text>
            <Text style={styles.featureDescription}>
              All proofs are verified on the blockchain
            </Text>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim3 }]}>
          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={onLaunchApp}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="wallet-outline" size={24} color={COLORS.textDark} />
              <Text style={styles.ctaButtonText}>Connect MetaMask</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.textDark} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By connecting, you agree to our privacy-first approach. 
            No personal data is stored.
          </Text>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by vlayer • Shardeum Network
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  logoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.heading,
  },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl * 2,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xl,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    marginBottom: SPACING.lg,
    lineHeight: 56,
  },
  heroTitleAccent: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 600,
  },
  features: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  featureCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 280,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  featureTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.heading,
  },
  featureDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaSection: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  ctaButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: FONTS.heading,
  },
  disclaimer: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    maxWidth: 400,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

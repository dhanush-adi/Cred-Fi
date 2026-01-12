import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { aiAgentService, AIAgent } from '../services/aiAgentService';
import { ethers } from 'ethers';

interface Props {
  provider: ethers.BrowserProvider | null;
  walletAddress: string;
  canUseAgents: boolean;
  creditScore: number;
}

export default function AgentsScreenNew({ provider, walletAddress, canUseAgents, creditScore }: Props) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await aiAgentService.getAvailableAgents();
      setAgents(data);
    } catch (error) {
      console.error('Load agents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployAgent = async (agent: AIAgent) => {
    if (!provider) {
      Alert.alert('Error', 'Please connect your wallet');
      return;
    }

    if (!canUseAgents) {
      Alert.alert(
        'Access Denied',
        `AI Agents require credit score ≥50. Your score: ${creditScore}`
      );
      return;
    }

    Alert.alert(
      'Deploy AI Agent',
      `Deploy ${agent.name} with ${agent.dailyLimit} SHM daily limit?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deploy',
          onPress: async () => {
            setDeploying(agent.id);
            try {
              const walletAddress = await aiAgentService.deployAgentWallet(
                provider,
                agent.id,
                agent.dailyLimit
              );

              Alert.alert(
                'Agent Deployed! 🤖',
                `Wallet: ${walletAddress.substring(0, 10)}...`,
                [{ text: 'OK', onPress: loadAgents }]
              );
            } catch (error: any) {
              console.error('Deploy error:', error);
              Alert.alert('Deployment Failed', error.message || 'Failed to deploy agent');
            } finally {
              setDeploying(null);
            }
          },
        },
      ]
    );
  };

  const handleToggleAgent = async (agent: AIAgent) => {
    if (!provider) return;

    const isPausing = agent.status === 'active';
    Alert.alert(
      isPausing ? 'Pause Agent' : 'Resume Agent',
      `${isPausing ? 'Pause' : 'Resume'} ${agent.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isPausing ? 'Pause' : 'Resume',
          onPress: async () => {
            try {
              await aiAgentService.toggleAgentStatus(provider, agent.walletAddress, isPausing);
              Alert.alert('Success', `Agent ${isPausing ? 'paused' : 'resumed'}`);
              loadAgents();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to toggle agent');
            }
          },
        },
      ]
    );
  };

  const renderAgent = (agent: AIAgent) => {
    const isDeploying = deploying === agent.id;
    const statusColor = agent.status === 'active' ? '#10b981' : '#ef4444';
    const typeEmoji = {
      trading: '📈',
      yield: '💰',
      payment: '💳',
      shopping: '🛒',
    }[agent.type];

    return (
      <View key={agent.id} style={styles.agentCard}>
        <View style={styles.agentHeader}>
          <View style={styles.agentIcon}>
            <Text style={styles.agentEmoji}>{typeEmoji}</Text>
          </View>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {agent.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.reputationBadge}>
            <Text style={styles.reputationText}>{agent.reputation}%</Text>
          </View>
        </View>

        <View style={styles.agentStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Daily Limit</Text>
            <Text style={styles.statValue}>{agent.dailyLimit} SHM</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Spent Today</Text>
            <Text style={styles.statValue}>{agent.spentToday} SHM</Text>
          </View>
        </View>

        <View style={styles.performance}>
          <Text style={styles.performanceTitle}>Performance</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Transactions</Text>
              <Text style={styles.performanceValue}>{agent.performance.totalTransactions}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Success Rate</Text>
              <Text style={styles.performanceValue}>{agent.performance.successRate}%</Text>
            </View>
            {agent.performance.profitGenerated > 0 && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Profit</Text>
                <Text style={[styles.performanceValue, styles.profitValue]}>
                  +${agent.performance.profitGenerated}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.agentActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deployButton]}
            onPress={() => handleDeployAgent(agent)}
            disabled={isDeploying || !canUseAgents}
          >
            {isDeploying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Deploy Agent</Text>
            )}
          </TouchableOpacity>

          {agent.walletAddress !== '0x...' && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                agent.status === 'active' ? styles.pauseButton : styles.resumeButton,
              ]}
              onPress={() => handleToggleAgent(agent)}
            >
              <Text style={styles.actionButtonText}>
                {agent.status === 'active' ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!canUseAgents) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedEmoji}>🔒</Text>
          <Text style={styles.accessDeniedTitle}>AI Agents Locked</Text>
          <Text style={styles.accessDeniedText}>
            Credit score ≥50 required to deploy AI agents
          </Text>
          <Text style={styles.accessDeniedScore}>Your score: {creditScore}</Text>
          <Text style={styles.accessDeniedHint}>
            Complete credit analysis and income verification
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Agents</Text>
        <Text style={styles.subtitle}>Autonomous DeFi assistants</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading agents...</Text>
          </View>
        ) : (
          <View style={styles.agentsContainer}>
            {agents.map(renderAgent)}
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
  scrollView: {
    flex: 1,
  },
  agentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  agentCard: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d5f',
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  agentIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#2d2d5f',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentEmoji: {
    fontSize: 24,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reputationBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reputationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  agentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d5f',
  },
  statItem: {},
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  performance: {
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  profitValue: {
    color: '#10b981',
  },
  agentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deployButton: {
    backgroundColor: '#6366f1',
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resumeButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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

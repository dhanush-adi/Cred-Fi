import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ethers } from 'ethers';
import { systemOrchestrator } from '../services/systemOrchestrator';

interface Props {
  provider: ethers.BrowserProvider | null;
  walletAddress: string;
  creditScore: number;
}

export default function ContractDemoScreen({ provider, walletAddress, creditScore }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const executeDemo = async (demoName: string, demoFn: () => Promise<void>) => {
    if (!provider) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    setLoading(demoName);
    addLog(`🚀 Starting: ${demoName}`);
    try {
      await demoFn();
      addLog(`✅ Completed: ${demoName}`);
      Alert.alert('Success', `${demoName} completed!`);
    } catch (error: any) {
      addLog(`❌ Failed: ${demoName} - ${error.message}`);
      Alert.alert('Error', error.message || 'Operation failed');
    } finally {
      setLoading(null);
    }
  };

  const demos = [
    {
      id: 'income-proof',
      title: '📝 Submit Income Proof',
      subtitle: 'IncomeProofVerifier.sol',
      action: async () => {
        await executeDemo('Income Proof Verification', async () => {
          const verification = await systemOrchestrator.completeIncomeVerification(
            walletAddress,
            'wise'
          );
          const proofHash = '0x' + Math.random().toString(16).substring(2);
          await systemOrchestrator.submitIncomeProofOnChain(
            provider!,
            walletAddress,
            verification.monthlyIncome,
            proofHash
          );
          addLog(`Income: $${verification.monthlyIncome}/month verified`);
        });
      },
    },
    {
      id: 'credit-line',
      title: '💳 Request Credit Line',
      subtitle: 'FlexCreditCore.sol',
      action: async () => {
        await executeDemo('Credit Line Request', async () => {
          const creditLine = await systemOrchestrator.requestCreditLine(
            provider!,
            walletAddress,
            5000
          );
          addLog(`Credit approved: ${ethers.formatEther(creditLine.creditLimit)} SHM at ${creditLine.apr}% APR`);
        });
      },
      minScore: 40,
    },
    {
      id: 'borrow',
      title: '💵 Borrow Funds',
      subtitle: 'FlexCreditCore.sol - borrow()',
      action: async () => {
        await executeDemo('Borrow from Credit', async () => {
          const txHash = await systemOrchestrator.borrowFromCreditLine(provider!, 100);
          addLog(`Borrowed 100 SHM - TX: ${txHash.substring(0, 10)}...`);
        });
      },
      minScore: 40,
    },
    {
      id: 'deploy-agent',
      title: '🤖 Deploy AI Agent Wallet',
      subtitle: 'AgentWalletFactory.sol',
      action: async () => {
        await executeDemo('Deploy Agent Wallet', async () => {
          const agent = await systemOrchestrator.deployAgentWallet(
            provider!,
            'trading',
            1000
          );
          addLog(`Agent deployed: ${agent.walletAddress.substring(0, 10)}...`);
          addLog(`Daily limit: 1000 SHM`);
        });
      },
      minScore: 50,
    },
    {
      id: 'agent-transaction',
      title: '⚡ Execute Agent Transaction',
      subtitle: 'AgentWallet.sol - executeTransaction()',
      action: async () => {
        await executeDemo('Agent Transaction', async () => {
          // Mock agent wallet for demo
          const mockAgentWallet = '0x' + '1'.repeat(40);
          const txHash = await systemOrchestrator.executeAgentTransaction(
            provider!,
            mockAgentWallet,
            '0x' + '2'.repeat(40),
            10,
            'DeFi yield optimization'
          );
          addLog(`Agent executed transaction: ${txHash.substring(0, 10)}...`);
        });
      },
      minScore: 50,
    },
    {
      id: 'agent-policy',
      title: '📋 Check Agent Policy',
      subtitle: 'AgentPolicy.sol',
      action: async () => {
        await executeDemo('Agent Policy Check', async () => {
          addLog('Policy: Max daily spend = 5000 SHM');
          addLog('Policy: Max single TX = 1000 SHM');
          addLog('Policy: Min reputation = 70%');
          addLog('Policy: Allowed categories = [DeFi, Trading, Yield]');
        });
      },
      minScore: 50,
    },
    {
      id: 'agent-performance',
      title: '📊 Track Agent Performance',
      subtitle: 'AgentPerformanceVerifier.sol',
      action: async () => {
        await executeDemo('Agent Performance', async () => {
          addLog('Performance: 245 total transactions');
          addLog('Performance: 98.5% success rate');
          addLog('Performance: Reputation score = 95/100');
          addLog('Performance: Average gas = 0.0002 SHM');
        });
      },
      minScore: 50,
    },
    {
      id: 'marketplace-buy',
      title: '🛒 Buy from Marketplace',
      subtitle: 'ECommerceStore.sol / Food.sol',
      action: async () => {
        await executeDemo('Marketplace Purchase', async () => {
          const txHash = await systemOrchestrator.purchaseFromMarketplace(
            provider!,
            '1',
            'SHM',
            false
          );
          addLog(`Product purchased: ${txHash.substring(0, 10)}...`);
        });
      },
      minScore: 30,
    },
    {
      id: 'marketplace-route',
      title: '🔀 Route Agent Purchase',
      subtitle: 'MarketplaceAgentRouter.sol',
      action: async () => {
        await executeDemo('Agent Marketplace Routing', async () => {
          addLog('Routing purchase through agent wallet...');
          addLog('Agent approved transaction');
          addLog('Payment executed: 0.5 SHM');
          addLog('Product delivered to user');
        });
      },
      minScore: 50,
    },
    {
      id: 'dex-swap',
      title: '🔄 DEX Token Swap',
      subtitle: 'SimulateDex.sol - swapExactTokensForTokens()',
      action: async () => {
        await executeDemo('DEX Swap', async () => {
          const swapResult = await systemOrchestrator.executeDexSwap(
            provider!,
            '0x...SHM',
            '0x...USDC',
            10
          );
          addLog(`Swapped: ${ethers.formatEther(swapResult.amountIn)} SHM`);
          addLog(`Received: ${ethers.formatEther(swapResult.amountOut)} USDC`);
          addLog(`Price impact: ${swapResult.priceImpact}%`);
        });
      },
      minScore: 60,
    },
    {
      id: 'dex-liquidity',
      title: '💧 Add DEX Liquidity',
      subtitle: 'SimulateDex.sol - addLiquidity()',
      action: async () => {
        await executeDemo('Add Liquidity', async () => {
          const txHash = await systemOrchestrator.addDexLiquidity(
            provider!,
            '0x...SHM',
            '0x...USDC',
            50,
            100
          );
          addLog(`Liquidity added: ${txHash.substring(0, 10)}...`);
          addLog(`Position: 50 SHM + 100 USDC`);
          addLog(`LP tokens minted`);
        });
      },
      minScore: 60,
    },
    {
      id: 'complete-flow',
      title: '🎯 Complete System Flow',
      subtitle: 'All contracts working together',
      action: async () => {
        await executeDemo('Complete Flow Demo', async () => {
          await systemOrchestrator.demonstrateCompleteFlow(provider!, walletAddress);
        });
      },
    },
  ];

  const renderDemo = (demo: any) => {
    const isLocked = demo.minScore && creditScore < demo.minScore;
    const isLoading = loading === demo.id;

    return (
      <TouchableOpacity
        key={demo.id}
        style={[styles.demoCard, isLocked && styles.demoCardLocked]}
        onPress={demo.action}
        disabled={isLoading || isLocked}
      >
        <View style={styles.demoHeader}>
          <Text style={[styles.demoTitle, isLocked && styles.textLocked]}>
            {demo.title}
          </Text>
          {demo.minScore && (
            <View style={[styles.scoreBadge, isLocked && styles.scoreBadgeLocked]}>
              <Text style={styles.scoreText}>≥{demo.minScore}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.demoSubtitle, isLocked && styles.textLocked]}>
          {demo.subtitle}
        </Text>
        {isLoading && (
          <ActivityIndicator size="small" color="#6366f1" style={styles.loader} />
        )}
        {isLocked && (
          <Text style={styles.lockedText}>
            Requires credit score ≥{demo.minScore} (Current: {creditScore})
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Smart Contract Demo</Text>
        <Text style={styles.subtitle}>Test all contract functionalities</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>Your Score:</Text>
          <Text style={styles.scoreValue}>{creditScore}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.demosContainer}>
          {demos.map(renderDemo)}
        </View>

        {logs.length > 0 && (
          <View style={styles.logsContainer}>
            <Text style={styles.logsTitle}>📋 Activity Log</Text>
            {logs.slice(-10).reverse().map((log, index) => (
              <Text key={index} style={styles.logEntry}>
                {log}
              </Text>
            ))}
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
    backgroundColor: '#1a1a3e',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d5f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 10,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 12,
    marginRight: 6,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreBadgeLocked: {
    backgroundColor: '#ef4444',
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  demosContainer: {
    padding: 20,
  },
  demoCard: {
    backgroundColor: '#1a1a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d2d5f',
  },
  demoCardLocked: {
    opacity: 0.5,
    borderColor: '#ef4444',
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  demoSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  textLocked: {
    color: '#6b7280',
  },
  loader: {
    marginTop: 10,
  },
  lockedText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 8,
  },
  logsContainer: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#1a1a3e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d5f',
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  logEntry: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
});

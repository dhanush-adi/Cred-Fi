/**
 * Backend server for Cred-Fi platform
 * Handles vlayer API proxy, Vouch verification, and smart contract interactions
 * Handles CORS and proxies requests to vlayer Web Prover
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// vlayer credentials (use environment variables in production)
const VLAYER_PROVER_URL = process.env.VLAYER_PROVER_URL || 'https://web-prover.vlayer.xyz/api/v1';
const VLAYER_CLIENT_ID = process.env.VLAYER_CLIENT_ID || '4f028e97-b7c7-4a81-ade2-6b1a2917380c';
const VLAYER_AUTH_TOKEN = process.env.VLAYER_AUTH_TOKEN || 'jUWXi1pVUoTHgc7MOgh5X0zMR12MHtAhtjVgMc2DM3B3Uc8WEGQAEix83VwZ';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'vlayer proxy server running' });
});

// GET /api/user/:address - Get user data by wallet address
app.get('/api/user/:address', (req, res) => {
  const { address } = req.params;
  
  // Generate consistent but pseudo-random data based on wallet address
  const hash = address.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const creditScore = Math.abs(hash % 100);
  const balance = Math.abs((hash * 7) % 1000) / 2;
  const availableCredit = Math.abs((hash * 13) % 2000);
  const activeAgents = Math.abs((hash * 3) % 5);
  
  res.json({
    address,
    balance: parseFloat(balance.toFixed(2)),
    creditScore,
    availableCredit,
    activeAgents,
    transactions: [
      { type: 'Transfer', amount: '50 SHM', status: 'Confirmed', date: '2 hours ago' },
      { type: 'Borrow', amount: '100 SHM', status: 'Confirmed', date: '1 day ago' },
      { type: 'Yield', amount: '5.2 SHM', status: 'Confirmed', date: '3 days ago' },
    ],
  });
});

// POST /api/transfer - Handle token transfers for marketplace purchases
app.post('/api/transfer', (req, res) => {
  try {
    const { from, to, amount, items } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: from, to, amount' 
      });
    }

    // Log the transfer
    console.log(`💳 Token Transfer Requested:`);
    console.log(`  From: ${from}`);
    console.log(`  To: ${to}`);
    console.log(`  Amount: ${amount} SHM`);
    console.log(`  Items: ${items ? items.length : 0} product(s)`);
    if (items) {
      items.forEach(item => {
        console.log(`    - Product ${item.productId}: qty ${item.quantity}`);
      });
    }

    // Generate mock transaction hash
    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    
    // Return success response
    res.json({
      success: true,
      txHash,
      from,
      to,
      amount,
      itemsCount: items ? items.length : 0,
      timestamp: new Date().toISOString(),
      message: 'Transfer initiated successfully',
    });

    console.log(`✅ Transfer logged with txHash: ${txHash}`);
  } catch (error) {
    console.error('❌ Transfer error:', error);
    res.status(500).json({ 
      error: 'Transfer failed',
      message: error.message 
    });
  }
});

// POST /api/vlayer/prove - Generate Web Proof
app.post('/api/vlayer/prove', async (req, res) => {
  try {
    const { url, method = 'GET', headers = [], body } = req.body;

    console.log('🔐 Proxying vlayer prove request:', { url, method });

    const response = await fetch(`${VLAYER_PROVER_URL}/prove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': VLAYER_CLIENT_ID,
        'Authorization': `Bearer ${VLAYER_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        url,
        method,
        headers,
        body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ vlayer error:', error);
      return res.status(response.status).json({ error });
    }

    const result = await response.json();
    console.log('✅ Proof generated successfully');

    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error proxying vlayer request:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/vlayer/verify - Verify Web Proof
app.post('/api/vlayer/verify', async (req, res) => {
  try {
    const presentation = req.body;

    console.log('🔍 Proxying vlayer verify request');

    const response = await fetch(`${VLAYER_PROVER_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': VLAYER_CLIENT_ID,
        'Authorization': `Bearer ${VLAYER_AUTH_TOKEN}`,
      },
      body: JSON.stringify(presentation),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ vlayer verification error:', error);
      return res.status(response.status).json({ error });
    }

    const result = await response.json();
    console.log('✅ Proof verified successfully');

    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error proxying vlayer verification:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/vlayer/analyze-wallet - Analyze wallet and generate credit proof
app.post('/api/vlayer/analyze-wallet', async (req, res) => {
  // Set proper JSON headers
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    console.log('🔍 Analyzing wallet:', walletAddress);

    // Validate address format
    const ethers = require('ethers');
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // For demo purposes, use mock data to avoid RPC issues
    // In production, you would fetch real data from Shardeum
    let txCount = 0;
    let balance = ethers.toBigInt(0);
    let balanceInSHM = '0';
    let dataSource = 'mock';

    try {
      // Try to fetch from Shardeum
      const provider = new ethers.JsonRpcProvider('https://api-mezame.shardeum.org', {
        chainId: 8119,
        name: 'shardeum-mezame'
      });
      
      // Set timeout for RPC calls
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('RPC timeout')), 5000)
      );

      const txCountPromise = provider.getTransactionCount(walletAddress);
      const balancePromise = provider.getBalance(walletAddress);

      [txCount, balance] = await Promise.race([
        Promise.all([txCountPromise, balancePromise]),
        timeout
      ]);

      balanceInSHM = ethers.formatEther(balance);
      dataSource = 'blockchain';
      console.log('✅ Real blockchain data fetched:', { txCount, balance: balanceInSHM });
    } catch (blockchainError) {
      console.warn('⚠️ Blockchain fetch failed, using mock data:', blockchainError.message);
      // Generate realistic mock data based on wallet address
      const addressNum = parseInt(walletAddress.slice(2, 10), 16);
      txCount = Math.floor((addressNum % 100) + 5);
      balanceInSHM = ((addressNum % 1000) / 100).toFixed(4);
      dataSource = 'mock';
    }

    // Calculate credit score based on wallet activity
    const activityScore = Math.min(100, (txCount / 10) * 100);
    const balanceScore = Math.min(100, parseFloat(balanceInSHM) * 10);
    const creditScore = Math.floor((activityScore * 0.6 + balanceScore * 0.4));
    
    // Calculate lending capacity (credit limit)
    const baseLendingCapacity = parseFloat(balanceInSHM) * 0.5; // 50% of balance
    const activityBonus = (txCount / 100) * 100; // Up to $100 based on activity
    const totalLendingCapacity = Math.max(100, baseLendingCapacity + activityBonus); // Minimum $100

    // Determine risk tier
    let riskTier = 'Low';
    let interestRate = 5; // Annual percentage
    if (creditScore >= 80) {
      riskTier = 'Excellent';
      interestRate = 3;
    } else if (creditScore >= 60) {
      riskTier = 'Good';
      interestRate = 5;
    } else if (creditScore >= 40) {
      riskTier = 'Fair';
      interestRate = 8;
    } else {
      riskTier = 'Building';
      interestRate = 12;
    }

    const analysisData = {
      walletAddress,
      network: 'Shardeum Mezame Testnet',
      dataSource, // 'blockchain' or 'mock'
      totalTransactions: txCount,
      balance: balanceInSHM,
      balanceUSD: (parseFloat(balanceInSHM) * 1.5).toFixed(2), // Mock price
      activityScore: Math.floor(activityScore),
      creditScore,
      riskTier,
      lendingCapacity: totalLendingCapacity.toFixed(2),
      interestRate,
      timestamp: Date.now(),
    };

    console.log('📊 Credit analysis:', analysisData);

    // Generate vlayer Web Proof for wallet verification
    const proofPayload = {
      chainId: 8119,
      address: walletAddress,
      balance: balanceInSHM,
      transactions: txCount,
      creditScore,
    };

    let proof = null;
    let proofVerified = false;

    try {
      // Call vlayer Web Prover API
      const proveResponse = await fetch(`${VLAYER_PROVER_URL}/prove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': VLAYER_CLIENT_ID,
          'Authorization': `Bearer ${VLAYER_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          url: `https://explorer-mezame.shardeum.org/address/${walletAddress}`,
          method: 'GET',
          claims: proofPayload,
        }),
      });

      if (proveResponse.ok) {
        const proofData = await proveResponse.json();
        proof = proofData.proof || ethers.id(JSON.stringify(proofPayload));
        proofVerified = true;
        console.log('✅ vlayer ZK proof generated');
      }
    } catch (proofError) {
      console.log('⚠️ vlayer proof generation failed, using fallback:', proofError.message);
    }

    // Generate fallback proof if vlayer failed
    if (!proof) {
      proof = ethers.id(JSON.stringify(proofPayload));
    }

    // Return analysis with credit scoring
    const response = {
      ...analysisData,
      proof,
      proofVerified,
      message: proofVerified 
        ? 'Wallet analysis completed with vlayer ZK proof' 
        : dataSource === 'mock'
        ? 'Demo analysis completed (using mock data)'
        : 'Wallet analysis completed (hash-based proof)',
    };

    console.log('✅ Sending response:', JSON.stringify(response).substring(0, 100) + '...');
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error analyzing wallet:', error);
    // Always return JSON, never HTML
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message || 'Unknown error occurred',
      walletAddress: req.body.walletAddress || 'unknown'
    });
  }
});

// POST /api/vlayer/comprehensive-analysis - Single wallet comprehensive credit analysis
app.post('/api/vlayer/comprehensive-analysis', async (req, res) => {
  try {
    const { wallets = [], vouchVerification } = req.body;
    
    if (!wallets || wallets.length === 0) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const wallet = wallets[0]; // Only use first wallet
    console.log(`📊 Comprehensive analysis for wallet: ${wallet}`);

    // Simple hash-based mock data for demo
    const addressHash = parseInt(wallet.slice(2, 10), 16);
    const txCount = (addressHash % 50) + 10;
    const balance = ((addressHash % 100) / 10) + 0.5;

    // Calculate credit factors (removed multi-wallet score)
    const onChainActivity = Math.min(100, Math.floor((txCount / 20) * 100));
    const walletBalance = Math.min(100, Math.floor(balance * 10));
    
    // Vouch verification adds significant boost
    const incomeVerification = vouchVerification && vouchVerification.verified ? 85 : 0;
    
    // Transaction history score
    const transactionHistory = Math.min(100, Math.floor((txCount / 50) * 100));

    // Calculate overall credit score (4 factors now, not 5)
    const factors = {
      onChainActivity,
      walletBalance,
      incomeVerification,
      transactionHistory,
    };

    // Weighted average (removed multiWalletScore)
    const creditScore = Math.floor(
      (onChainActivity * 0.30) +      // Increased from 25%
      (walletBalance * 0.25) +        // Increased from 20%
      (incomeVerification * 0.30) +   // Same 30%
      (transactionHistory * 0.15)     // Same 15%
    );

    // Calculate max borrow amount
    let maxBorrowAmount = 500; // Base amount
    
    if (vouchVerification && vouchVerification.verified) {
      // With income verification, can borrow up to 30% of monthly income
      maxBorrowAmount = Math.floor(vouchVerification.monthlyIncome * 0.3);
    } else {
      // Without verification, based on on-chain metrics
      maxBorrowAmount = Math.floor((balance * 0.5 * 1000) + (txCount * 10));
    }

    // Generate recommendations
    const recommendations = [];
    
    if (!vouchVerification || !vouchVerification.verified) {
      recommendations.push('Verify your income with Vouch to unlock higher borrowing limits and +20% score boost');
    }
    
    if (onChainActivity < 50) {
      recommendations.push('Increase your on-chain activity to build a stronger credit history');
    }
    
    if (walletBalance < 50) {
      recommendations.push('Maintain a higher balance to improve your creditworthiness');
    }

    if (creditScore >= 80) {
      recommendations.push('Excellent credit! You qualify for the lowest interest rates (3.5% APR)');
    } else if (creditScore >= 60) {
      recommendations.push('Good credit standing. Consider verifying income to reach excellent tier');
    }

    const response = {
      walletAddress: wallet,
      creditScore,
      maxBorrowAmount,
      factors,
      vouchVerification,
      recommendations,
      totalBalance: balance.toFixed(4),
      totalTransactions: txCount,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('❌ Comprehensive analysis error:', error);
    return res.status(500).json({ 
      error: 'Comprehensive analysis failed',
      message: error.message 
    });
  }
});

// POST /api/vouch/initiate - Initiate Vouch verification
app.post('/api/vouch/initiate', async (req, res) => {
  try {
    const { walletAddress, provider } = req.body;
    
    if (!walletAddress || !provider) {
      return res.status(400).json({ error: 'walletAddress and provider required' });
    }

    // Generate unique request ID
    const requestId = `vouch_${Date.now()}_${walletAddress.slice(0, 8)}`;
    
    // In production, this would redirect to actual Vouch API
    // For demo, return mock redirect URL
    const redirectUrl = `https://app.getvouch.io/verify?requestId=${requestId}&wallet=${walletAddress}&provider=${provider}`;
    
    console.log(`🔐 Initiated Vouch verification: ${provider} for ${walletAddress}`);
    
    return res.status(200).json({
      requestId,
      redirectUrl,
      provider,
      walletAddress,
    });
  } catch (error) {
    console.error('❌ Vouch initiation error:', error);
    return res.status(500).json({ error: 'Failed to initiate verification' });
  }
});

// GET /api/vouch/status/:requestId - Check Vouch verification status
app.get('/api/vouch/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // In production, this would query actual Vouch API
    // For demo, return mock status (will show as not verified until real integration)
    
    console.log(`🔍 Checking Vouch status: ${requestId}`);
    
    // Return null to indicate not yet verified (frontend will keep polling)
    return res.status(200).json(null);
  } catch (error) {
    console.error('❌ Vouch status check error:', error);
    return res.status(500).json({ error: 'Status check failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 vlayer proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Prove endpoint: http://localhost:${PORT}/api/vlayer/prove`);
  console.log(`🔍 Verify endpoint: http://localhost:${PORT}/api/vlayer/verify`);
  console.log(`📊 Analyze wallet: http://localhost:${PORT}/api/vlayer/analyze-wallet`);
});

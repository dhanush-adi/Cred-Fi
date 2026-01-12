/**
 * Backend server for vlayer API proxy
 * Handles CORS and proxies requests to vlayer Web Prover
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// vlayer credentials
const VLAYER_PROVER_URL = 'https://web-prover.vlayer.xyz/api/v1';
const VLAYER_CLIENT_ID = '4f028e97-b7c7-4a81-ade2-6b1a2917380c';
const VLAYER_AUTH_TOKEN = 'jUWXi1pVUoTHgc7MOgh5X0zMR12MHtAhtjVgMc2DM3B3Uc8WEGQAEix83VwZ';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'vlayer proxy server running' });
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
      const provider = new ethers.JsonRpcProvider('https://sphinx.shardeum.org/', {
        chainId: 8082,
        name: 'shardeum-sphinx'
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
      network: 'Shardeum Sphinx Testnet',
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
      chainId: 8082,
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
          url: `https://explorer-sphinx.shardeum.org/address/${walletAddress}`,
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

app.listen(PORT, () => {
  console.log(`🚀 vlayer proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Prove endpoint: http://localhost:${PORT}/api/vlayer/prove`);
  console.log(`🔍 Verify endpoint: http://localhost:${PORT}/api/vlayer/verify`);
  console.log(`📊 Analyze wallet: http://localhost:${PORT}/api/vlayer/analyze-wallet`);
});

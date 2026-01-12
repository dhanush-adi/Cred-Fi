# Cred-Fi

## 🚀 Complete DeFi Credit Platform with AI Agents

Cred-Fi enables instant credit access through cryptographic income verification, autonomous AI agents, and a full-featured DeFi ecosystem on Shardeum blockchain.

### ✨ Key Features

- **🔐 Zero-Knowledge Income Verification** - vlayer Web Prover for privacy-preserving wallet proofs
- **💰 Multi-Source Verification** - Vouch integration (Wise, Binance, Stripe, PayPal)
- **🤖 AI Agent Wallets** - Smart wallets with spending limits and reputation tracking
- **🛍️ DeFi Marketplace** - E-commerce + Food ordering with dual pricing (SHM/USDC)
- **🔄 DEX Integration** - Token swaps and liquidity provision
- **💳 Flexible Credit Lines** - FlexCreditCore lending protocol (3.5%-12% APR)
- **🔑 Direct Wallet Auth** - MetaMask connection with auto network switching

### 🎯 Core Technologies

**vlayer Web Prover:**
- Zero-knowledge proof generation
- On-chain wallet activity verification
- Privacy-preserving credit scoring

**Vouch Protocol:**
- OAuth-based income verification
- Wise, Binance, Stripe, PayPal integration
- Real income data validation

**Shardeum Blockchain:**
- Sphinx 1.X Testnet (Chain ID: 8082)
- 11 deployed smart contracts
- Low gas fees with SHM token

**Smart Contract Suite:**
- AgentWallet, AgentWalletFactory, AgentPolicy
- AgentPerformanceVerifier, IncomeProofVerifier
- FlexCreditCore, MarketplaceAgentRouter
- ECommerceStore, Food, Shop, SimulateDex

### 📱 Quick Start

```bash
# Install dependencies
npm install

# Set environment variable
export EXPO_PUBLIC_USE_SIMPLE=true

# Start backend server (port 3001)
node server.js

# In another terminal, start frontend (port 8081)
npm start
```

Access app at: http://localhost:8081

### 🔧 Tech Stack

- **Frontend**: React Native Web + Expo + TypeScript
- **Auth**: MetaMask (direct wallet connection)
- **Blockchain**: Shardeum Sphinx 1.X Testnet
- **Credit Scoring**: 4-factor algorithm (Activity 30%, Balance 25%, Income 30%, History 15%)
- **Verification**: vlayer (ZK proofs) + Vouch (OAuth)
- **AI Agents**: Custom smart wallet implementation
- **Smart Contracts**: Solidity 0.8.20 + Hardhat

### 🎯 How It Works

**Complete User Flow:**
1. Connect MetaMask wallet
2. Auto credit analysis (vlayer + on-chain data)
3. Verify income via Vouch (optional, boosts score)
4. Access features based on credit score:
   - Score ≥30: Marketplace access
   - Score ≥40: Borrowing enabled
   - Score ≥50: AI agents unlocked
   - Score ≥60: DEX trading available

**AI Agent Flow:**
1. Deploy agent wallet (AgentWalletFactory.sol)
2. Set spending limits and policies
3. Agent executes autonomous transactions
4. Performance tracked on-chain
5. Reputation affects future operations

### 📱 Features

- **Home**: Wallet balance, send/receive, transaction history
- **Credit**: Score analysis, income verification, borrow/repay
- **Agents**: AI agent deployment and management (4 types: Yield, Trading, Payment, Shopping)
- **Marketplace**: E-commerce + Food ordering with SHM/USDC payment
- **Demo**: Test all smart contract functionalities
- **More**: Settings and wallet management

### 🧪 Smart Contract Demo

Navigate to **Demo tab** (🧪) to test:
- Income proof submission (IncomeProofVerifier.sol)
- Credit line requests (FlexCreditCore.sol)
- Agent wallet deployment (AgentWalletFactory.sol)
- Marketplace purchases (ECommerceStore.sol, Food.sol)
- DEX swaps and liquidity (SimulateDex.sol)
- Complete system flow

### 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for smart contract deployment guide.

```bash
# Deploy all contracts to Shardeum
npx hardhat run scripts/deploy-all.js --network shardeum

# Update contract addresses in src/contracts/types.ts
# Restart app to use deployed contracts
```

### 📊 Credit Score System

**4-Factor Scoring:**
- On-chain Activity: 30%
- Wallet Balance: 25%
- Income Verification: 30%
- Transaction History: 15%

**Risk Tiers:**
- Excellent (80-100): 3.5% APR
- Good (60-79): 5.5% APR
- Fair (40-59): 8.5% APR
- Building (0-39): 12% APR

### 📚 Documentation

- [README_INTEGRATED.md](README_INTEGRATED.md) - Complete system overview
- [CONTRACT_INTEGRATION_STATUS.md](CONTRACT_INTEGRATION_STATUS.md) - All contract functionalities
- [DEPLOYMENT.md](DEPLOYMENT.md) - Contract deployment guide
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Quick summary

---

**Network**: Shardeum Sphinx 1.X Testnet  
**Faucet**: https://faucet-sphinx.shardeum.org/  
**Explorer**: https://explorer-sphinx.shardeum.org/  

Built with ❤️ for decentralized finance

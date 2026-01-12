# Cred-Fi Backend

Express.js backend API with smart contracts for the Cred-Fi DeFi credit platform.

## 📁 Structure

```
backend/
├── server.js                    # Express API server (port 3001)
├── api/                         # API route handlers
│   ├── hedera-agent.ts         # Hedera integration
│   ├── verify-income.ts        # Income verification
│   ├── wise-income.ts          # Wise API
│   ├── analyze-wallet.ts       # Wallet analysis
│   └── vouch/                  # Vouch verification routes
├── contracts/                   # Solidity smart contracts (11 total)
├── scripts/                     # Deployment scripts
├── hardhat.config.cjs          # Hardhat configuration
└── package.json                # Dependencies
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start server
npm start

# Development mode (auto-reload)
npm run dev
```

Server runs on **http://localhost:3001**

## 🔧 Environment Variables

Required in `.env`:

```bash
# Server
PORT=3001

# Blockchain
PRIVATE_KEY=your_wallet_private_key

# vlayer Web Prover
VLAYER_PROVER_URL=https://web-prover.vlayer.xyz/api/v1
VLAYER_CLIENT_ID=your_client_id
VLAYER_AUTH_TOKEN=your_auth_token

# Vouch API (optional)
VOUCH_API_KEY=your_vouch_key
VOUCH_API_URL=https://api.vouch.io/v1

# Network
SHARDEUM_RPC=https://api-mezame.shardeum.org
CHAIN_ID=8119
```

## 🔌 API Endpoints

### User Data & Credit Scoring
```bash
GET /api/user/:address
Response: {
  address: "0x...",
  balance: 12558.21,
  creditScore: 750,
  riskTier: "good",
  activityScore: 75,
  balanceScore: 95,
  transactionCount: 24,
  recentTransactions: [
    {
      hash: "0x...",
      from: "0x...",
      to: "0x...",
      value: "1.5",
      timestamp: 1234567890
    }
  ]
}
```

**Credit Score Calculation:**
```
activityScore = min(transactionCount * 2, 100)
balanceScore = min((balance / 10000) * 100, 100)
creditScore = floor((activityScore * 0.6) + (balanceScore * 0.4))
```

**Risk Tiers:**
- **Excellent** (800-1000): creditScore >= 800
- **Good** (600-799): creditScore >= 600
- **Fair** (400-599): creditScore >= 400
- **Building** (< 400): New or inactive users

### Credit Analysis (vlayer)
```bash
POST /api/vlayer/comprehensive-analysis
Body: { walletAddress: "0x..." }
Response: { creditScore, riskTier, factors, features }

POST /api/vlayer/prove
Body: { url, method, headers, body }
Response: { proof, status }

POST /api/vlayer/verify
Body: { proof }
Response: { valid, data }
```

### Income Verification (Vouch)
```bash
POST /api/vouch/initiate
Body: { walletAddress: "0x...", provider: "wise" }
Response: { requestId, status }

GET /api/vouch/status/:requestId
Response: { verified: true, monthlyIncome: 5000 }
```

### Health Check
```bash
GET /health
Response: { status: "ok", message: "vlayer proxy server running" }
```

### Agent Management
```bash
POST /api/agents/deploy
Body: { name: "Agent Name", walletAddress: "0x..." }
Response: { agentId: "deployed-100-1234567890", address: "0x..." }

GET /api/agents/:agentId
Response: { id, name, status, balance, deploymentBlock }
```

## 📜 Smart Contracts (11 Total)

### Core Credit System
1. **FlexCreditCore.sol** - Flexible credit lines with dynamic APR
2. **IncomeProofVerifier.sol** - On-chain income verification

### AI Agent System
3. **AgentWallet.sol** - Smart wallet for AI agents
4. **AgentWalletFactory.sol** - Factory to deploy agent wallets
5. **AgentPolicy.sol** - Governance rules for agents
6. **AgentPerformanceVerifier.sol** - Performance tracking

### Marketplace
7. **MarketplaceAgentRouter.sol** - Route agent transactions
8. **ECommerceStore.sol** - E-commerce with dual pricing (SHM/USDC)
9. **Food.sol** - Food ordering platform
10. **Shop.sol** - General marketplace

### DeFi
11. **SimulateDex.sol** - DEX for swaps and liquidity

## 🔨 Smart Contract Commands

### Compile Contracts
```bash
npm run compile
```

### Deploy to Shardeum Testnet
```bash
npm run deploy
```

After deployment, update contract addresses in:
- `frontend/src/contracts/types.ts` → `CONTRACT_ADDRESSES` object

### Run Tests
```bash
npm test
```

## 🌐 Network Configuration

**Shardeum Mezame Testnet**
- **Chain ID**: 8119
- **RPC**: https://api-mezame.shardeum.org
- **Explorer**: https://explorer-mezame.shardeum.org/
- **Faucet**: https://faucet-mezame.shardeum.org/

Get testnet SHM tokens from the faucet before deploying contracts.

## 🧪 Testing API

Test credit analysis:
```bash
curl -X POST http://localhost:3001/api/vlayer/comprehensive-analysis \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

Test health:
```bash
curl http://localhost:3001/health
```

## 📚 Integration

The backend is designed to work with the Next.js frontend located in `/frontend`.

Frontend configuration:
```typescript
// frontend/next.config.js
env: {
  NEXT_PUBLIC_BACKEND_URL: 'http://localhost:3001',
  NEXT_PUBLIC_CHAIN_ID: '8119',
  NEXT_PUBLIC_RPC_URL: 'https://api-mezame.shardeum.org'
}
```

## 🔐 Security

- Never commit `.env` file
- Keep `PRIVATE_KEY` and API keys secure
- Use environment variables in production
- Enable rate limiting for production deployments
- Rotate API keys regularly

## 🐛 Troubleshooting

### Port already in use
```bash
lsof -ti:3001 | xargs kill -9
npm start
```

### Compilation errors
```bash
npx hardhat clean
npm run compile
```

### Missing dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 More Information

- **Main README**: See `/README.md` for complete project overview
- **Frontend**: See `/frontend/README.md` for frontend setup
- **v0.dev Prompt**: See `/V0_PROMPT.md` for UI generation guide

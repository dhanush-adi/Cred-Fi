# Cred-Fi - DeFi Credit Platform

Complete DeFi credit platform with zero-knowledge credit scoring, AI agent wallets, and decentralized marketplace on Shardeum blockchain.

## ⚡ Quick Start

### Prerequisites
- Node.js 16+
- MetaMask wallet
- Shardeum testnet tokens ([get from faucet](https://faucet-mezame.shardeum.org/))

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Cred-Fi-main
```

### 2. Backend Setup

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PRIVATE_KEY and API keys
npm start
```

Backend runs on **http://localhost:3001**

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on **http://localhost:3000**

### 4. Generate Complete UI (Recommended)

The frontend includes placeholder pages. To get the full production-ready dashboard:

1. Visit [v0.dev](https://v0.dev)
2. Open `/V0_PROMPT.md` and copy the entire prompt
3. Paste into v0.dev and generate
4. Copy generated code into `frontend/src/`
5. Install additional dependencies as suggested by v0.dev

## 🏗️ Architecture

```
Cred-Fi/
├── frontend/              # Next.js 14 web app
│   ├── src/
│   │   ├── app/          # Pages (landing, dashboard)
│   │   ├── contracts/    # Smart contract ABIs & types
│   │   └── services/     # API integration services
│   └── package.json
│
├── backend/               # Express.js API + Smart Contracts
│   ├── server.js         # API server (port 3001)
│   ├── api/              # Route handlers (vlayer, Vouch)
│   ├── contracts/        # 11 Solidity contracts
│   ├── scripts/          # Deployment scripts
│   └── hardhat.config.cjs
│
├── V0_PROMPT.md          # Complete prompt for v0.dev
├── MIGRATION_NEXTJS.md   # Migration notes
└── README.md             # This file
```

## ✨ Features

### 🔐 Zero-Knowledge Credit Scoring
- **vlayer Web Prover** integration for privacy-preserving wallet verification
- **Vouch Protocol** for OAuth-based income verification (Wise, Binance, Stripe, PayPal)
- **4-Factor Analysis**:
  - On-chain Activity (30%)
  - Wallet Balance (25%)
  - Income Verification (30%)
  - Transaction History (15%)

### 📊 Risk-Based Lending
- **Excellent** (80-100): 3.5% APR
- **Good** (60-79): 5.5% APR  
- **Fair** (40-59): 8.5% APR
- **Building** (0-39): 12% APR

### 🤖 AI Agent Wallets
- **4 Agent Types**: Trading, Yield Optimization, Payment, Shopping
- Autonomous smart wallets with spending limits
- Performance tracking and reputation scoring
- Factory pattern deployment

### 🛒 DeFi Marketplace
- E-commerce and Food ordering
- Dual pricing (SHM + USDC)
- Agent-routed transactions
- Access gates based on credit score

### 💱 DEX Integration
- Token swaps with 0.3% fee
- Liquidity provision
- Trading pairs (SHM/USDC, SHM/WETH, USDC/WETH)
- Price oracle simulation

### 🔓 Feature Access Gates
- **Marketplace**: Credit score ≥ 30
- **Borrowing**: Credit score ≥ 40
- **AI Agents**: Credit score ≥ 50
- **DEX Trading**: Credit score ≥ 60

## 📜 Smart Contracts (11 Total)

### Core Credit System
1. **FlexCreditCore.sol** - Flexible credit lines with dynamic APR
2. **IncomeProofVerifier.sol** - On-chain income verification with ZK proofs

### AI Agent System  
3. **AgentWallet.sol** - Smart wallet for AI agents with spending limits
4. **AgentWalletFactory.sol** - Factory for deploying agent wallets
5. **AgentPolicy.sol** - Governance rules and spending policies
6. **AgentPerformanceVerifier.sol** - Performance tracking and reputation

### Marketplace
7. **MarketplaceAgentRouter.sol** - Route agent transactions through marketplace
8. **ECommerceStore.sol** - E-commerce with dual pricing
9. **Food.sol** - Food ordering platform
10. **Shop.sol** - General marketplace

### DeFi
11. **SimulateDex.sol** - Token swaps and liquidity provision

All contracts are in `/backend/contracts/` and ready to deploy to Shardeum.

## 🌐 Network Configuration

**Shardeum Mezame Testnet**
- **Chain ID**: `8119`
- **RPC URL**: `https://api-mezame.shardeum.org`
- **Block Explorer**: `https://explorer-mezame.shardeum.org/`
- **Faucet**: `https://faucet-mezame.shardeum.org/`
- **Native Token**: SHM

Get testnet SHM from the faucet before deploying contracts or testing the app.

## 🔌 API Endpoints

### Credit Analysis
```bash
POST http://localhost:3001/api/vlayer/comprehensive-analysis
Body: { walletAddress: "0x..." }
Response: { creditScore, riskTier, factors, features }
```

### Income Verification
```bash
POST http://localhost:3001/api/vouch/initiate
Body: { walletAddress: "0x...", provider: "wise" }
Response: { requestId, status }

GET http://localhost:3001/api/vouch/status/:requestId
Response: { verified: true, monthlyIncome: 5000 }
```

### Health Check
```bash
GET http://localhost:3001/health
Response: { status: "ok" }
```

## 🔄 User Flow

1. **Connect Wallet** → Multi-wallet support via wagmi (MetaMask, WalletConnect, etc.)
2. **Auto Analysis** → Backend analyzes wallet + fetches Vouch income data
3. **View Credit Score** → Dashboard shows 0-100 score with tier and breakdown
4. **Unlock Features** → Tabs unlock based on score thresholds
5. **Interact**:
   - **Borrow** → Request credit line, borrow funds
   - **Shop** → Buy from marketplace with SHM or USDC
   - **Deploy Agents** → Create AI wallets for automation
   - **Trade** → Swap tokens on DEX, provide liquidity
6. **Manage** → Repay loans, improve score over time

## 💻 Tech Stack

### Frontend
- **Next.js 14** - App Router with React Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **wagmi + viem** - Multi-wallet connections
- **ethers.js v6** - Blockchain interactions
- **Framer Motion** - Smooth animations
- **TanStack Query** - API data fetching

### Backend
- **Express.js** - REST API server
- **ethers.js v6** - Smart contract interactions
- **Hardhat** - Smart contract development
- **vlayer Web Prover** - Zero-knowledge proofs
- **Vouch API** - Income verification

### Blockchain
- **Shardeum** - EVM-compatible L1 with high throughput
- **Solidity 0.8.20** - Smart contract language

## 🛠️ Development

### Compile Smart Contracts
```bash
cd backend
npm run compile
```

### Deploy to Shardeum
```bash
cd backend
npm run deploy
```

After deployment, update contract addresses in:
- `frontend/src/contracts/types.ts` → `CONTRACT_ADDRESSES` object

### Test Smart Contracts
```bash
cd backend
npm test
```

### Run Full Stack
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📚 Documentation

- **`/backend/README.md`** - Backend API and smart contracts guide
- **`/frontend/README.md`** - Frontend setup and v0.dev integration
- **`/V0_PROMPT.md`** - Complete prompt for v0.dev UI generation
- **`/MIGRATION_NEXTJS.md`** - React Native → Next.js migration notes

## 🎨 Using v0.dev for UI Generation

The project includes a comprehensive prompt for generating the complete UI:

### What v0.dev Will Generate
1. **Landing Page** - Hero, features, connect button
2. **Dashboard Layout** - Navigation, header, responsive tabs
3. **6 Tab Screens**:
   - Home (balance, transactions, quick actions)
   - Credit (score display, borrow/repay forms, income verification)
   - Agents (agent grid, deployment, management)
   - Marketplace (e-commerce + food, shopping cart)
   - Demo (contract testing, activity log)
   - Settings (preferences, network config)
4. **30+ Components** - Buttons, cards, modals, forms, charts
5. **wagmi Integration** - Multi-wallet connection provider
6. **Animations** - Framer Motion page transitions
7. **Responsive Design** - Mobile, tablet, desktop layouts

### How to Use
1. Open `/V0_PROMPT.md`
2. Copy entire content
3. Paste into [v0.dev](https://v0.dev)
4. Download generated code
5. Replace files in `frontend/src/`
6. Install suggested dependencies
7. Test and customize

The prompt is production-ready and includes all specifications for a professional DeFi platform.

## 🚀 Deployment

### Backend
Deploy to any Node.js hosting:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Deploy from App Platform
- **AWS**: EC2 or Elastic Beanstalk

Required environment variables:
```bash
PORT=3001
PRIVATE_KEY=your_wallet_private_key
VLAYER_CLIENT_ID=your_client_id
VLAYER_AUTH_TOKEN=your_auth_token
SHARDEUM_RPC=https://api-mezame.shardeum.org
```

### Frontend
Deploy to Vercel (recommended):
```bash
cd frontend
npm run build
vercel --prod
```

Or use Netlify, Cloudflare Pages, or any static host.

Required environment variables:
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_CHAIN_ID=8119
NEXT_PUBLIC_RPC_URL=https://api-mezame.shardeum.org
```

### Smart Contracts
Already configured for Shardeum Mezame testnet. For mainnet deployment, update `hardhat.config.cjs` with mainnet RPC URL.

## 🔐 Security

- ✅ Environment variables for all sensitive data
- ✅ Never commit `.env` files
- ✅ Private keys stored securely
- ✅ API keys rotated regularly
- ✅ CORS configured for frontend origin
- ✅ Rate limiting recommended for production
- ✅ ZK proofs for privacy-preserving verification

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill backend
lsof -ti:3001 | xargs kill -9

# Kill frontend
lsof -ti:3000 | xargs kill -9
```

### Contract Compilation Errors
```bash
cd backend
npx hardhat clean
npm run compile
```

### Missing Dependencies
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### MetaMask Not Connecting
1. Check if Shardeum network is added to MetaMask
2. Add manually:
   - Network Name: Shardeum Mezame
   - RPC URL: https://api-mezame.shardeum.org
   - Chain ID: 8119
   - Currency Symbol: SHM
   - Block Explorer: https://explorer-mezame.shardeum.org/

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Issues**: Open an issue on GitHub
- **Documentation**: Check README files in `/backend` and `/frontend`
- **Network**: Use [Shardeum Discord](https://discord.gg/shardeum) for testnet issues
- **v0.dev**: Visit [v0.dev documentation](https://v0.dev/docs) for UI generation help

---

**Built with ❤️ using Next.js, Shardeum, vlayer, and Vouch**

# Cred-Fi: Complete DeFi Credit Platform

A decentralized finance (DeFi) credit platform built on the Shardeum blockchain that combines zero-knowledge verification, AI agent wallets, and flexible credit lines for transparent financial access.

## 🌟 Features

### Zero-Knowledge Verification
- Prove creditworthiness without revealing sensitive financial information
- Privacy-preserving income and asset verification
- Secure on-chain proof generation using vlayer technology

### AI Agent Wallets
- **DeFi Trader**: Autonomous trading execution on decentralized exchanges
- **Yield Optimizer**: Automated yield farming and protocol selection
- **Payment Router**: Intelligent payment routing for cost optimization
- **Shopping Assistant**: Smart spending management within credit limits

### Flexible Credit Lines
- Uncollateralized lending based on credit scores
- Dynamic credit limits calculated from wallet activity and balance
- Transparent APR rates (3-12% depending on risk tier)
- Instant approval process

### Real-time Dashboard
- Live wallet balance and transaction history
- Credit score calculation based on on-chain activity
- Active agent management and performance tracking
- Portfolio overview and analytics

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Web3**: wagmi for wallet connections, ethers.js for blockchain interaction
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js with Express.js
- **Blockchain**: Shardeum Mezame Testnet (Chain ID: 8119)
- **Web3 Library**: ethers.js for RPC calls
- **Smart Contracts**: Solidity with Hardhat for development

### Blockchain
- **Network**: Shardeum Mezame (testnet)
- **Token**: SHM (Shardeum)
- **RPC**: https://api-mezame.shardeum.org

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or pnpm package manager
- MetaMask or compatible Web3 wallet
- Shardeum Mezame testnet configured in wallet (Chain ID: 8119)
- SHM testnet tokens (get from [faucet](https://faucet-mezame.shardeum.org/))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cred-fi.git
cd cred-fi
```

### 2. Frontend Setup
See [frontend/README.md](./frontend/README.md) for detailed frontend setup instructions.

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Backend Setup
See [backend/README.md](./backend/README.md) for detailed backend setup instructions.

```bash
cd backend
npm install
npm start
# Runs on http://localhost:3001
```

## 📁 Project Structure

```
cred-fi/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   │   ├── dashboard/       # Protected dashboard pages
│   │   │   ├── agents/      # AI agents management
│   │   │   ├── credit/      # Credit management
│   │   │   ├── marketplace/ # Marketplace
│   │   │   └── settings/    # User settings
│   │   ├── page.tsx         # Landing page
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── modals/          # Modal dialogs
│   │   └── ui/              # UI primitives (shadcn/ui)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and helpers
│   ├── public/              # Static assets
│   ├── styles/              # Global styles
│   └── README.md            # Frontend documentation
│
├── backend/                 # Express.js backend
│   ├── contracts/           # Solidity smart contracts
│   │   ├── FlexCreditCore.sol
│   │   ├── AgentWallet.sol
│   │   ├── AgentPolicy.sol
│   │   ├── IncomeProofVerifier.sol
│   │   └── AgentPerformanceVerifier.sol
│   ├── scripts/             # Deployment scripts
│   ├── server.js            # Express server
│   ├── test-integrations.js # Integration tests
│   ├── hardhat.config.cjs   # Hardhat configuration
│   ├── package.json
│   └── README.md            # Backend documentation
│
└── README.md               # This file
```

## 🔌 API Endpoints

### User Data
- `GET /api/user/:address` - Get user data by wallet address
  - Returns: balance, creditScore, availableCredit, activeAgents, transactions, dataSource

### Wallet Analysis
- `POST /api/wallet-analysis/:address` - Detailed wallet analysis
  - Returns: comprehensive credit analysis with risk tier and lending capacity

### Transfers
- `POST /api/transfer` - Process token transfers
  - Body: `{ from, to, amount, items }`

### Health
- `GET /health` - Server health check

## 💡 Key Concepts

### Credit Score Calculation
```
activityScore = min(100, (transactionCount / 10) * 100)
balanceScore = min(100, walletBalance * 10)
creditScore = floor((activityScore * 0.6) + (balanceScore * 0.4))
```

Score is weighted 60% on transaction activity and 40% on wallet balance.

### Available Credit
```
baseLendingCapacity = walletBalance * 0.5
activityBonus = (transactionCount / 100) * 100
availableCredit = max(100, baseLendingCapacity + activityBonus)
```

Minimum available credit is 100 SHM, with additional capacity based on activity.

### Risk Tiers
- **Excellent** (score ≥ 80): 3% APR
- **Good** (score ≥ 60): 5% APR
- **Fair** (score ≥ 40): 8% APR
- **Building** (score < 40): 12% APR

## 🔗 Wallet Integration

### Supported Wallets
- MetaMask
- WalletConnect
- Coinbase Wallet

### Network Configuration
When connecting, ensure your wallet is set to:
- **Network Name**: Shardeum Mezame
- **Chain ID**: 8119
- **RPC URL**: https://api-mezame.shardeum.org
- **Currency**: SHM

## 📊 Dashboard Features

### Home Page
- Real-time wallet balance fetched from blockchain
- Dynamic credit score calculation
- Available credit display
- Active agents count
- Recent transaction history from blockchain

### Agents Page
- Deploy AI agents for automated operations
- Monitor agent status (Active/Paused)
- View agent reputation and performance metrics
- Set daily transaction limits per agent
- Educational explanation of agent types

### Credit Page
- View credit history and utilization
- Borrow and repay transaction management
- Interest calculation details
- Credit score breakdown

### Settings Page
- Dynamic wallet address display and copy functionality
- Network information and chain details
- Notification preferences
- Privacy and security settings
- Wallet disconnect functionality

## 🧪 Features

### Real-time Data Updates
- **Wallet Balance**: Fetched directly from Shardeum blockchain
- **Transaction History**: Retrieved from blockchain with fallback mock data
- **Credit Score**: Calculated based on actual on-chain metrics
- **Dynamic Content**: All data updates when wallet changes

### Error Handling
- Graceful fallback to mock data when blockchain is unavailable
- User-friendly error messages
- Retry mechanisms for failed requests
- Timeout protection for RPC calls

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Any Node.js hosting)
```bash
cd backend
npm run build
npm start
```

Ensure environment variables are set in production.

## 🔒 Security Features

1. **Zero-Knowledge Proofs**: Private verification without data exposure
2. **Smart Contract Audits**: Formal verification of contract logic
3. **Rate Limiting**: API endpoint protection
4. **Input Validation**: Strict validation on all inputs
5. **Secure Wallet Integration**: Non-custodial wallet connections
6. **Environment Variables**: Sensitive data in .env files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

## 🔄 Project Status

- ✅ Frontend Dashboard: Complete
- ✅ Backend API: Complete
- ✅ Wallet Integration: Complete
- ✅ Real-time Data Fetching: Complete
- ✅ Settings and Account Management: Complete
- 🔄 Smart Contracts: In Development
- 🔄 Advanced Analytics: In Development

## 📞 Contact

- **Email**: support@cred-fi.com
- **Twitter**: @CredFiDeFi
- **Discord**: [Join Community](https://discord.gg/credfidefi)

---

**Built on Shardeum - Enterprise-Grade Blockchain** 🚀
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

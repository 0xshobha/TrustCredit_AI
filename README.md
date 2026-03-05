# 🏆 TrustCredit AI

<p align="center">
  <img src="public/logo.png" alt="TrustCredit AI Logo" width="120" />
</p>

<p align="center">
  <strong>AI-powered decentralized credit scoring for real-world lending on Creditcoin.</strong>
</p>

<p align="center">
  <a href="https://ecliptic-magnetar.vercel.app">🌐 Live Demo</a> ·
  <a href="#architecture">📐 Architecture</a> ·
  <a href="#getting-started">🚀 Getting Started</a> ·
  <a href="docs/deck.html">📄 Project Deck</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Track-DeFi%20%2B%20RWA-06b6d4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Chain-Creditcoin%20EVM-8b5cf6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Trust%20Score-10b981?style=for-the-badge" />
</p>

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live Demo** | [ecliptic-magnetar.vercel.app](https://ecliptic-magnetar.vercel.app) |
| **Project Deck** | [docs/deck.html](docs/deck.html) |
| **Demo Video Script** | [docs/DEMO_VIDEO_SCRIPT.md](docs/DEMO_VIDEO_SCRIPT.md) |

---

## 🔍 Problem

**1.7 billion people** worldwide cannot access loans — not because they're untrustworthy, but because they lack:
- ❌ Credit history
- ❌ Bank accounts
- ❌ Financial records

Traditional credit systems are **centralized, biased, and exclud** billions. Freelancers, gig workers, small farmers, and people in developing countries are systematically rejected.

## 💡 Solution

**TrustCredit AI** creates a decentralized trust-based lending system on Creditcoin by combining:

| Component | What It Does |
|-----------|-------------|
| 🧠 **AI Credit Scoring** | Analyzes wallet activity, transactions, DeFi participation to generate Trust Score (0-1000) |
| 🔗 **On-Chain Reputation** | Peer endorsements, DAO memberships, employer attestations stored on-chain |
| 💰 **Smart Contract Lending** | Score-gated loans with tiered interest rates (3-12%) enforced by smart contracts |
| 🌍 **Global Access** | No bank account needed — just a wallet to build credit and access fair loans |

---

## <a id="architecture"></a>📐 Architecture

```
┌─────────────────┐
│   User Wallet    │
│   (RainbowKit)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Next.js Frontend│────▶│  API Routes      │
│  5 Premium Pages │     │  /api/credit-score│
│  Dark Glass UI   │     │  /api/loans       │
└────────┬────────┘     │  /api/reputation  │
         │               └────────┬─────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│  AI Credit Score │     │  TrustLoan.sol   │
│  Engine          │     │  (Creditcoin EVM)│
│  Trust Score     │     │  - Profiles      │
│  0 - 1000        │     │  - Lending       │
└─────────────────┘     │  - Reputation    │
                         └─────────────────┘
```

### Trust Score Formula

```
Score = Wallet Activity    (30%) → max 300 points
      + Repayment History  (40%) → max 400 points
      + Staking / DeFi     (20%) → max 200 points
      + Reputation Score   (10%) → max 100 points
      ───────────────────────────────────────────
      = Trust Score         0 – 1000
```

### Interest Rate Tiers

| Score Range | Rate | Risk Level | Max Loan |
|-------------|------|------------|----------|
| 900+ | 3.0% | Low | $7,500 |
| 800-899 | 4.5% | Low | $5,000 |
| 700-799 | 6.0% | Medium | $3,500 |
| 600-699 | 8.0% | Medium | $2,000 |
| 500-599 | 10.0% | High | $1,000 |
| 400-499 | 12.0% | Very High | $500 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TailwindCSS, TypeScript |
| **Wallet** | RainbowKit, wagmi, viem |
| **Smart Contract** | Solidity 0.8.20, Hardhat |
| **Blockchain** | Creditcoin EVM (Testnet/Mainnet) |
| **AI Engine** | TypeScript credit scoring module |
| **Deployment** | Vercel (frontend), Hardhat (contracts) |

---

## 📁 Project Structure

```
TrustCredit_AI/
├── app/
│   ├── api/
│   │   ├── credit-score/     # AI scoring endpoint
│   │   ├── loans/            # Loan management
│   │   └── reputation/       # Attestation system
│   ├── dashboard/            # Borrower dashboard
│   ├── credit-score/         # Score breakdown
│   ├── apply-loan/           # Loan application
│   ├── lender-dashboard/     # Lender portfolio
│   ├── layout.tsx            # Root layout + Navbar
│   ├── page.tsx              # Landing page
│   ├── providers.tsx         # RainbowKit + wagmi
│   └── globals.css           # Design system
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── ScoreGauge.tsx        # Animated SVG gauge
│   ├── StatsCard.tsx         # Stats display card
│   └── LoanCard.tsx          # Loan details card
├── contracts/
│   └── TrustLoan.sol         # Main lending contract
├── ai-engine/
│   └── credit-score.ts       # AI scoring engine
├── scripts/
│   └── deploy.js             # Contract deployment
├── docs/
│   ├── deck.html             # Project deck
│   └── DEMO_VIDEO_SCRIPT.md  # Demo video guide
├── hardhat.config.js
└── README.md
```

---

## <a id="getting-started"></a>🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/0xshobha/TrustCredit_AI.git
cd TrustCredit_AI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Smart Contract Deployment

```bash
# Compile
npx hardhat compile

# Deploy to Creditcoin Testnet
PRIVATE_KEY=your_key npx hardhat run scripts/deploy.js --network creditcoinTestnet

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

---

## ✨ Key Features

- **🧠 AI Credit Scoring** — Weighted analysis of 4 on-chain factors
- **📊 Animated Score Gauge** — Real-time SVG visualization with grade display
- **💰 Score-Gated Lending** — Smart contract enforces minimum trust thresholds
- **📈 Tiered Interest Rates** — Better scores = lower rates (3-12%)
- **🔗 On-Chain Reputation** — Peer endorsements stored on Creditcoin
- **👛 Wallet Connect** — RainbowKit with Creditcoin Testnet
- **🎨 Premium Dark UI** — Glassmorphism, animations, Inter + Outfit fonts
- **📋 Lender Dashboard** — Portfolio management and borrower risk assessment

---

## 🏆 Hackathon Track

**BUIDL CTC Hackathon — DeFi + RWA Track**

This project combines:
- ✅ **DeFi** — Decentralized lending and liquidity pools
- ✅ **RWA** — Real-world credit scoring and financial inclusion
- ✅ **AI** — Machine learning credit analysis
- ✅ **Creditcoin** — Built natively on Creditcoin EVM

---

## 🔮 Future Roadmap

| Phase | Goals |
|-------|-------|
| **Phase 1** (Now) | MVP — AI scoring, smart contract lending, web dashboard |
| **Phase 2** | Real on-chain data, cross-chain portability, mobile app |
| **Phase 3** | ML credit models, DID verification, micro-finance |
| **Phase 4** | Multi-chain, credit score NFTs, regulatory compliance |

---

## 📄 License

MIT License

---

<p align="center">
  <strong>Built with ❤️ for BUIDL CTC Hackathon 2026 · Powered by Creditcoin</strong>
</p>

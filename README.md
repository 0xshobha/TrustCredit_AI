# 🏆 TrustCredit AI

**AI-powered decentralized credit scoring for real-world lending on Creditcoin.**

> Millions of people cannot access loans because they lack credit history, bank accounts, or financial records. TrustCredit AI solves this by using AI + blockchain to create a decentralized trust-based credit system.

---

## 🔗 Problem

Traditional credit systems are centralized and biased. They exclude:
- Freelancers & gig workers
- Small farmers & micro-businesses
- People in developing countries
- Anyone without bank records

## 💡 Solution

**TrustCredit AI** creates a decentralized trust-based lending network on Creditcoin.

Users build **on-chain reputation + AI credit score** using:
- 📊 Wallet activity & transaction patterns
- ✅ Repayment history
- 🎯 Staking & DeFi participation
- ⭐ Peer reputation attestations

Then lenders can safely provide loans through smart contracts.

## 🏗️ Architecture

```
User Wallet
     ↓
AI Credit Score Engine (Trust Score 0-1000)
     ↓
Creditcoin Smart Contract (TrustLoan.sol)
     ↓
Loan Offer (Score-gated, tiered interest rates)
```

### Trust Score Formula

```
Score = Wallet Activity (30%)
      + Repayment History (40%)
      + Staking Balance (20%)
      + Reputation Score (10%)
```

### Interest Rate Tiers

| Score Range | Interest Rate | Risk Level |
|-------------|--------------|------------|
| 900+        | 3.0%         | Low        |
| 800-899     | 4.5%         | Low        |
| 700-799     | 6.0%         | Medium     |
| 600-699     | 8.0%         | Medium     |
| 500-599     | 10.0%        | High       |
| 400-499     | 12.0%        | Very High  |

## 🛠️ Tech Stack

| Layer          | Technology                          |
|---------------|-------------------------------------|
| Frontend      | Next.js 15, TailwindCSS, TypeScript |
| Wallet        | RainbowKit, wagmi, viem             |
| Smart Contract| Solidity 0.8.20, Hardhat            |
| Blockchain    | Creditcoin EVM                      |
| AI Engine     | TypeScript credit scoring module    |

## 📁 Project Structure

```
trustcredit-ai/
├── app/
│   ├── api/
│   │   ├── credit-score/     # AI scoring endpoint
│   │   ├── loans/            # Loan management
│   │   └── reputation/       # Attestation system
│   ├── dashboard/            # Borrower dashboard
│   ├── credit-score/         # Score breakdown
│   ├── apply-loan/           # Loan application
│   ├── lender-dashboard/     # Lender portfolio
│   ├── layout.tsx
│   ├── page.tsx              # Landing page
│   └── globals.css           # Design system
├── components/
│   ├── Navbar.tsx
│   ├── ScoreGauge.tsx        # Animated score gauge
│   ├── StatsCard.tsx
│   └── LoanCard.tsx
├── contracts/
│   └── TrustLoan.sol         # Main lending contract
├── ai-engine/
│   └── credit-score.ts       # AI scoring engine
├── scripts/
│   └── deploy.js             # Contract deployment
└── hardhat.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trustcredit-ai.git
cd trustcredit-ai

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Creditcoin Testnet
npx hardhat run scripts/deploy.js --network creditcoinTestnet
```

## ✨ Features

- **🧠 AI Credit Scoring** — Weighted analysis of on-chain data
- **🔗 On-Chain Reputation** — Peer endorsements stored on blockchain
- **💰 Score-Gated Lending** — Smart contracts enforce trust thresholds
- **📊 Live Dashboard** — Real-time score tracking and loan management
- **🌍 Global Access** — No bank account needed

## 🔮 Future Vision

- Global decentralized credit bureau
- Cross-chain lending protocol
- Identity verification integration
- Micro-finance for developing countries
- Mobile-first wallet app

## 📄 License

MIT License

---

**Built with ❤️ for the Creditcoin Hackathon 2026**

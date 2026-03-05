/**
 * TrustCredit AI — Credit Scoring Engine
 *
 * Computes a Trust Score (0–1000) from on-chain and off-chain signals.
 * Weights:
 *   - Wallet Activity    30%
 *   - Repayment History  40%
 *   - Staking / DeFi     20%
 *   - Reputation         10%
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface WalletData {
    address: string;
    walletAgeDays: number;
    totalTransactions: number;
    totalVolume: number;          // in USD equivalent
    uniqueInteractions: number;   // unique contract / address interactions
    avgTransactionValue: number;
}

export interface RepaymentData {
    totalLoans: number;
    repaidLoans: number;
    defaultedLoans: number;
    onTimeRepayments: number;
    lateRepayments: number;
    totalBorrowed: number;
    totalRepaid: number;
}

export interface StakingData {
    stakingBalance: number;       // in USD
    defiPositions: number;        // number of active DeFi positions
    liquidityProvided: number;    // in USD
    yieldEarned: number;
}

export interface ReputationData {
    attestationCount: number;
    endorsements: number;
    daoMemberships: number;
    socialScore: number;          // 0 – 100
}

export interface CreditScoreResult {
    score: number;                // 0 – 1000
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    riskCategory: 'Low' | 'Medium' | 'High' | 'Very High';
    defaultProbability: number;   // 0 – 1
    loanLimit: number;            // recommended max loan in USD
    interestRate: number;         // annual % rate
    breakdown: ScoreBreakdown;
    recommendations: string[];
}

export interface ScoreBreakdown {
    walletActivity: number;       // 0 – 300
    repaymentHistory: number;     // 0 – 400
    stakingBalance: number;       // 0 – 200
    reputation: number;           // 0 – 100
}

// ─── Scoring Weights ──────────────────────────────────────────────────

const WEIGHTS = {
    walletActivity: 0.30,
    repaymentHistory: 0.40,
    stakingBalance: 0.20,
    reputation: 0.10,
} as const;

// ─── Sub-Score Calculators ────────────────────────────────────────────

function calculateWalletActivityScore(data: WalletData): number {
    let score = 0;

    // Wallet age (max 80 pts) — logarithmic curve, rewards older wallets
    const ageFactor = Math.min(data.walletAgeDays / 365, 3); // cap at 3 years
    score += ageFactor * 26.67;

    // Transaction count (max 80 pts)
    const txFactor = Math.min(data.totalTransactions / 500, 1);
    score += txFactor * 80;

    // Volume (max 70 pts) — logarithmic
    const volumeFactor = Math.min(Math.log10(data.totalVolume + 1) / 5, 1);
    score += volumeFactor * 70;

    // Unique interactions (max 70 pts) — diversity matters
    const diversityFactor = Math.min(data.uniqueInteractions / 50, 1);
    score += diversityFactor * 70;

    return Math.min(Math.round(score), 300);
}

function calculateRepaymentScore(data: RepaymentData): number {
    if (data.totalLoans === 0) {
        // No loan history — neutral score
        return 150;
    }

    let score = 0;

    // Repayment ratio (max 200 pts) — most critical factor
    const repaymentRatio = data.repaidLoans / data.totalLoans;
    score += repaymentRatio * 200;

    // On-time vs late (max 100 pts)
    const totalRepayments = data.onTimeRepayments + data.lateRepayments;
    if (totalRepayments > 0) {
        const onTimeRatio = data.onTimeRepayments / totalRepayments;
        score += onTimeRatio * 100;
    }

    // Default penalty (deduct up to 100 pts)
    const defaultRatio = data.defaultedLoans / data.totalLoans;
    score -= defaultRatio * 100;

    // Volume borrowed & repaid bonus (max 100 pts)
    if (data.totalBorrowed > 0) {
        const repaidRatio = Math.min(data.totalRepaid / data.totalBorrowed, 1.5);
        score += repaidRatio * 66.67;
    }

    return Math.max(0, Math.min(Math.round(score), 400));
}

function calculateStakingScore(data: StakingData): number {
    let score = 0;

    // Staking balance (max 80 pts) — logarithmic
    const stakeFactor = Math.min(Math.log10(data.stakingBalance + 1) / 4, 1);
    score += stakeFactor * 80;

    // DeFi positions count (max 40 pts)
    const positionFactor = Math.min(data.defiPositions / 5, 1);
    score += positionFactor * 40;

    // Liquidity provided (max 50 pts)
    const liqFactor = Math.min(Math.log10(data.liquidityProvided + 1) / 4, 1);
    score += liqFactor * 50;

    // Yield earned (max 30 pts)
    const yieldFactor = Math.min(data.yieldEarned / 1000, 1);
    score += yieldFactor * 30;

    return Math.min(Math.round(score), 200);
}

function calculateReputationScore(data: ReputationData): number {
    let score = 0;

    // Attestations (max 30 pts)
    score += Math.min(data.attestationCount * 5, 30);

    // Endorsements (max 30 pts)
    score += Math.min(data.endorsements * 6, 30);

    // DAO memberships (max 20 pts)
    score += Math.min(data.daoMemberships * 10, 20);

    // Social score (max 20 pts)
    score += (data.socialScore / 100) * 20;

    return Math.min(Math.round(score), 100);
}

// ─── Risk Assessment ──────────────────────────────────────────────────

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 800) return 'A';
    if (score >= 650) return 'B';
    if (score >= 500) return 'C';
    if (score >= 350) return 'D';
    return 'F';
}

function getRiskCategory(score: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    if (score >= 750) return 'Low';
    if (score >= 550) return 'Medium';
    if (score >= 350) return 'High';
    return 'Very High';
}

function getDefaultProbability(score: number): number {
    // Inverse sigmoid mapping: higher score → lower default probability
    const normalized = score / 1000;
    return Math.round((1 - Math.pow(normalized, 1.5)) * 100) / 100;
}

function getLoanLimit(score: number): number {
    if (score < 400) return 0;
    if (score < 500) return 500;
    if (score < 600) return 1000;
    if (score < 700) return 2000;
    if (score < 800) return 3500;
    if (score < 900) return 5000;
    return 7500;
}

function getInterestRate(score: number): number {
    if (score >= 900) return 3.0;
    if (score >= 800) return 4.5;
    if (score >= 700) return 6.0;
    if (score >= 600) return 8.0;
    if (score >= 500) return 10.0;
    return 12.0;
}

function getRecommendations(score: number, breakdown: ScoreBreakdown): string[] {
    const recs: string[] = [];

    if (breakdown.walletActivity < 150) {
        recs.push('Increase on-chain activity to improve your wallet activity score.');
    }
    if (breakdown.repaymentHistory < 200) {
        recs.push('Build repayment history by taking and repaying small loans on time.');
    }
    if (breakdown.stakingBalance < 100) {
        recs.push('Stake tokens or provide liquidity to boost your DeFi participation score.');
    }
    if (breakdown.reputation < 50) {
        recs.push('Get endorsements from peers and join DAOs to improve your reputation.');
    }
    if (score < 400) {
        recs.push('Your score is below the minimum threshold. Focus on all areas to qualify for a loan.');
    }
    if (score >= 700) {
        recs.push('Great score! You qualify for premium interest rates.');
    }

    return recs;
}

// ─── Main Scoring Function ───────────────────────────────────────────

export function calculateCreditScore(
    wallet: WalletData,
    repayment: RepaymentData,
    staking: StakingData,
    reputation: ReputationData
): CreditScoreResult {
    const breakdown: ScoreBreakdown = {
        walletActivity: calculateWalletActivityScore(wallet),
        repaymentHistory: calculateRepaymentScore(repayment),
        stakingBalance: calculateStakingScore(staking),
        reputation: calculateReputationScore(reputation),
    };

    const totalScore = Math.min(
        breakdown.walletActivity +
        breakdown.repaymentHistory +
        breakdown.stakingBalance +
        breakdown.reputation,
        1000
    );

    return {
        score: totalScore,
        grade: getGrade(totalScore),
        riskCategory: getRiskCategory(totalScore),
        defaultProbability: getDefaultProbability(totalScore),
        loanLimit: getLoanLimit(totalScore),
        interestRate: getInterestRate(totalScore),
        breakdown,
        recommendations: getRecommendations(totalScore, breakdown),
    };
}

// ─── Mock Data Generator (for demo) ──────────────────────────────────

export function generateMockWalletData(address: string): WalletData {
    // Deterministic-ish mock based on address hash
    const hash = address.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const seed = (hash % 100) / 100;

    return {
        address,
        walletAgeDays: Math.floor(180 + seed * 900),
        totalTransactions: Math.floor(50 + seed * 450),
        totalVolume: Math.floor(5000 + seed * 95000),
        uniqueInteractions: Math.floor(10 + seed * 60),
        avgTransactionValue: Math.floor(100 + seed * 500),
    };
}

export function generateMockRepaymentData(): RepaymentData {
    return {
        totalLoans: 5,
        repaidLoans: 4,
        defaultedLoans: 0,
        onTimeRepayments: 4,
        lateRepayments: 1,
        totalBorrowed: 8000,
        totalRepaid: 8500,
    };
}

export function generateMockStakingData(): StakingData {
    return {
        stakingBalance: 3500,
        defiPositions: 3,
        liquidityProvided: 2000,
        yieldEarned: 350,
    };
}

export function generateMockReputationData(): ReputationData {
    return {
        attestationCount: 4,
        endorsements: 3,
        daoMemberships: 1,
        socialScore: 65,
    };
}

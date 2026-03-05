'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ScoreGauge from '@/components/ScoreGauge';
import StatsCard from '@/components/StatsCard';
import LoanCard from '@/components/LoanCard';

interface ScoreData {
    score: number;
    grade: string;
    riskCategory: string;
    defaultProbability: number;
    loanLimit: number;
    interestRate: number;
    breakdown: {
        walletActivity: number;
        repaymentHistory: number;
        stakingBalance: number;
        reputation: number;
    };
    recommendations: string[];
}

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const walletAddress = address || '0x742d35Cc6634C0532925a3b844Bc9e7595f6F4e2';

                const [scoreRes, loansRes] = await Promise.all([
                    fetch('/api/credit-score', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: walletAddress }),
                    }),
                    fetch('/api/loans'),
                ]);

                const scoreJson = await scoreRes.json();
                const loansJson = await loansRes.json();

                setScoreData(scoreJson);
                setLoans(loansJson.loans || []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [address]);

    const displayAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '0x742d...F4e2';

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '60px', display: 'inline-block' }}>
                    <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Analyzing your on-chain data...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    Welcome back, <span className="gradient-text">{displayAddress}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {isConnected ? 'Your wallet is connected.' : 'Connect your wallet for personalized data.'} Here&apos;s your credit overview.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-grid stagger-children" style={{ marginBottom: '32px' }}>
                <StatsCard
                    icon="📊"
                    label="Trust Score"
                    value={scoreData?.score || 0}
                    subtitle={`Grade ${scoreData?.grade || 'N/A'}`}
                    accentColor="cyan"
                />
                <StatsCard
                    icon="💰"
                    label="Loan Limit"
                    value={`$${(scoreData?.loanLimit || 0).toLocaleString()}`}
                    subtitle="Maximum eligible"
                    accentColor="emerald"
                />
                <StatsCard
                    icon="📈"
                    label="Interest Rate"
                    value={`${scoreData?.interestRate || 0}%`}
                    subtitle="Annual rate"
                    accentColor="purple"
                />
                <StatsCard
                    icon="🛡️"
                    label="Risk Level"
                    value={scoreData?.riskCategory || 'N/A'}
                    subtitle={`${((scoreData?.defaultProbability || 0) * 100).toFixed(1)}% default prob.`}
                    accentColor={scoreData?.riskCategory === 'Low' ? 'emerald' : scoreData?.riskCategory === 'Medium' ? 'amber' : 'rose'}
                />
            </div>

            {/* Score Gauge + Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ScoreGauge score={scoreData?.score || 0} grade={scoreData?.grade} />
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <span
                            className="stat-badge"
                            style={{
                                background: scoreData?.riskCategory === 'Low' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: scoreData?.riskCategory === 'Low' ? '#10b981' : '#f59e0b',
                                fontSize: '0.85rem',
                                padding: '6px 16px',
                            }}
                        >
                            {scoreData?.riskCategory} Risk
                        </span>
                    </div>
                </div>

                <div className="glass-card animate-slide-in-right" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'var(--text-primary)' }}>
                        Score Breakdown
                    </h3>

                    {scoreData?.breakdown && (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { label: 'Wallet Activity', value: scoreData.breakdown.walletActivity, max: 300, color: '#06b6d4' },
                                { label: 'Repayment History', value: scoreData.breakdown.repaymentHistory, max: 400, color: '#10b981' },
                                { label: 'Staking / DeFi', value: scoreData.breakdown.stakingBalance, max: 200, color: '#8b5cf6' },
                                { label: 'Reputation', value: scoreData.breakdown.reputation, max: 100, color: '#f59e0b' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>
                                            {item.value} / {item.max}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${(item.value / item.max) * 100}%`,
                                                background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recommendations */}
                    {scoreData?.recommendations && scoreData.recommendations.length > 0 && (
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
                                💡 AI Recommendations
                            </h4>
                            {scoreData.recommendations.map((rec, i) => (
                                <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', paddingLeft: '12px', borderLeft: '2px solid var(--border-accent)' }}>
                                    {rec}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Active Loans */}
            <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Active Loans</h2>
                {loans.length === 0 ? (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No active loans. Apply for your first loan!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {loans.map((loan: any) => (
                            <LoanCard
                                key={loan.id}
                                id={loan.id}
                                amount={loan.amount}
                                currency={loan.currency}
                                interestRate={loan.interestRate}
                                status={loan.status}
                                dueDate={loan.dueDate}
                                repayAmount={loan.repayAmount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

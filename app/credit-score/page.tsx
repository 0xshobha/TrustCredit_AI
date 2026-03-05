'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ScoreGauge from '@/components/ScoreGauge';

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

const factorDetails = [
    {
        key: 'walletActivity',
        label: 'Wallet Activity',
        max: 300,
        weight: '30%',
        color: '#06b6d4',
        icon: '📊',
        metrics: ['Wallet age & maturity', 'Transaction count & frequency', 'Total volume traded', 'Unique address interactions'],
    },
    {
        key: 'repaymentHistory',
        label: 'Repayment History',
        max: 400,
        weight: '40%',
        color: '#10b981',
        icon: '✅',
        metrics: ['Loans repaid on time', 'Default rate', 'Total borrowed vs repaid', 'Late payment frequency'],
    },
    {
        key: 'stakingBalance',
        label: 'Staking & DeFi',
        max: 200,
        weight: '20%',
        color: '#8b5cf6',
        icon: '🎯',
        metrics: ['Active staking balance', 'DeFi positions held', 'Liquidity provided', 'Yield earned historically'],
    },
    {
        key: 'reputation',
        label: 'Reputation',
        max: 100,
        weight: '10%',
        color: '#f59e0b',
        icon: '⭐',
        metrics: ['Peer attestations', 'Employer endorsements', 'DAO memberships', 'Social verification score'],
    },
];

export default function CreditScorePage() {
    const { address } = useAccount();
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScore() {
            try {
                const walletAddress = address || '0x742d35Cc6634C0532925a3b844Bc9e7595f6F4e2';
                const res = await fetch('/api/credit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: walletAddress }),
                });
                const data = await res.json();
                setScoreData(data);
            } catch (err) {
                console.error('Failed to fetch score:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchScore();
    }, [address]);

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '60px', display: 'inline-block' }}>
                    <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '16px' }}>🧠</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>AI analyzing your credit profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div className="animate-fade-in-up" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    Your <span className="gradient-text">Trust Score</span> Analysis
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Detailed breakdown of your AI-generated credit score and improvement tips.
                </p>
            </div>

            {/* Top Row: Gauge + Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ScoreGauge score={scoreData?.score || 0} size={240} grade={scoreData?.grade} />

                    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Risk</p>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: scoreData?.riskCategory === 'Low' ? '#10b981' : '#f59e0b' }}>
                                {scoreData?.riskCategory}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Default Prob.</p>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {((scoreData?.defaultProbability || 0) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Score Summary</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '24px' }}>
                        Your Trust Score of <strong style={{ color: 'var(--accent-cyan)' }}>{scoreData?.score}</strong> places you in the{' '}
                        <strong style={{ color: scoreData?.riskCategory === 'Low' ? '#10b981' : '#f59e0b' }}>{scoreData?.riskCategory} Risk</strong> category.
                        You qualify for loans up to <strong style={{ color: '#10b981' }}>${(scoreData?.loanLimit || 0).toLocaleString()} USDC</strong> at{' '}
                        <strong style={{ color: '#8b5cf6' }}>{scoreData?.interestRate}% APR</strong>.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#10b981' }}>
                                ${(scoreData?.loanLimit || 0).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Loan Limit</p>
                        </div>
                        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#8b5cf6' }}>
                                {scoreData?.interestRate}%
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Annual Rate</p>
                        </div>
                        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#06b6d4' }}>
                                {scoreData?.grade}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Credit Grade</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Factor Detail Cards */}
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>
                Score <span className="gradient-text">Factors</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }} className="stagger-children">
                {factorDetails.map((factor) => {
                    const value = scoreData?.breakdown[factor.key as keyof typeof scoreData.breakdown] || 0;
                    const pct = (value / factor.max) * 100;

                    return (
                        <div key={factor.key} className="glass-card" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{factor.icon}</span>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{factor.label}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weight: {factor.weight}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: factor.color }}>
                                    {value}/{factor.max}
                                </span>
                            </div>

                            <div className="progress-bar" style={{ marginBottom: '16px' }}>
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${factor.color}, ${factor.color}88)` }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                {factor.metrics.map((m, i) => (
                                    <p key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: factor.color }}>•</span> {m}
                                    </p>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recommendations */}
            {scoreData?.recommendations && scoreData.recommendations.length > 0 && (
                <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                        🤖 AI Improvement Recommendations
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {scoreData.recommendations.map((rec, i) => (
                            <div key={i} style={{
                                padding: '14px 20px',
                                background: 'rgba(6, 182, 212, 0.05)',
                                borderLeft: '3px solid var(--accent-cyan)',
                                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                            }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

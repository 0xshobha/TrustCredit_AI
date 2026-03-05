'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ApplyLoanPage() {
    const { address } = useAccount();
    const [amount, setAmount] = useState(1000);
    const [duration, setDuration] = useState(90);
    const [trustScore, setTrustScore] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [loanLimit, setLoanLimit] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScore() {
            try {
                const addr = address || '0x742d35Cc6634C0532925a3b844Bc9e7595f6F4e2';
                const res = await fetch('/api/credit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: addr }),
                });
                const data = await res.json();
                setTrustScore(data.score);
                setInterestRate(data.interestRate);
                setLoanLimit(data.loanLimit);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchScore();
    }, [address]);

    const repayAmount = amount + (amount * interestRate / 100);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/loans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ borrower: address || '0x742d...F4e2', amount, duration, trustScore }),
            });
            setResult(await res.json());
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '60px', display: 'inline-block' }}>
                    <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading loan eligibility...</p>
                </div>
            </div>
        );
    }

    if (result?.success) {
        return (
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
                <div className="glass-card animate-fade-in-up" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Loan <span className="gradient-text-success">Approved!</span></h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your loan is pending lender funding.</p>
                    <div className="glass-card" style={{ padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AMOUNT</p><p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{result.loan.amount} CTC</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTEREST</p><p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>{result.loan.interestRate}%</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>REPAY</p><p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{result.loan.repayAmount} CTC</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DUE DATE</p><p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{result.loan.dueDate}</p></div>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => setResult(null)}>Apply for Another Loan</button>
                </div>
            </div>
        );
    }

    const tiers = [
        { range: '900+', rate: '3%', active: trustScore >= 900 },
        { range: '800-899', rate: '4.5%', active: trustScore >= 800 && trustScore < 900 },
        { range: '700-799', rate: '6%', active: trustScore >= 700 && trustScore < 800 },
        { range: '600-699', rate: '8%', active: trustScore >= 600 && trustScore < 700 },
        { range: '500-599', rate: '10%', active: trustScore >= 500 && trustScore < 600 },
        { range: '400-499', rate: '12%', active: trustScore >= 400 && trustScore < 500 },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Apply for a <span className="gradient-text">Loan</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Your trust score determines your rate and limit.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '36px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '28px' }}>Loan Configuration</h3>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label className="form-label" style={{ margin: 0 }}>Loan Amount</label>
                            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: '#06b6d4' }}>{amount.toLocaleString()} CTC</span>
                        </div>
                        <input type="range" min={100} max={loanLimit || 5000} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(loanLimit || 5000).toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label className="form-label" style={{ margin: 0 }}>Duration</label>
                            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: '#8b5cf6' }}>{duration} days</span>
                        </div>
                        <input type="range" min={30} max={365} step={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                    </div>

                    <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '28px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600 }}>Summary</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Rate</p><p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>{interestRate}%</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Repay</p><p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{repayAmount.toLocaleString()} CTC</p></div>
                            <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Monthly</p><p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#06b6d4' }}>{(repayAmount / (duration / 30)).toFixed(0)} CTC</p></div>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={handleSubmit} disabled={submitting || trustScore < 400}
                        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', opacity: submitting || trustScore < 400 ? 0.5 : 1 }}>
                        {submitting ? '⏳ Processing...' : trustScore < 400 ? '🔒 Score Too Low' : '🚀 Submit Loan Request'}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Your Trust Score</p>
                        <p style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: trustScore >= 700 ? '#10b981' : '#f59e0b' }}>{trustScore}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600 }}>Rate Tiers</h4>
                        {tiers.map((t, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                background: t.active ? 'rgba(6,182,212,0.1)' : 'transparent', border: t.active ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent', marginBottom: '4px'
                            }}>
                                <span style={{ fontSize: '0.85rem', color: t.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{t.range}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: t.active ? '#06b6d4' : 'var(--text-muted)' }}>{t.rate}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

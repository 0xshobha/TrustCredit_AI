'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';

export default function LenderDashboard() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLoans() {
            try {
                const res = await fetch('/api/loans');
                const data = await res.json();
                setLoans(data.loans || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchLoans();
    }, []);

    const totalVolume = loans.reduce((a, l) => a + l.amount, 0);
    const activeLoans = loans.filter(l => l.status === 'Active');
    const totalInterest = loans.reduce((a, l) => a + (l.repayAmount - l.amount), 0);
    const avgScore = loans.length ? Math.round(loans.reduce((a, l) => a + l.trustScore, 0) / loans.length) : 0;

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '60px', display: 'inline-block' }}>
                    <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading lender portfolio...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    Lender <span className="gradient-text">Dashboard</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your liquidity pool, review borrower risk, and track earnings.
                </p>
            </div>

            {/* Stats */}
            <div className="dashboard-grid stagger-children" style={{ marginBottom: '32px' }}>
                <StatsCard icon="💰" label="Total Lent" value={`${totalVolume.toLocaleString()} CTC`} subtitle="Across all loans" accentColor="cyan" />
                <StatsCard icon="📈" label="Interest Earned" value={`${totalInterest.toLocaleString()} CTC`} subtitle="Total earnings" accentColor="emerald" />
                <StatsCard icon="📋" label="Active Loans" value={activeLoans.length} subtitle={`of ${loans.length} total`} accentColor="purple" />
                <StatsCard icon="⭐" label="Avg Borrower Score" value={avgScore} subtitle="Portfolio quality" accentColor="amber" />
            </div>

            {/* Deposit Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Deposit Liquidity</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="form-label">Amount (CTC)</label>
                        <input type="number" className="form-input" placeholder="Enter amount to deposit" defaultValue={5000} />
                    </div>
                    <button className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                        💰 Deposit to Pool
                    </button>
                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your Deposits</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>12,500 CTC</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pool Share</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4' }}>24.8%</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Withdraw Earnings</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="form-label">Amount (CTC)</label>
                        <input type="number" className="form-input" placeholder="Enter amount to withdraw" defaultValue={1000} />
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                        📤 Withdraw
                    </button>
                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6' }}>4,200 CTC</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Locked in Active Loans</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>8,300 CTC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Borrower Table */}
            <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Loan Portfolio</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Borrower</th>
                                <th>Amount</th>
                                <th>Rate</th>
                                <th>Trust Score</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td>#{loan.id}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{loan.borrower}</td>
                                    <td style={{ fontWeight: 600 }}>{loan.amount.toLocaleString()} CTC</td>
                                    <td style={{ color: '#8b5cf6' }}>{loan.interestRate}%</td>
                                    <td>
                                        <span className={`stat-badge ${loan.trustScore >= 700 ? 'low' : loan.trustScore >= 500 ? 'medium' : 'high'}`}>
                                            {loan.trustScore}
                                        </span>
                                    </td>
                                    <td>{loan.dueDate}</td>
                                    <td>
                                        <span className={`stat-badge ${loan.status === 'Active' ? 'low' : loan.status === 'Repaid' ? 'low' : 'high'}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

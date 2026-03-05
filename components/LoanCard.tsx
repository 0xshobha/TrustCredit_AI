interface LoanCardProps {
    id: number;
    amount: number;
    currency: string;
    interestRate: number;
    status: string;
    dueDate: string;
    repayAmount: number;
}

const statusStyles: Record<string, { bg: string; color: string }> = {
    Active: { bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' },
    Approved: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    Repaid: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    Requested: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    Defaulted: { bg: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' },
    Liquidated: { bg: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' },
};

export default function LoanCard({ id, amount, currency, interestRate, status, dueDate, repayAmount }: LoanCardProps) {
    const statusStyle = statusStyles[status] || statusStyles.Active;

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Loan #{id}
                </span>
                <span
                    className="stat-badge"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                    ● {status}
                </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    {amount.toLocaleString()} {currency}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    at {interestRate}% interest
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Due Date
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {dueDate}
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Repay Amount
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                        {repayAmount.toLocaleString()} {currency}
                    </p>
                </div>
            </div>
        </div>
    );
}

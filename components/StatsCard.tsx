interface StatsCardProps {
    icon: string;
    label: string;
    value: string | number;
    subtitle?: string;
    accentColor?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose';
}

const accentColorMap = {
    cyan: { bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' },
    emerald: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    purple: { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' },
    amber: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    rose: { bg: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' },
};

export default function StatsCard({ icon, label, value, subtitle, accentColor = 'cyan' }: StatsCardProps) {
    const accent = accentColorMap[accentColor];

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        {label}
                    </p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: accent.color }}>
                        {value}
                    </p>
                    {subtitle && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: accent.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

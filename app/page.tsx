'use client';

import Link from 'next/link';

const features = [
  {
    icon: '🧠',
    iconClass: 'cyan',
    title: 'AI Credit Scoring',
    desc: 'Our AI analyzes wallet activity, transaction patterns, and DeFi history to generate a Trust Score from 0-1000.',
  },
  {
    icon: '🔗',
    iconClass: 'purple',
    title: 'On-Chain Reputation',
    desc: 'Build verifiable reputation through peer endorsements, DAO membership, and employer attestations — all stored on-chain.',
  },
  {
    icon: '💰',
    iconClass: 'emerald',
    title: 'DeFi Lending',
    desc: 'Access score-gated loans with competitive interest rates. Higher trust scores unlock better terms and larger limits.',
  },
  {
    icon: '🌍',
    iconClass: 'amber',
    title: 'Global Access',
    desc: 'No bank account needed. Anyone with a wallet can build credit history and access fair lending on Creditcoin.',
  },
];

const stats = [
  { value: '$2.4M', label: 'Total Volume Lent' },
  { value: '12,500+', label: 'Trust Scores Generated' },
  { value: '94%', label: 'Repayment Rate' },
  { value: '45+', label: 'Countries Served' },
];

const steps = [
  { num: '01', title: 'Connect Wallet', desc: 'Link your wallet to begin building your on-chain credit profile.' },
  { num: '02', title: 'AI Analyzes Data', desc: 'Our AI engine evaluates your transaction history, DeFi activity, and reputation.' },
  { num: '03', title: 'Get Trust Score', desc: 'Receive your Trust Score (0-1000) with detailed breakdown and recommendations.' },
  { num: '04', title: 'Access Loans', desc: 'Apply for loans with interest rates that reflect your trustworthiness.' },
];

export default function Home() {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="hero-section" id="hero">
        <div style={{ position: 'relative', zIndex: 1 }} className="animate-fade-in-up">
          <div className="hero-badge">
            <span>⚡</span>
            <span>Built on Creditcoin — Powering Real-World Credit</span>
          </div>

          <h1 className="hero-title">
            <span style={{ color: 'var(--text-primary)' }}>Decentralized</span>{' '}
            <span className="gradient-text">AI Credit Scoring</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>for Everyone</span>
          </h1>

          <p className="hero-subtitle">
            Build your on-chain reputation. Access fair credit globally.
            No bank account needed — just your wallet and our AI.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <button className="btn-primary" id="cta-get-started" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                🚀 Get Your Trust Score
              </button>
            </Link>
            <Link href="/lender-dashboard">
              <button className="btn-secondary" id="cta-lender" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                💎 Start Lending
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{ maxWidth: '1200px', margin: '-40px auto 60px', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="glass-card" style={{ padding: '32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }} className="stagger-children">
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }} className="gradient-text">
                  {s.value}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }} id="features">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            Why <span className="gradient-text">TrustCredit AI</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Combining artificial intelligence with blockchain to create a fair, transparent credit system.
          </p>
        </div>

        <div className="feature-grid stagger-children">
          {features.map((f, i) => (
            <div key={i} className="glass-card feature-card">
              <div className={`feature-icon ${f.iconClass}`}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px' }} id="how-it-works">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            How It <span className="gradient-text-success">Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            From wallet connect to loan approval in four simple steps.
          </p>
        </div>

        <div className="stagger-children" style={{ display: 'grid', gap: '20px' }}>
          {steps.map((step, i) => (
            <div key={i} className="glass-card" style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '1.2rem',
                flexShrink: 0,
              }}>
                {step.num}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div className="glass-card animate-pulse-glow" style={{ padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
          <div className="glow-orb cyan" style={{ top: '-80px', right: '-80px' }} />
          <div className="glow-orb purple" style={{ bottom: '-60px', left: '-60px' }} />

          <h2 style={{ fontSize: '2rem', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            Ready to Build Your{' '}
            <span className="gradient-text">Credit Future</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px', position: 'relative', zIndex: 1 }}>
            Join thousands of people worldwide who are building decentralized credit history with TrustCredit AI.
          </p>
          <Link href="/dashboard" style={{ position: 'relative', zIndex: 1 }}>
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 40px' }}>
              Get Started Now →
            </button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <p className="gradient-text" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
          TrustCredit AI
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Decentralized credit scoring powered by AI on Creditcoin.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
          © 2026 TrustCredit AI. Built for Creditcoin Hackathon.
        </p>
      </footer>
    </div>
  );
}

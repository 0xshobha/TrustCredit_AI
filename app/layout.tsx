import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TrustCredit AI — Decentralized Credit Scoring on Creditcoin',
  description: 'AI-powered decentralized credit scoring for real-world lending on Creditcoin. Build your on-chain reputation and access fair credit globally.',
  keywords: 'credit scoring, DeFi, lending, Creditcoin, AI, blockchain, trust score',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="page-container">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

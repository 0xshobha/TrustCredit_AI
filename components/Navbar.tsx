'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/credit-score', label: 'Credit Score' },
    { href: '/apply-loan', label: 'Apply Loan' },
    { href: '/lender-dashboard', label: 'Lender' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="navbar" id="main-navbar">
            <Link href="/" className="navbar-brand">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
                    <path d="M10 18C10 13.58 13.58 10 18 10C22.42 10 26 13.58 26 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M12 22C12 19.24 14.24 17 17 17H19C21.76 17 24 19.24 24 22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <circle cx="18" cy="24" r="2.5" fill="white" />
                    <defs>
                        <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
                            <stop stopColor="#06b6d4" />
                            <stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="navbar-brand-text">TrustCredit AI</span>
            </Link>

            <ul className="navbar-links">
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus="avatar"
            />
        </nav>
    );
}

import { NextResponse } from 'next/server';
import {
    calculateCreditScore,
    generateMockWalletData,
    generateMockRepaymentData,
    generateMockStakingData,
    generateMockReputationData,
} from '../../../ai-engine/credit-score';

export async function POST(request: Request) {
    try {
        const { address } = await request.json();

        if (!address) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        // In production, fetch real on-chain data here
        const walletData = generateMockWalletData(address);
        const repaymentData = generateMockRepaymentData();
        const stakingData = generateMockStakingData();
        const reputationData = generateMockReputationData();

        const result = calculateCreditScore(walletData, repaymentData, stakingData, reputationData);

        return NextResponse.json({
            success: true,
            address,
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to calculate credit score' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: 'TrustCredit AI - Credit Score Engine',
        version: '1.0.0',
        status: 'active',
    });
}

import { NextResponse } from 'next/server';

// Simulated loan database
const loansDB: any[] = [
    {
        id: 1,
        borrower: '0x742d...F4e2',
        amount: 1500,
        currency: 'CTC',
        interestRate: 6.0,
        duration: 90,
        status: 'Active',
        trustScore: 742,
        startDate: '2025-12-01',
        dueDate: '2026-03-01',
        repayAmount: 1590,
    },
    {
        id: 2,
        borrower: '0x8f3a...B1c9',
        amount: 800,
        currency: 'CTC',
        interestRate: 8.0,
        duration: 60,
        status: 'Repaid',
        trustScore: 615,
        startDate: '2025-10-15',
        dueDate: '2025-12-15',
        repayAmount: 864,
    },
    {
        id: 3,
        borrower: '0x1d4e...A7f3',
        amount: 3000,
        currency: 'CTC',
        interestRate: 4.5,
        duration: 180,
        status: 'Active',
        trustScore: 821,
        startDate: '2026-01-10',
        dueDate: '2026-07-10',
        repayAmount: 3135,
    },
];

export async function GET() {
    return NextResponse.json({
        success: true,
        loans: loansDB,
        totalActive: loansDB.filter((l) => l.status === 'Active').length,
        totalRepaid: loansDB.filter((l) => l.status === 'Repaid').length,
        totalVolume: loansDB.reduce((acc, l) => acc + l.amount, 0),
    });
}

export async function POST(request: Request) {
    try {
        const { borrower, amount, duration, trustScore } = await request.json();

        if (!borrower || !amount || !duration) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (trustScore < 400) {
            return NextResponse.json({
                success: false,
                error: 'Trust score too low. Minimum 400 required.',
                trustScore,
            }, { status: 403 });
        }

        // Calculate interest rate based on score
        let interestRate = 12;
        if (trustScore >= 900) interestRate = 3;
        else if (trustScore >= 800) interestRate = 4.5;
        else if (trustScore >= 700) interestRate = 6;
        else if (trustScore >= 600) interestRate = 8;
        else if (trustScore >= 500) interestRate = 10;

        const repayAmount = amount + (amount * interestRate / 100);
        const startDate = new Date().toISOString().split('T')[0];
        const dueDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const newLoan = {
            id: loansDB.length + 1,
            borrower,
            amount,
            currency: 'CTC',
            interestRate,
            duration,
            status: 'Approved',
            trustScore,
            startDate,
            dueDate,
            repayAmount: Math.round(repayAmount * 100) / 100,
        };

        loansDB.push(newLoan);

        return NextResponse.json({
            success: true,
            message: 'Loan approved!',
            loan: newLoan,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process loan request' }, { status: 500 });
    }
}

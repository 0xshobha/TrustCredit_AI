import { NextResponse } from 'next/server';

const attestationsDB: any[] = [
    {
        id: 1,
        attester: '0x9a2b...C3d4',
        subject: '0x742d...F4e2',
        type: 'employer',
        message: 'Reliable freelancer — completed 12 projects on time.',
        timestamp: '2025-11-20T10:30:00Z',
    },
    {
        id: 2,
        attester: '0xf1e2...D5a6',
        subject: '0x742d...F4e2',
        type: 'dao',
        message: 'Active member of CreditDAO — contributed to 3 governance proposals.',
        timestamp: '2025-12-05T14:15:00Z',
    },
    {
        id: 3,
        attester: '0x3b4c...E7f8',
        subject: '0x742d...F4e2',
        type: 'peer',
        message: 'Trustworthy community member with excellent track record.',
        timestamp: '2026-01-12T09:45:00Z',
    },
];

export async function GET() {
    return NextResponse.json({
        success: true,
        attestations: attestationsDB,
        totalCount: attestationsDB.length,
    });
}

export async function POST(request: Request) {
    try {
        const { attester, subject, type, message } = await request.json();

        if (!attester || !subject || !type || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (attester === subject) {
            return NextResponse.json({ error: 'Cannot attest yourself' }, { status: 400 });
        }

        const newAttestation = {
            id: attestationsDB.length + 1,
            attester,
            subject,
            type,
            message,
            timestamp: new Date().toISOString(),
        };

        attestationsDB.push(newAttestation);

        return NextResponse.json({
            success: true,
            attestation: newAttestation,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit attestation' }, { status: 500 });
    }
}

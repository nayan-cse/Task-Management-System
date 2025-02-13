import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

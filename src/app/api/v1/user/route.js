import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth'; // verifyToken function to decode JWT
import { query } from '../../../lib/mysql';

export async function GET(req) {
    try {
        const decoded = verifyToken(req); // Token validation

        if (decoded.error) {
            return NextResponse.json({ error: decoded.error }, { status: 401 });
        }

        const userId = decoded ? .id;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid token or missing user ID.' }, { status: 400 });
        }

        const [user] = await query('SELECT id, email, username FROM users WHERE id = ?', [userId]);

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

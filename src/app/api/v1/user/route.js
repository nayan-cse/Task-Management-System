import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import { query } from '../../../lib/mysql';

export async function GET(req) {
    try {
        // Use the verifyToken function to decode the token and extract user information
        const decoded = verifyToken(req); // This will return an error response if the token is invalid
        if (decoded.error) {
            return NextResponse.json({ error: decoded.error }, { status: 401 });
        }

        const userId = decoded ? .id;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid token or missing user ID.' }, { status: 400 });
        }

        // Query the user from the database using the extracted userId
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

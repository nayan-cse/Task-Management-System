import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

export async function POST(req) {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
        return NextResponse.json({ error: 'Refresh token is required.' }, { status: 400 });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refresh_token, JWT_SECRET);

        // Create a new access token using the decoded information
        const accessToken = jwt.sign({
                id: decoded.id, // Using the decoded token info (user ID, email, etc.)
                email: decoded.email,
                username: decoded.username,
            },
            JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION } // Setting expiration for the new access token
        );

        return NextResponse.json({ accessToken, message: 'New access token issued!' }, { status: 200 });
    } catch (err) {
        console.error(err); // Log error for debugging
        return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401 });
    }
}

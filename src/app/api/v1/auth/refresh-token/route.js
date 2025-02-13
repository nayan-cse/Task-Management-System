import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION;

export async function POST(req) {
    // Get the refresh token from the request body (or cookies)
    const { refresh_token } = await req.json();

    if (!refresh_token) {
        return NextResponse.json({ error: 'Refresh token is required.' }, { status: 400 });
    }

    try {
        // Verify the refresh token (decodes the refresh token)
        const decoded = jwt.verify(refresh_token, JWT_SECRET);

        // Generate a new access token using the information from the refresh token
        const accessToken = jwt.sign({ id: decoded.id, email: decoded.email },
            JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION } // Access token expiration time (e.g., 1 hour)
        );

        // Return the new access token
        return NextResponse.json({ accessToken, message: 'New access token issued!' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 400 });
    }
}
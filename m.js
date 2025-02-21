import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
export function middleware(req) {

    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
        return NextResponse.json({ error: 'Authorization token required.' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {

        return NextResponse.json({ error: 'Token is missing in the Authorization header.' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);


        req.user = decoded;

        return NextResponse.next();
    } catch (err) {
        return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }
}

export const config = {
    matcher: ['/api/user', '/api/auth/login'],
};

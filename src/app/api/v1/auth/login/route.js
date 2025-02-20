import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/mysql';
import { NextResponse } from 'next/server';
import logger from '../../../../lib/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        logger.error('Login failed: Email or password missing');
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    try {
        const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            logger.warn(`Login failed: User with email ${email} not found`);
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn(`Login failed: Incorrect password for email ${email}`);
            return NextResponse.json({ error: 'Incorrect password.' }, { status: 400 });
        }

        logger.info(`User ${email} logged in successfully`);
        const accessToken = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });

        const headers = {
            'Set-Cookie': `refresh_token=${refreshToken}; HttpOnly; Max-Age=${JWT_REFRESH_TOKEN_EXPIRATION}; Path=/; Secure; SameSite=Strict`,
        };

        return NextResponse.json({ accessToken, refreshToken, message: 'Login successful!' }, { status: 200, headers });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// src/app/api/v1/auth/register/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/mysql';
import { NextResponse } from 'next/server';
import logger from '../../../../lib/logger'; // Import the logger

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
        logger.error('Registration failed: Missing required fields');
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    try {
        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            logger.warn(`Registration failed: User with email ${email} already exists`);
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [
            email,
            username,
            hashedPassword,
        ]);

        const token = jwt.sign({ id: result.insertId, email, username }, JWT_SECRET, { expiresIn: '1h' });
        logger.info(`User ${email} registered successfully`);

        return NextResponse.json({ token, message: 'User registered successfully!' }, { status: 201 });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
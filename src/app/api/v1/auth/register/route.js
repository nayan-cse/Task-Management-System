import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/mysql';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Ensure email check is optimized by only retrieving necessary fields
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
        return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }

    // Consider reducing bcrypt work factor if performance is critical
    const hashedPassword = await bcrypt.hash(password, 10); // 10 or 11 as a balance between speed and security

    // Optimizing insert operation
    const result = await query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [
        email,
        username,
        hashedPassword,
    ]);

    const token = jwt.sign({ id: result.insertId, email, username }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, message: 'User registered successfully!' }, { status: 201 });
}

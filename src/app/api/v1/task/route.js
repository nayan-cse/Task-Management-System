import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';

export async function POST(req) {
    const { title, description, due_date, assigned_user } = await req.json();

    if (!title || !description || !due_date || !assigned_user) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const result = await query(
        'INSERT INTO tasks (title, description, due_date, assigned_user) VALUES (?, ?, ?, ?)', [title, description, due_date, assigned_user]
    );

    return NextResponse.json({ message: 'Task created successfully', taskId: result.insertId });
}

export async function GET(req) {
    const tasks = await query('SELECT * FROM tasks');
    return NextResponse.json({ tasks });
}

import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';

export async function POST(req) {
    const { title, description, due_date, assigned_user } = await req.json();

    if (!title || !description || !due_date || !assigned_user) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    try {
        const result = await query(
            'INSERT INTO tasks (title, description, due_date, assigned_user) VALUES (?, ?, ?, ?)', [title, description, due_date, assigned_user]
        );

        return NextResponse.json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (error) {
        console.error('Error during task creation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();
    const tasks = await query('SELECT * FROM tasks WHERE id = ?', [id]);
    return NextResponse.json({ tasks });
}

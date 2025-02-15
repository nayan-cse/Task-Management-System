import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';
import { verifyToken } from '../../../lib/auth';
import logger from '../../../lib/logger';

export async function POST(req) {
    const { title, description, due_date, assigned_user } = await req.json();

    const user = verifyToken(req);
    if (user instanceof NextResponse) return user;
    if (!title || !description || !due_date || !assigned_user) {
        logger.error('Task creation failed: Missing required fields');
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    try {
        const result = await query(
            'INSERT INTO tasks (title, description, due_date, assigned_user, user_id) VALUES (?, ?, ?, ?, ?)', [title, description, due_date, assigned_user, user.id]
        );

        logger.info(`Task created successfully for user ${user.id}. Task ID: ${result.insertId}`);
        return NextResponse.json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (error) {
        logger.error(`Task creation error: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


export async function GET(req) {
    const user = verifyToken(req);
    if (user instanceof NextResponse) return user; // If the token verification fails, return the error response

    try {
        const tasks = await query('SELECT tasks.* FROM tasks JOIN users ON users.id = tasks.user_id WHERE tasks.user_id = ?', [user.id]);

        if (tasks.length === 0) {
            logger.warn(`No tasks found for user ${user.id}`);
            return NextResponse.json({ error: 'Your Task is empty.' }, { status: 404 });
        }

        logger.info(`Successfully retrieved tasks for user ${user.id}`);
        return NextResponse.json({ tasks });
    } catch (error) {
        logger.error(`Error during task retrieval for user ${user.id}: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
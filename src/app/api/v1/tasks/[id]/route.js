import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysql';

export async function PUT(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    const { title, description, due_date, status } = await req.json();

    if (!title && !description && !due_date && !status) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    try {
        const result = await query(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, updated_at = NOW() WHERE id = ?', [title, description, due_date, status, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error during task update:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    try {
        const result = await query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error during task deletion:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


export async function GET(req) {
    const user = verifyToken(req);
    if (user instanceof NextResponse) return user; // If the token verification fails, return the error response

    try {
        const tasks = await query('SELECT tasks.* FROM tasks JOIN users ON users.id = tasks.user_id WHERE tasks.user_id = ?', [user.id]);
        if (tasks.length === 0) {
            return NextResponse.json({ error: 'Your Task is empty.' }, { status: 404 });
        }
        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Error during task retrieval:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysql';
import logger from '../../../../lib/logger';

// PUT Method: Update task by ID
export async function PUT(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    const { title, description, due_date, status } = await req.json();

    if (!title && !description && !due_date && !status) {
        logger.warn(`Task update failed: No fields provided for task ${id}`);
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    try {
        const result = await query(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, updated_at = NOW() WHERE id = ?', [title, description, due_date, status, id]
        );

        if (result.affectedRows === 0) {
            logger.warn(`Task update failed: Task with ID ${id} not found`);
            return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
        }

        logger.info(`Task with ID ${id} updated successfully`);
        return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
        logger.error(`Task update error for task ${id}: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE Method: Delete task by ID
export async function DELETE(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    try {
        const result = await query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            logger.warn(`Task deletion failed: Task with ID ${id} not found`);
            return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
        }

        logger.info(`Task with ID ${id} deleted successfully`);
        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error(`Error during task deletion for task ID ${id}: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET Method: Retrieve task by ID
export async function GET(req) {
    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    const user = verifyToken(req);
    if (user instanceof NextResponse) return user;

    try {
        const tasks = await query('SELECT * FROM tasks WHERE user_id = ? AND id = ?', [user.id, id]);

        if (tasks.length === 0) {
            logger.warn(`Task with ID ${id} not found for user ${user.id}`);
            return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
        }

        logger.info(`Successfully retrieved task for user ${user.id} with ID ${id}`);
        return NextResponse.json({ task: tasks[0] });
    } catch (error) {
        logger.error(`Error during task retrieval for user ${user.id} with ID ${id}: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

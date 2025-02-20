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
    if (user instanceof NextResponse) return user;

    // Extract page and limit from query params, with default values
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 25;

    // Ensure the limit and page are positive integers
    if (page <= 0 || limit <= 0) {
        logger.error(`Invalid pagination parameters: page=${page}, limit=${limit}`);
        return NextResponse.json({ error: 'Invalid pagination parameters.' }, { status: 400 });
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Log the parameters to make sure they are valid
    logger.info(`User ID: ${user.id}, Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    try {
        // Convert limit and offset to strings to ensure proper type handling
        const tasks = await query(
            'SELECT * FROM tasks WHERE user_id = ? LIMIT ? OFFSET ?', [user.id, limit.toString(), offset.toString()]
        );

        // Count the total number of tasks for pagination
        const totalTasksResult = await query(
            'SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?', [user.id]
        );
        const totalTasks = totalTasksResult[0].total;
        const totalPages = Math.ceil(totalTasks / limit);

        // Check if the page exceeds the total number of available tasks
        if (page > totalPages && totalTasks > 0) {
            return NextResponse.json({ error: 'Page exceeds the total number of tasks.' }, { status: 400 });
        }

        if (tasks.length === 0) {
            logger.warn(`No tasks found for user ${user.id} on page ${page}`);
            return NextResponse.json({
                tasks: [],
                page,
                limit,
                totalTasks,
                totalPages,
                message: 'No tasks found.'
            });
        }

        logger.info(`Successfully retrieved tasks for user ${user.id} on page ${page}`);
        return NextResponse.json({
            tasks,
            page,
            limit,
            totalTasks,
            totalPages,
        });
    } catch (error) {
        logger.error(`Error during task retrieval for user ${user.id}: ${error.message}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

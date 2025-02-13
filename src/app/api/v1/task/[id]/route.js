import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysql';

export async function PUT(req) {

    const url = req.nextUrl.pathname;
    const id = url.split('/').pop();

    const { title, description, due_date, status } = await req.json();

    if (!title && !description && !due_date && !status) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }


    const result = await query(
        'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, updated_at = NOW() WHERE id = ?', [title, description, due_date, status, id]
    );

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully' });
}

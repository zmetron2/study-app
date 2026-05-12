import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      if (process.env.NODE_ENV !== 'development') throw e;
    }
    const env = context?.env;
    const db = env?.DB;
    if (!db) {
      return NextResponse.json({ success: false, message: 'No DB binding' }, { status: 500 });
    }

    const { results } = await db.prepare('SELECT * FROM vibe_students ORDER BY joined_at DESC').all();
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      if (process.env.NODE_ENV !== 'development') throw e;
    }
    const env = context?.env;
    const db = env?.DB;
    if (!db) {
      return NextResponse.json({ success: false, message: 'No DB binding' }, { status: 500 });
    }

    const body = await request.json() as {
      name: string;
      email: string;
      phone: string;
      course: string;
      status?: string;
      memo?: string;
      password?: string;
    };

    await db.prepare(
      'INSERT INTO vibe_students (name, email, phone, course, status, memo, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(body.name, body.email, body.phone, body.course, body.status || 'active', body.memo || null, body.password || null).run();

    return NextResponse.json({ success: true, message: 'Student added' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      if (process.env.NODE_ENV !== 'development') throw e;
    }
    const env = context?.env;
    const db = env?.DB;
    if (!db) {
      return NextResponse.json({ success: false, message: 'No DB binding' }, { status: 500 });
    }

    const body = await request.json() as { 
      id: number; 
      name?: string;
      email?: string;
      phone?: string;
      course?: string;
      progress?: number; 
      status?: string;
      memo?: string;
      password?: string;
    };

    if (body.progress !== undefined) {
      await db.prepare('UPDATE vibe_students SET progress = ? WHERE id = ?')
        .bind(body.progress, body.id)
        .run();
    }

    if (body.status !== undefined && !body.name) { // Legacy single update
        await db.prepare('UPDATE vibe_students SET status = ? WHERE id = ?')
          .bind(body.status, body.id)
          .run();
    }

    // Full Update
    if (body.name) {
        await db.prepare('UPDATE vibe_students SET name = ?, email = ?, phone = ?, course = ?, status = ?, memo = ?, password = ? WHERE id = ?')
          .bind(body.name, body.email, body.phone, body.course, body.status, body.memo, body.password, body.id)
          .run();
    }

    return NextResponse.json({ success: true, message: 'Student updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      if (process.env.NODE_ENV !== 'development') throw e;
    }
    const env = context?.env;
    const db = env?.DB;
    if (!db) {
      return NextResponse.json({ success: false, message: 'No DB binding' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    await db.prepare('DELETE FROM vibe_students WHERE id = ?').bind(Number(id)).run();

    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

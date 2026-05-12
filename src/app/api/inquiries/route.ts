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

    const { results } = await db.prepare(
      'SELECT id, name, email, phone, title, category, message, status, completed_at, created_at FROM vibe_inquiries ORDER BY created_at DESC'
    ).all();
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
      name: unknown;
      email: unknown;
      phone?: unknown;
      title?: unknown;
      category?: unknown;
      message: unknown;
    };

    if (typeof body.name !== 'string' || typeof body.message !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid data type' }, { status: 400 });
    }

    const email = typeof body.email === 'string' && body.email.trim() !== '' ? body.email : '';
    const phone = typeof body.phone === 'string' ? body.phone : null;
    const title = typeof body.title === 'string' ? body.title : null;
    const category = typeof body.category === 'string' ? body.category : '일반문의';

    await db.prepare(
      'INSERT INTO vibe_inquiries (name, email, phone, title, category, message) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(body.name, email, phone, title, category, body.message).run();

    return NextResponse.json({ success: true, message: 'Inquiry submitted' });
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

    const body = await request.json() as { id: unknown; status: unknown };

    if (typeof body.id !== 'number' || typeof body.status !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    // 완료 처리 시 completed_at 기록, 되돌릴 때는 NULL
    const completedAt = body.status === 'completed' ? new Date().toISOString() : null;

    await db.prepare('UPDATE vibe_inquiries SET status = ?, completed_at = ? WHERE id = ?')
      .bind(body.status, completedAt, body.id)
      .run();

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

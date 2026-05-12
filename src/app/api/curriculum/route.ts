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

    const { results } = await db.prepare('SELECT * FROM vibe_curriculum ORDER BY date_time ASC').all();
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
      title: string;
      date_time?: string;
      location?: string;
      description?: string;
      category?: string;
      status?: string;
    };

    await db.prepare(
      'INSERT INTO vibe_curriculum (title, date_time, location, description, category, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(body.title, body.date_time || null, body.location || null, body.description || null, body.category || null, body.status || 'active').run();

    return NextResponse.json({ success: true, message: 'Curriculum added' });
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
      title?: string;
      date_time?: string;
      location?: string;
      description?: string;
      category?: string;
      status?: string;
    };

    await db.prepare(
      'UPDATE vibe_curriculum SET title = ?, date_time = ?, location = ?, description = ?, category = ?, status = ? WHERE id = ?'
    ).bind(body.title, body.date_time, body.location, body.description, body.category, body.status, body.id).run();

    return NextResponse.json({ success: true, message: 'Curriculum updated' });
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

    await db.prepare('DELETE FROM vibe_curriculum WHERE id = ?').bind(Number(id)).run();

    return NextResponse.json({ success: true, message: 'Curriculum deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

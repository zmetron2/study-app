import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = env.DB;

    if (!db) {
      return NextResponse.json({ 
        success: true, 
        data: [], 
        message: 'Mock response (Local Dev)' 
      });
    }

    const { results } = await db.prepare('SELECT * FROM vibe_resources ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Resources GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = env.DB;
    const body = await request.json() as { 
      title: string; 
      description: string; 
      url: string; 
      category: string; 
      tags: string; 
      provider: string; 
      icon_text: string;
    };

    if (!db) {
      return NextResponse.json({ 
        success: true, 
        data: body, 
        message: 'Mock response (Local Dev)' 
      });
    }

    await db.prepare(
      'INSERT INTO vibe_resources (title, description, url, category, tags, provider, icon_text) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      body.title, 
      body.description, 
      body.url, 
      body.category, 
      body.tags, 
      body.provider, 
      body.icon_text
    ).run();

    return NextResponse.json({ success: true, message: 'Resource added successfully' });
  } catch (error) {
    console.error('Resources POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add resource' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { env } = getRequestContext();
    const db = env.DB;

    if (!id || !db) {
      return NextResponse.json({ success: false, error: 'ID and DB required' }, { status: 400 });
    }

    await db.prepare('DELETE FROM vibe_resources WHERE id = ?').bind(id).run();
    return NextResponse.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    console.error('Resources DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { 
      id: number;
      title: string; 
      description: string; 
      url: string; 
      category: string; 
      tags: string; 
      provider: string; 
      icon_text: string;
    };
    const { env } = getRequestContext();
    const db = env.DB;

    if (!body.id || !db) {
      return NextResponse.json({ success: false, error: 'ID and DB required' }, { status: 400 });
    }

    await db.prepare(
      'UPDATE vibe_resources SET title = ?, description = ?, url = ?, category = ?, tags = ?, provider = ?, icon_text = ? WHERE id = ?'
    ).bind(
      body.title, 
      body.description, 
      body.url, 
      body.category, 
      body.tags, 
      body.provider, 
      body.icon_text,
      body.id
    ).run();

    return NextResponse.json({ success: true, message: 'Resource updated' });
  } catch (error) {
    console.error('Resources PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update resource' }, { status: 500 });
  }
}

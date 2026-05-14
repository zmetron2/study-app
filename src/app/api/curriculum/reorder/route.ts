import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

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

    const { orders } = await request.json() as {
      orders: { id: number; sort_order: number }[];
    };

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ success: false, message: 'Invalid orders data' }, { status: 400 });
    }

    // Batch update sort orders
    const statements = orders.map(item => 
      db.prepare('UPDATE vibe_curriculum SET sort_order = ? WHERE id = ?').bind(item.sort_order, item.id)
    );

    await db.batch(statements);

    return NextResponse.json({ success: true, message: 'Order updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

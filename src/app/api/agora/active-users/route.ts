import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/agora/active-users?channel=vibe-consulting
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');

    const env = getRequestContext().env;
    const db = env.DB;

    // 현재 경과 시간 (과도하게 오래된 낡은 세션은 12시간 기준 제외)
    const twelveHoursAgo = Math.floor(Date.now() / 1000) - (12 * 60 * 60);

    let query = `
      SELECT ip_address, start_ts, uid
      FROM agora_sessions
      WHERE end_ts IS NULL AND start_ts > ?
    `;
    const params: (string | number)[] = [twelveHoursAgo];

    if (channel) {
      query += ` AND channel = ?`;
      params.push(channel);
    }

    query += ` ORDER BY start_ts DESC LIMIT 50`;

    const { results } = await db.prepare(query).bind(...params).all<{ ip_address: string; start_ts: number; uid: string | null }>();

    return NextResponse.json({ ok: true, users: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 });
  }
}

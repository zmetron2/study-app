import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface SessionStartBody {
  action: 'start';
  sessionId: string;
  channel: string;
  uid?: string;
}

interface SessionEndBody {
  action: 'end';
  sessionId: string;
}

type SessionBody = SessionStartBody | SessionEndBody;

// POST /api/agora/session
// action: 'start' | 'end'
export async function POST(request: Request) {
  try {
    const body = await request.json() as SessionBody;
    const { action, sessionId } = body;

    if (!action || !sessionId) {
      return NextResponse.json({ error: 'action과 sessionId가 필요합니다.' }, { status: 400 });
    }

    const env = getRequestContext().env;
    const db = env.DB;

    const nowTs = Math.floor(Date.now() / 1000);

    if (action === 'start') {
      const { channel, uid } = body as SessionStartBody;
      if (!channel) {
        return NextResponse.json({ error: 'channel이 필요합니다.' }, { status: 400 });
      }

      // 기존 세션이 있으면 무시 (중복 start 방지)
      await db.prepare(
        `INSERT OR IGNORE INTO agora_sessions (session_id, channel, uid, start_ts)
         VALUES (?, ?, ?, ?)`
      ).bind(sessionId, channel, uid || null, nowTs).run();

      return NextResponse.json({ ok: true, action: 'start', sessionId, startTs: nowTs });
    }

    if (action === 'end') {
      // 세션 조회
      const row = await db.prepare(
        `SELECT start_ts FROM agora_sessions WHERE session_id = ?`
      ).bind(sessionId).first<{ start_ts: number }>();

      if (!row) {
        return NextResponse.json({ error: '세션을 찾을 수 없습니다.' }, { status: 404 });
      }

      const duration = nowTs - row.start_ts;

      await db.prepare(
        `UPDATE agora_sessions SET end_ts = ?, duration_seconds = ? WHERE session_id = ?`
      ).bind(nowTs, duration, sessionId).run();

      return NextResponse.json({ ok: true, action: 'end', sessionId, durationSeconds: duration });
    }

    return NextResponse.json({ error: '유효하지 않은 action입니다.' }, { status: 400 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 });
  }
}

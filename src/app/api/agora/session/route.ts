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

      // 클라이언트 IP 추출 (Cloudflare headers)
      const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'Unknown IP';

      // ① 같은 IP의 미종료 세션 자동 정리
      // (브라우저 crash, 새로고침 등으로 end 신호 없이 재접속한 경우)
      await db.prepare(
        `UPDATE agora_sessions
         SET end_ts = ?,
             duration_seconds = MIN(? - start_ts, 12 * 60 * 60)
         WHERE ip_address = ?
           AND channel = ?
           AND end_ts IS NULL`
      ).bind(nowTs, nowTs, ipAddress, channel).run();

      // ② 새 세션 삽입 (중복 start 방지)
      await db.prepare(
        `INSERT OR IGNORE INTO agora_sessions (session_id, channel, uid, start_ts, ip_address)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(sessionId, channel, uid || null, nowTs, ipAddress).run();

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

      // ③ 최대 12시간 캡 적용 (비정상 장시간 세션으로 인한 과다 집계 방지)
      const rawDuration = nowTs - row.start_ts;
      const duration = Math.min(rawDuration, 12 * 60 * 60);

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

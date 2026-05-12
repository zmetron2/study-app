import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const env = getRequestContext().env;
    const db = env.DB;

    const nowTs = Math.floor(Date.now() / 1000);

    // ① 고아 세션 자동 만료: 12시간 이상 end_ts가 NULL인 세션을 자동 종료 처리
    // (클라이언트 crash, 브라우저 강제 종료 등으로 end 신호가 안 온 경우)
    const twelveHoursAgo = nowTs - (12 * 60 * 60);
    await db.prepare(
      `UPDATE agora_sessions
       SET end_ts = start_ts + (12 * 60 * 60),
           duration_seconds = (12 * 60 * 60)
       WHERE end_ts IS NULL AND start_ts < ?`
    ).bind(twelveHoursAgo).run();

    // Agora 무료 한도 초기화 기준: 매월 1일 00:00:00 UTC
    const now = new Date();
    const monthStartUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const monthStartTs = Math.floor(monthStartUtc.getTime() / 1000);

    // ② 이번 달 완료된 세션의 총 통화 시간(초) 합산
    const result = await db.prepare(
      `SELECT 
         COALESCE(SUM(duration_seconds), 0) AS total_seconds,
         COUNT(*) AS session_count
       FROM agora_sessions
       WHERE start_ts >= ?
         AND end_ts IS NOT NULL`
    ).bind(monthStartTs).first<{ total_seconds: number; session_count: number }>();

    // ③ 아직 진행 중인 세션 (이번 달, 12시간 미만 → 정상 진행 중)
    const ongoingResult = await db.prepare(
      `SELECT COALESCE(SUM(? - start_ts), 0) AS ongoing_seconds
       FROM agora_sessions
       WHERE start_ts >= ?
         AND end_ts IS NULL`
    ).bind(nowTs, monthStartTs).first<{ ongoing_seconds: number }>();

    const completedSeconds = Math.floor(result?.total_seconds || 0);
    const ongoingSeconds = Math.floor(ongoingResult?.ongoing_seconds || 0);
    const totalSeconds = completedSeconds + ongoingSeconds;

    // ④ Agora 과금 단위: 분 올림(ceiling) — 실제 Agora 콘솔과 동일한 방식
    // Agora는 세션당 소수 분도 1분으로 올림 처리
    const completedSessions = result?.session_count || 0;
    // 세션별 ceil 합산이 이상적이나, 전체 초 합산 후 ceil로 근사
    const totalMinutesCeil = Math.ceil(totalSeconds / 60);

    // Agora 무료 한도: 10,000분/월
    const LIMIT_MINUTES = 10000;
    const percentage = Math.min((totalMinutesCeil / LIMIT_MINUTES) * 100, 100).toFixed(1);

    const nextResetUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    return NextResponse.json({
      totalMinutes: totalMinutesCeil,
      totalSeconds,
      limit: LIMIT_MINUTES,
      percentage,
      sessionCount: completedSessions,
      ongoingSeconds,
      periodStart: monthStartUtc.toISOString().split('T')[0],
      nextReset: nextResetUtc.toISOString().split('T')[0],
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      error: 'Internal Server Error',
      message,
      totalMinutes: 0,
      limit: 10000,
      percentage: '0.0',
    }, { status: 500 });
  }
}

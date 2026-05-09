import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const env = getRequestContext().env;
    const db = env.DB;

    // Agora 무료 한도 초기화 기준: 매월 1일 00:00:00 UTC (실제 Agora 정책과 동일)
    const now = new Date();
    const monthStartUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const monthStartTs = Math.floor(monthStartUtc.getTime() / 1000);

    // 이번 달 완료된 세션의 총 통화 시간(초) 합산
    const result = await db.prepare(
      `SELECT 
         COALESCE(SUM(duration_seconds), 0) AS total_seconds,
         COUNT(*) AS session_count
       FROM agora_sessions
       WHERE start_ts >= ?
         AND end_ts IS NOT NULL`
    ).bind(monthStartTs).first<{ total_seconds: number; session_count: number }>();

    // 진행 중인 세션(end_ts가 NULL)도 현재 경과 시간으로 포함
    const nowTs = Math.floor(Date.now() / 1000);
    const ongoingResult = await db.prepare(
      `SELECT COALESCE(SUM(? - start_ts), 0) AS ongoing_seconds
       FROM agora_sessions
       WHERE start_ts >= ?
         AND end_ts IS NULL`
    ).bind(nowTs, monthStartTs).first<{ ongoing_seconds: number }>();

    const totalSeconds = (result?.total_seconds || 0) + (ongoingResult?.ongoing_seconds || 0);
    const totalMinutes = totalSeconds / 60;

    // Agora 무료 한도: 10,000분/월
    const LIMIT_MINUTES = 10000;
    const percentage = Math.min((totalMinutes / LIMIT_MINUTES) * 100, 100).toFixed(1);

    // 다음 초기화 날짜 (다음 달 1일 UTC)
    const nextResetUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    return NextResponse.json({
      totalMinutes: Math.round(totalMinutes),
      limit: LIMIT_MINUTES,
      percentage,
      sessionCount: result?.session_count || 0,
      periodStart: monthStartUtc.toISOString().split('T')[0],
      nextReset: nextResetUtc.toISOString().split('T')[0],
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      error: 'Internal Server Error',
      message,
      // 오류 시 안전한 기본값 반환 (대시보드 깨짐 방지)
      totalMinutes: 0,
      limit: 10000,
      percentage: '0.0',
    }, { status: 500 });
  }
}

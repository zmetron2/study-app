import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  let CUSTOMER_ID: string | undefined;
  let CUSTOMER_SECRET: string | undefined;
  let APP_ID: string | undefined;

  try {
    const context = getRequestContext();
    const env = context?.env;

    // Cloudflare env bindings 우선, 없으면 process.env (로컬 개발용)
    CUSTOMER_ID = env?.AGORA_CUSTOMER_ID || process.env.AGORA_CUSTOMER_ID;
    CUSTOMER_SECRET = env?.AGORA_CUSTOMER_SECRET || process.env.AGORA_CUSTOMER_SECRET;
    APP_ID = env?.NEXT_PUBLIC_AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID;

    if (!CUSTOMER_ID || !CUSTOMER_SECRET || !APP_ID) {
      console.error('Missing Agora credentials:', { 
        hasId: !!CUSTOMER_ID, 
        hasSecret: !!CUSTOMER_SECRET, 
        hasAppId: !!APP_ID 
      });
      return NextResponse.json({ 
        error: 'Agora credentials not configured',
        details: { hasId: !!CUSTOMER_ID, hasSecret: !!CUSTOMER_SECRET, hasAppId: !!APP_ID }
      }, { status: 500 });
    }

    // Agora Basic Auth 생성
    const credentials = btoa(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`);
    
    // 현재 날짜 기준 이번 달 시작일과 종료일 계산 (YYYY-MM-DD)
    const now = new Date();
    // UTC 기준으로 계산하여 일관성 유지
    const startDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().split('T')[0];
    const endDay = now.toISOString().split('T')[0];

    const url = `https://api.agora.io/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`;
    
    console.log('Fetching Agora usage from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Agora API Error:', response.status, errorText);
      // 구체적인 에러 메시지를 포함하여 반환
      return NextResponse.json({ 
        error: 'Failed to fetch from Agora',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }

    const data: any = await response.json();
    
    // 사용된 총 분량 계산 (비디오 + 오디오 합산)
    let totalMinutes = 0;
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any) => {
        // 비디오(HD, HDP, Full HD 등) 및 오디오 합산
        totalMinutes += (item.video_hd || 0) + (item.video_hdp || 0) + (item.video_full_hd || 0) + (item.audio || 0);
      });
    }

    return NextResponse.json({
      totalMinutes: Math.round(totalMinutes),
      limit: 10000,
      percentage: Math.min(((totalMinutes / 10000) * 100), 100).toFixed(1)
    });

  } catch (error: any) {
    console.error('Agora Usage API Exception:', error.message);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}

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
    CUSTOMER_ID = (env?.AGORA_CUSTOMER_ID || process.env.AGORA_CUSTOMER_ID)?.trim();
    CUSTOMER_SECRET = (env?.AGORA_CUSTOMER_SECRET || process.env.AGORA_CUSTOMER_SECRET)?.trim();
    // APP_ID는 여러 이름을 시도 (NEXT_PUBLIC_ 또는 일반)
    APP_ID = (env?.AGORA_APP_ID || env?.NEXT_PUBLIC_AGORA_APP_ID || process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID)?.trim();

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
    const startDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().split('T')[0];
    const endDay = now.toISOString().split('T')[0];

    // 기본 도메인과 대체 도메인 시도
    const domains = ['api.agora.io', 'api.sd-rtn.com'];
    let lastError: any = null;

    for (const domain of domains) {
      const url = `https://${domain}/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`;
      console.log(`Fetching Agora usage from ${domain}...`);

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data: any = await response.json();
          let totalMinutes = 0;
          if (data.data && Array.isArray(data.data)) {
            data.data.forEach((item: any) => {
              totalMinutes += (item.video_hd || 0) + (item.video_hdp || 0) + (item.video_full_hd || 0) + (item.audio || 0);
            });
          }

          return NextResponse.json({
            totalMinutes: Math.round(totalMinutes),
            limit: 10000,
            percentage: Math.min(((totalMinutes / 10000) * 100), 100).toFixed(1)
          });
        }

        const errorText = await response.text();
        console.error(`Agora API Error from ${domain}:`, response.status, errorText);
        lastError = { status: response.status, details: errorText };
        
        // 404가 아니면 다음 도메인 시도하지 않고 중단 (인증 에러 등)
        if (response.status !== 404) break;

      } catch (e: any) {
        console.error(`Fetch error from ${domain}:`, e.message);
        lastError = { status: 500, details: e.message };
      }
    }

    return NextResponse.json({ 
      error: 'Failed to fetch from Agora after trying all domains',
      status: lastError?.status,
      details: lastError?.details
    }, { status: lastError?.status || 500 });

  } catch (error: any) {
    console.error('Agora Usage API Exception:', error.message);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}

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

    // 시도할 경로 목록
    const paths = [
      `/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      // 일부 리전이나 설정에 따라 다를 수 있는 경로 추가 시도
      `/v1/stats/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`
    ];

    for (const domain of domains) {
      for (const path of paths) {
        const url = `https://${domain}${path}`;
        console.log(`Trying Agora API: ${url}`);

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
          console.error(`Agora API Error (${domain}${path.split('?')[0]}):`, response.status, errorText);
          lastError = { domain, status: response.status, details: errorText };
          
          // 인증 에러면 즉시 중단 (경로 문제가 아님)
          if (response.status === 401 || response.status === 403) break;

        } catch (e: any) {
          console.error(`Fetch error (${domain}):`, e.message);
          lastError = { domain, status: 500, details: e.message };
        }
      }
    }

    // 마스킹된 App ID 준비
    const maskedAppId = APP_ID.substring(0, 4) + '...' + APP_ID.substring(APP_ID.length - 4);

    return NextResponse.json({ 
      error: 'Agora API 호출 실패 (모든 경로 시도 완료)',
      status: lastError?.status,
      details: lastError?.details,
      debug: {
        appId: maskedAppId,
        checkedDomains: domains,
        checkedPaths: paths.map(p => p.split('?')[0]),
        tip: 'Agora 콘솔에서 "Project Management API"가 활성화되어 있는지 확인해 주세요.'
      }
    }, { status: 500 }); // 브라우저가 404로 오해하지 않도록 500으로 반환

  } catch (error: any) {
    console.error('Agora Usage API Exception:', error.message);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}

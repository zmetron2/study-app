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

    // 진단 단계: 프로젝트 목록 조회 시도 (권한 및 App ID 존재 여부 확인)
    let projectsData: any = null;
    try {
      const projectsRes = await fetch('https://api.agora.io/v1/projects', {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      if (projectsRes.ok) {
        projectsData = await projectsRes.json();
      }
    } catch (e) {
      console.error('Diagnostic API call failed:', e);
    }

    // 기본 도메인과 대체 도메인 시도
    const domains = ['api.agora.io', 'api.sd-rtn.com'];
    let lastError: any = null;

    // 시도할 경로 목록
    const paths = [
      `/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/v1/stats/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`
    ];

    for (const domain of domains) {
      for (const path of paths) {
        const url = `https://${domain}${path}`;
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
          lastError = { domain, status: response.status, details: errorText };
          if (response.status === 401 || response.status === 403) break;
        } catch (e: any) {
          lastError = { domain, status: 500, details: e.message };
        }
      }
    }

    // 진단 결과 분석
    const maskedAppId = APP_ID.substring(0, 4) + '...' + APP_ID.substring(APP_ID.length - 4);
    const appIdExists = projectsData?.projects?.some((p: any) => p.vendor_key === APP_ID);
    const availableProjectCount = projectsData?.projects?.length || 0;

    return NextResponse.json({ 
      error: 'Agora API 호출 실패',
      debug: {
        appId: maskedAppId,
        appIdExistsInAccount: appIdExists,
        availableProjectsInAccount: availableProjectCount,
        lastErrorStatus: lastError?.status,
        lastErrorDetails: lastError?.details,
        tip: appIdExists === false 
          ? '현재 App ID가 해당 Customer ID 계정에 존재하지 않습니다. App ID를 다시 확인해 주세요.'
          : 'Agora 콘솔에서 "Project Management API" 권한이 활성화되어 있는지 확인해 주세요.'
      }
    }, { status: 500 });

  } catch (error: any) {
    console.error('Agora Usage API Exception:', error.message);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}

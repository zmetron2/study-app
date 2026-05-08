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

    // Agora Basic Auth 생성 (Buffer를 사용하여 비-ASCII 문자 대응 및 안정성 확보)
    let credentials = '';
    try {
      credentials = Buffer.from(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`).toString('base64');
    } catch (e: any) {
      console.error('Encoding error:', e.message);
      return NextResponse.json({ error: 'Credential encoding failed', details: e.message }, { status: 500 });
    }
    
    // 현재 날짜 기준 이번 달 시작일과 종료일 계산 (YYYY-MM-DD)
    const now = new Date();
    const startDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().split('T')[0];
    const endDay = now.toISOString().split('T')[0];

    // 진단 단계: 프로젝트 목록 조회 시도 (경로 다양화)
    let projectsData: any = null;
    let diagError: string | null = null;
    let successDomain: string | null = null;
    const diagPaths = [
      '/v1/projects', 
      '/v1.0/projects', 
      '/dev/v1/projects',
      '/v1/apps'
    ];
    
    const domains = [
      'api.agora.io', 
      'api.sd-rtn.com', 
      'api-us-west-1.agora.io',
      'api-eu-central-1.agora.io'
    ];

    diagLoop: for (const domain of domains) {
      for (const dPath of diagPaths) {
        try {
          const projectsRes = await fetch(`https://${domain}${dPath}`, {
            headers: { 'Authorization': `Basic ${credentials}` }
          });
          if (projectsRes.ok) {
            projectsData = await projectsRes.json();
            successDomain = domain;
            break diagLoop;
          } else {
            diagError = `Diagnostic (${domain}${dPath}) failed with status ${projectsRes.status}`;
          }
        } catch (e: any) {
          diagError = e.message;
        }
      }
    }

    let lastError: any = null;
    // 성공한 도메인이 있으면 그것부터 시도, 없으면 전체 도메인 시도
    const retryDomains = successDomain ? [successDomain, ...domains.filter(d => d !== successDomain)] : domains;

    // 시도할 경로 목록 (v1.0, /dev, appid/app_id, v2, Analytics Beta 대응)
    const startTs = Math.floor(new Date(startDay).getTime() / 1000);
    const endTs = Math.floor(new Date(endDay).getTime() / 1000);

    const paths = [
      `/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/v1.0/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/dev/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&app_id=${APP_ID}`,
      `/v1/stats/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/v2/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`,
      `/beta/insight/usage/by_time?start_ts=${startTs}&end_ts=${endTs}&appid=${APP_ID}&metric=total_duration`
    ];

    const commonHeaders = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    };

    for (const domain of retryDomains) {
      for (const path of paths) {
        const url = `https://${domain}${path}`;
        try {
          const response = await fetch(url, {
            headers: commonHeaders
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
          lastError = { domain, path: path.split('?')[0], status: response.status, details: errorText };
          if (response.status === 401 || response.status === 403) break;
        } catch (e: any) {
          lastError = { domain, status: 500, details: e.message };
        }
      }
    }

    // 진단 결과 분석
    const safeMask = (str: string | undefined) => {
      if (!str) return 'Missing';
      if (str.length < 8) return 'Short Value';
      return str.substring(0, 4) + '...' + str.substring(str.length - 4);
    };

    const appIdExists = Array.isArray(projectsData?.projects) 
      ? projectsData.projects.some((p: any) => p.vendor_key === APP_ID) 
      : null;
    
    const availableProjectCount = Array.isArray(projectsData?.projects) 
      ? projectsData.projects.length 
      : 0;

    return NextResponse.json({ 
      error: 'Agora API 호출 실패 (404: 경로 불일치)',
      debug: {
        successDomain,
        appId: safeMask(APP_ID),
        customerId: safeMask(CUSTOMER_ID),
        credentialsLength: credentials.length,
        appIdExistsInAccount: appIdExists,
        availableProjectsInAccount: availableProjectCount,
        diagnosticError: diagError,
        lastError: lastError,
        tip: '1. Agora 콘솔 [RESTful API] > [View Details]에서 "Project Management" 권한 확인. 2. 해당 프로젝트에 "Project Certificate"가 활성화되어 있는지 확인. 3. [White List]에 IP가 등록되어 있다면 제거 후 시도.'
      }
    }, { status: 500 });

  } catch (error: any) {
    console.error('Global API Exception:', error?.message || error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

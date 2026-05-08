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

    // 현재 날짜 기준 최근 30일 데이터 조회 (데이터 누락 방지)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const startDayRange = thirtyDaysAgo.toISOString().split('T')[0];
    const endDayRange = now.toISOString().split('T')[0];
    
    // 타임스탬프 (Analytics API용) - 공식 문서 기준 camelCase
    const startTs = Math.floor(thirtyDaysAgo.getTime() / 1000);
    const endTs = Math.floor(now.getTime() / 1000) + 86400;

    const paths = [
      // ✅ 공식 문서 기준 camelCase 파라미터: startTs, endTs, metric=totalDuration
      `/beta/insight/usage/by_time?appid=${APP_ID}&startTs=${startTs}&endTs=${endTs}&metric=totalDuration`,
      `/beta/insight/usage/by_time?appid=${APP_ID}&startTs=${startTs}&endTs=${endTs}&metric=totalAudioDuration`,
      `/beta/insight/usage/by_time?appid=${APP_ID}&startTs=${startTs}&endTs=${endTs}&metric=totalVideoDuration`,
      // 구버전 fallback
      `/v1/usage/minutes?start_date=${startDayRange}&end_date=${endDayRange}&appid=${APP_ID}`,
      `/v1.0/usage/minutes?start_date=${startDayRange}&end_date=${endDayRange}&appid=${APP_ID}`
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
            let dataSample = null;

            // 응답의 실제 최상위 키 확인
            const topLevelKeys = Object.keys(data);
            // data.data 또는 data.usage 또는 다른 배열 필드 찾기
            let dataArray: any[] = [];
            if (Array.isArray(data.data)) dataArray = data.data;
            else if (Array.isArray(data.usage)) dataArray = data.usage;
            else if (Array.isArray(data.items)) dataArray = data.items;
            else if (Array.isArray(data.result)) dataArray = data.result;

            if (dataArray.length > 0) {
              dataSample = dataArray[0];
              dataArray.forEach((item: any) => {
                for (const key in item) {
                  const val = item[key];
                  if (typeof val === 'number' && key !== 'ts') {
                    totalMinutes += val;
                  } else if (typeof val === 'string' && !isNaN(Number(val)) && key !== 'date' && key !== 'ts') {
                    totalMinutes += Number(val);
                  }
                }
              });
            }

            // 0이면 전체 raw 응답을 노출 (디버깅용)
            if (totalMinutes === 0) {
              return NextResponse.json({
                totalMinutes: 0,
                limit: 10000,
                percentage: '0.0',
                debug: { 
                  workingPath: path.split('?')[0], 
                  workingDomain: domain,
                  dataCount: dataArray.length,
                  topLevelKeys,         // ← 이 키들을 확인하면 구조를 알 수 있음
                  rawResponse: data,    // ← 전체 응답 raw dump
                  sample: dataSample
                }
              });
            }

            return NextResponse.json({
              totalMinutes: Math.round(totalMinutes),
              limit: 10000,
              percentage: Math.min(((totalMinutes / 10000) * 100), 100).toFixed(1),
              debug: { 
                workingPath: path.split('?')[0], 
                workingDomain: domain,
                dataCount: dataArray.length,
                sample: dataSample
              }
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

    const projectSample = Array.isArray(projectsData?.projects) && projectsData.projects.length > 0
      ? { name: projectsData.projects[0].name, id: projectsData.projects[0].id }
      : null;

    return NextResponse.json({ 
      error: 'Agora API 호출 실패 (데이터 없음)',
      debug: {
        successDomain,
        appId: safeMask(APP_ID),
        customerId: safeMask(CUSTOMER_ID),
        credentialsLength: credentials.length,
        appIdExistsInAccount: appIdExists,
        availableProjectsInAccount: availableProjectCount,
        projectSample, // 프로젝트 메타데이터 확인용
        diagnosticError: diagError,
        lastError: lastError,
        tip: '인증은 성공했으나 데이터를 찾지 못했습니다. App ID가 실사용 중인 프로젝트와 일치하는지 확인해 주세요.'
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

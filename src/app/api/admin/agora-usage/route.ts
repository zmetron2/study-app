import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const CUSTOMER_ID = process.env.AGORA_CUSTOMER_ID;
  const CUSTOMER_SECRET = process.env.AGORA_CUSTOMER_SECRET;
  const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  if (!CUSTOMER_ID || !CUSTOMER_SECRET || !APP_ID) {
    return NextResponse.json({ error: 'Agora credentials not configured' }, { status: 500 });
  }

  try {
    // Agora Basic Auth 생성
    const credentials = btoa(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`);
    
    // 현재 날짜 기준 이번 달 시작일과 종료일 계산 (YYYY-MM-DD)
    const now = new Date();
    const startDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0].replace(/-/g, '');
    const endDay = now.toISOString().split('T')[0].replace(/-/g, '');

    // Agora Usage API 호출 (분 단위 사용량 조회)
    // Note: 실제 API 경로는 Agora 프로젝트 설정 및 리전에 따라 다를 수 있습니다. 
    // 여기서는 표준 통계 인터페이스를 사용합니다.
    const response = await fetch(`https://api.agora.io/v1/usage/minutes?start_date=${startDay}&end_date=${endDay}&appid=${APP_ID}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Agora');
    }

    const data = await response.json();
    
    // 사용된 총 분량 계산 (비디오 + 오디오 합산)
    // Agora API 응답 구조에 따라 데이터 파싱 로직이 달라질 수 있습니다.
    let totalMinutes = 0;
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any) => {
        totalMinutes += (item.video_hd || 0) + (item.video_hdp || 0) + (item.audio || 0);
      });
    }

    return NextResponse.json({
      totalMinutes: Math.round(totalMinutes),
      limit: 10000,
      percentage: Math.min(((totalMinutes / 10000) * 100), 100).toFixed(1)
    });

  } catch (error) {
    console.error('Agora Usage API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

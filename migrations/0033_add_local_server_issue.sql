-- Insert local development server symlink issue & setupDevPlatform guide into vibe_resources
INSERT INTO vibe_resources (title, description, url, category, tags, provider, rating, icon_text, created_at) VALUES 
('Windows 환경 wrangler pages dev 프록시 404 및 EPERM 에러 해결 가이드', 
'Windows 운영체제에서 Cloudflare Pages 로컬 개발 환경 구축 시 발생하는 고질적인 심볼릭 링크 생성 EPERM 권한 오류와 wrangler pages dev 프록시 404 에러의 발생 원인 및 완벽한 해결책을 제시합니다.

## 이슈 발생 원인
- Windows 보안 정책으로 인해 일반 명령 프롬프트나 파워셸 등에서는 심볼릭 링크(symlink) 생성이 거부되어 EPERM 에러가 발생합니다.
- @cloudflare/next-on-pages의 빌드 과정(vercel build) 중 심볼릭 링크 생성이 실패하면서 빌드 결과물(.vercel/output)이 불완전하게 생성되었습니다.
- 이로 인해 8788 포트의 wrangler dev 프록시 서버가 서빙할 정적 파일이나 _worker.js를 찾지 못하여 지속적으로 404 Not Found를 응답하는 현상이 나타났습니다.
   
## 해결 방안 (setupDevPlatform 설정)
- 번거롭고 오류가 빈번한 8788 wrangler 프록시 대신, Next.js 15+에서 공식 권장하는 setupDevPlatform() 함수를 연동하여 3000 포트 단독으로 완벽한 D1/KV 에뮬레이션을 기동합니다.
- CommonJS 빌드 컴파일 타겟 상에서의 탑레벨 await ReferenceError 문제를 해결하기 위해 next.config.ts를 async 함수 형태로 래핑하여 에뮬레이터를 작동시킵니다.

## 상세 설정 방법
   
### next.config.ts 수정
next.config.ts 설정 파일을 다음과 같이 구성하여 개발 모드에서만 setupDevPlatform()이 비동기적으로 실행되도록 조치합니다.
   
```typescript
import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
   
const nextConfig = async (): Promise<NextConfig> => {
  if (process.env.NODE_ENV === ''development'') {
    await setupDevPlatform();
  }
   
  return {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    env: {
      NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    }
  };
};
   
export default nextConfig;
```

## 로컬 개발 및 검증
- 설정 적용 후 npm run dev 명령어로 3000 포트 개발 서버를 기동합니다.
- CLI 로그에 "Using secrets defined in .env.local" 문구가 나타나며 로컬 wrangler.toml 설정을 정상 로드합니다.
- getRequestContext() API가 에러 없이 작동하며, D1 로컬 데이터베이스 연동 테스트 결과 200 OK와 함께 DB 조회 쿼리가 성공적으로 수행됩니다.
- 8788 포트를 거칠 필요 없이 3000 포트 단독으로 빠른 핫 리로드(HMR)와 에지 컨텍스트를 동시에 누리는 쾌적한 개발 환경을 제공합니다.

## 도구별 기능성 비교
| 비교 항목 | wrangler pages dev (8788) | setupDevPlatform (3000) |
| :--- | :--- | :--- |
| 무료여부 | 무료 (Cloudflare 기본 제공) | 무료 (Cloudflare 기본 제공) |
| 기능 | 빌드 산출물 기반 라우팅 및 프록시 | Next.js HMR 라이브 리로드 및 바인딩 직접 에뮬레이션 |
| 활용도 | 최종 배포 전 프로덕션 환경 임시 테스트 | 일상적인 로컬 기능 개발 및 디버깅 (강력 추천) |', 
'#', 
'이슈', 
'Wrangler,Next.js,Windows,ErrorFix', 
'Vibe', 
5.0, 
'WRG', 
CURRENT_TIMESTAMP);

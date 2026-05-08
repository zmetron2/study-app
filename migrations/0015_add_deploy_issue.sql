INSERT INTO vibe_resources (title, description, url, category, tags, provider, icon_text)
VALUES (
  'Cloudflare Pages + Next.js 15 로컬 배포 환경 충돌(npx ENOENT) 이슈 해결',
  '### 🚨 발생 이슈
로컬 Windows 환경에서 `npm run pages:deploy` (next-on-pages) 배포 시 `npx ENOENT` 및 `bash ENOENT` 에러가 발생하며, 이로 인해 Cloudflare Pages에 `_worker.js`가 정상적으로 묶이지 않아 API 및 동적 라우트가 "404 Not Found"를 반환하는 치명적 현상.

### 🔍 원인 파악
1. `@cloudflare/next-on-pages`는 내부적으로 Vercel CLI를 사용하여 빌드하는데, Windows 환경에서는 리눅스 명령어(`bash`)나 `npx`를 `child_process.spawn`으로 호출할 때 PATH 호환성 문제로 예외가 발생함.
2. 로컬에서 강제로 CLI 배포를 진행할 경우 워커 스크립트(`_worker.js`)가 생성되지 않고 정적 에셋(`.html`, `.css` 등)만 배포되어, 서버리스 기능(API 라우트, DB 통신 등)이 전부 작동하지 않는 404 상태가 됨.

### 💡 해결 방안 (최적의 솔루션)
1. 로컬 컴퓨터(Windows)에서 강제로 CLI 배포를 수행하는 방식을 중단합니다.
2. **Cloudflare Pages의 GitHub 연동 자동 배포 (CI/CD)** 를 활용합니다. 코드를 `master` 브랜치에 Push하면, Cloudflare의 자체 리눅스 빌드 서버가 자동으로 `next-on-pages` 빌드 및 배포를 수행하여 Windows 호환성 문제를 원천 차단합니다.
3. 로컬 테스트나 강제 배포가 반드시 필요한 경우 Windows Subsystem for Linux (WSL) 환경에서 명령어를 실행해야 합니다.',
  'https://github.com/cloudflare/next-on-pages/issues/849',
  '이슈 기록',
  'Next.js,Cloudflare,Error,Deploy,Windows',
  'Vibe',
  'BUG'
);

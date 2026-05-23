-- Insert localhost:3000 service worker cache conflict issue into vibe_resources
INSERT INTO vibe_resources (title, description, url, category, tags, provider, rating, icon_text, created_at) VALUES 
('Windows 로컬 개발 환경 localhost 3000 포트 서비스 워커 충돌 해결 가이드', 
'Windows 환경에서 Next.js 로컬 개발 중 발생할 수 있는 localhost:3000 포트의 서비스 워커(Service Worker) 캐시 충돌 현상의 원인과 구체적인 해결 가이드를 제공합니다.

## 이슈 발생 현상
- 로컬 서버를 재기동하고 브라우저를 새로고침했음에도 불구하고 화면 내용이 변경되지 않습니다.
- 크롬 개발자 도구의 콘솔 창에 `Uncaught (in promise) TypeError: Failed to execute ''clone'' on ''Response''` 또는 정적 리소스 파일(chunks, css)들에 대해 `404 Not Found` 에러가 반복적으로 발생합니다.
- 실서버 도메인에서는 정상적으로 구동되는 코드가 유독 로컬 주소인 `localhost:3000`에서만 비정상 동작합니다.

## 원인 분석
- **서비스 워커의 캐시 제어**: 브라우저에 등록된 서비스 워커(`sw.js`)는 도메인 단위로 등록됩니다. 로컬 개발 환경인 `localhost:3000` 주소는 여러 프로젝트에서 공동으로 재사용되는 경우가 많습니다.
- **과거 프로젝트의 찌꺼기 작동**: 과거에 로컬 환경에서 기동했었던 전혀 다른 프로젝트(예: PWA 지원 앱)가 브라우저에 `sw.js`를 등록해 둔 경우, 저희 프로젝트를 기동할 때 해당 서비스 워커가 실행되어 네트워크 요청을 탈취합니다.
- **리소스 경로 매칭 실패**: 과거 서비스 워커가 현재 프로젝트의 새로운 Next.js 정적 빌드 해시 청크 경로를 찾지 못하고 캐시 복제(`clone`) 오류를 발생시키며 화면 렌더링에 필요한 자바스크립트 실행을 완전히 중단시킵니다.

## 해결 방법
크롬 브라우저 기준으로 아래 절차를 통해 브라우저에 강하게 붙어 있는 옛 서비스 워커와 캐시 정보를 강제 제거할 수 있습니다.

### 1. 서비스 워커 등록 취소 (Unregister)
- 웹 브라우저에서 `http://localhost:3000`으로 접속합니다.
- `F12`를 눌러 크롬 개발자 도구를 엽니다.
- 상단 메뉴 중 `Application` (애플리케이션) 탭으로 이동합니다.
- 좌측 사이드바에서 `Service Workers` 메뉴를 선택합니다.
- 우측 화면에 탐지된 `sw.js` 또는 활성화된 서비스 워커 항목 옆의 `Unregister` (등록 취소) 버튼을 클릭합니다.

### 2. 사이트 데이터 및 스토리지 비우기 (Clear Site Data)
- 개발자 도구 `Application` 탭 좌측의 `Storage` 메뉴를 선택합니다.
- 우측 화면 중앙에 있는 `Clear site data` (사이트 데이터 삭제) 버튼을 클릭합니다.
- 브라우저를 완전히 종료했다가 다시 `http://localhost:3000`으로 접속하여 정상 로드 여부를 확인합니다.

## 도구 및 환경별 기능성 비교
서비스 워커 삭제 외에 로컬 환경 안정화를 위해 활용 가능한 기법들을 비교합니다.

| 비교 항목 | Incognito Mode (시크릿 창) | Clear Site Data (데이터 삭제) | Bypassing Parameter (우회 파라미터) |
| :--- | :--- | :--- | :--- |
| 무료여부 | 무료 (브라우저 기본 제공) | 무료 (브라우저 기본 제공) | 무료 (브라우저 기본 제공) |
| 기능 | 격리된 단회성 세션 제공 | 기존 캐시 및 워커 완전 제거 | CDN 및 에지 캐시 우회 |
| 활용도 | 1회성 상태 신속 검증 | 고질적인 서비스 워커 충돌 해결 (권장) | 배포 직후 실서버 전파 딜레이 우회 |', 
'#', 
'이슈', 
'ServiceWorker,ErrorFix,localhost,Next.js', 
'Vibe', 
5.0, 
'ERR', 
CURRENT_TIMESTAMP);

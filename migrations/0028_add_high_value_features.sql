-- Migration: Add Five High-Value Modern Practice Projects
INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, views, completion_rate, icon_name, is_hidden, content) VALUES
('p26_kakao', '카카오톡 SDK 활용 링크 공유기', '카카오톡 Javascript SDK를 연동하여 모바일에 최적화된 리치 카드 링크와 딥링크 공유 기능을 제작합니다.', '입문', 'API 연동', '카카오톡,공유,SDK,API', '입문 단계', '3.5K', 2, 'MessageSquare', 0, '### 💬 실습 과정 안내

국내 모바일 환경에서 유입률을 극대화할 수 있는 **카카오톡 공유 기능(KakaoTalk Share Link)**을 구현합니다.

#### 1. 카카오 디벨로퍼스 설정
- 카카오 디벨로퍼스 콘솔에 접속하여 애플리케이션을 생성합니다.
- 플랫폼 설정에서 웹 사이트 도메인(Localhost 및 프로덕션 도메인)을 등록합니다.
- JavaScript 키를 발급받아 환경 변수 또는 안전한 상수 파일에 배치합니다.

#### 2. 카카오 SDK 로드 및 초기화
- Next.js의 `Script` 컴포넌트를 사용하여 카카오 SDK(`https://t1.kakaocdn.net/kakao/js/sdk/2.7.0/kakao.min.js`)를 비동기로 안전하게 로드합니다.
- `window.Kakao.isInitialized()`를 확인한 뒤 발급받은 JavaScript 키를 활용해 초기화(`window.Kakao.init(KEY)`)를 수행합니다.

#### 3. 리치 카드 공유 구현
- **기본 커스텀 템플릿**: 제목, 설명, 썸네일 이미지 및 버튼 텍스트가 포함된 리치 피드(Feed) 유형을 전송합니다.
- **웹뷰 및 모바일 앱 딥링크**: 카카오톡 인앱 브라우저 및 설치된 모바일 네이티브 앱으로 다이렉트 랜딩이 가능하도록 커스텀 링크 경로를 설정합니다.

> 💡 **Tip**: 공유 카드 이미지 크기는 가급적 **800x400 (2:1 비율)**을 권장하며, 카카오톡 인앱 브라우저 호환성을 사전에 고려해야 합니다.'),

('p27_zustand_i18n', 'Zustand 기반 다국어(i18n) 시스템', 'Zustand와 JSON 번들 파일을 활용해 번역 데이터를 캐싱하고, 새로고침 없이 전역 다국어(ko, en, ja)를 지원하는 시스템을 만듭니다.', '기초', '상태 관리', 'Zustand,i18n,다국어,상태관리', '기초 단계', '5.4K', 3, 'Menu', 0, '### 🌐 실습 과정 안내

전역 상태 관리 라이브러리인 **Zustand**를 응용하여 로딩 지연 없는 **다국어 지원(i18n) 시스템**을 구현합니다.

#### 1. 다국어 딕셔너리 구축
- 각 언어별(`ko.json`, `en.json`, `ja.json`)로 대응하는 번역 키-값 사전(Dictionary)을 설계합니다.
- 복잡한 중첩 구조(Nested object)를 유연하게 탐색할 수 있도록 헬퍼 유틸리티 함수를 준비합니다.

#### 2. Zustand를 이용한 전역 스토어 설계
- 현재 선택된 언어(`locale`) 상태와 번역 함수(`t`)를 포함한 Zustand 스토어를 생성합니다.
- 사용자가 언어를 변경하면 스토어 내 번역 데이터가 즉시 갱신되어, React 컴포넌트 전체가 리렌더링 없이 즉시 언어 전환 효과를 갖습니다.

#### 3. 세션 영속화 및 시스템 언어 감지
- `navigator.language`를 파싱하여 브라우저의 기본 설정 언어를 최초의 기본값으로 자동 매핑합니다.
- Zustand의 `persist` 미들웨어를 결합하여 사용자가 변경한 다국어 테마를 **LocalStorage**에 보관 및 유지합니다.

> 🛠 **Challenge**: 텍스트 사이에 변수를 주입하여 완성도 높은 동적 문장을 렌더링하는 `t("welcome", { name: "바이브코더" })` 형태의 포맷터를 추가해 보세요!'),

('p28_playwright_e2e', 'Playwright 브라우저 E2E 테스트 자동화', 'Playwright를 활용하여 로그인, 검색 및 데이터 생성 시나리오를 시뮬레이션하고 헤드리스 브라우저 테스트를 자동화합니다.', '실전', '기타', 'Playwright,테스트,자동화,CI', '실전 단계', '6.1K', 2, 'CheckCircle2', 0, '### 🧪 실습 과정 안내

현업에서 가장 각광받는 E2E(End-to-End) 테스트 프레임워크인 **Playwright**를 활용하여 애플리케이션의 핵심 비즈니스 로직을 브라우저 수준에서 자동으로 검증합니다.

#### 1. Playwright 설치 및 기본 시나리오 작성
- `@playwright/test` 라이브러리를 설치하고 초기화 및 `playwright.config.ts` 구성을 수행합니다.
- 특정 페이지에 직접 접속하여 DOM 요소를 선택하고 상호작용하는 기본 테스트 코드를 작성합니다.

#### 2. 로그인 및 CRUD 흐름 시뮬레이션
- **인풋 타이핑 & 클릭**: 테스트 계정 정보를 인풋 박스에 채워 넣고 로그인 버튼을 클릭하는 자동화 스텝을 설계합니다.
- **요소 존재 여부 검증**: 로그인 성공 후 유저 닉네임 엘리먼트가 나타나거나 마이페이지로 이동했는지 `expect(page).toHaveURL()` 메서드로 확인합니다.
- **상태 보존**: 로그인 쿠키 및 세션 상태를 저장(storageState)하여 중복 로그인 과정 없이 다양한 개별 시나리오를 연속 테스트합니다.

#### 3. 로컬 테스트 및 CI 파이프라인 탑재
- Playwright UI Mode를 실행하여 브라우저 동작 화면과 타임라인 트레이스(Trace) 분석 기능을 활용합니다.
- GitHub Actions 워크플로우에 통합하여 빌드 시 E2E 테스트가 자동으로 통과해야만 배포되도록 구조를 보강합니다.'),

('adv-a4_webrtc', 'WebRTC 1:1 실시간 화상 미팅 룸', 'WebRTC 기술과 임시 시그널링 서버를 연동하여 플러그인 없이 브라우저 간 1:1 화상 및 음성 연결을 구현합니다.', '심화', 'API 연동', 'WebRTC,P2P,미디어,실시간', '트랙 A: 수익형 빌딩', '11.2K', 4, 'MessageSquare', 0, '### 📹 실습 과정 안내

웹 기반 P2P 실시간 통신의 업계 표준인 **WebRTC(Web Real-Time Communication)**를 사용하여 화면 공유 및 1:1 실시간 화상 회의 룸을 설계하고 구현합니다.

#### 1. 미디어 스트림 제어
- 브라우저의 `navigator.mediaDevices.getUserMedia()` API를 호출하여 카메라와 마이크 입력을 획득합니다.
- 획득한 미디어 스트림(MediaStream)을 `<video>` 엘리먼트에 바인딩하여 실시간 로컬 화면을 보여주고, 오디오 음소거 및 비디오 끄기 기능을 스위칭합니다.

#### 2. PeerConnection & Signaling 시퀀스
- `RTCPeerConnection` 객체를 구성하여 브라우저 간 연결 구조를 세팅합니다.
- WebSocket 또는 Supabase/Firebase Realtime 채널을 시그널링 서버로 지정하여 **Offer**, **Answer**, 그리고 P2P 통신 경로 탐색을 위한 **ICE Candidate** 패킷을 상호 교환합니다.

#### 3. 미디어 및 데이터 채널 연동
- 상대방으로부터 전달된 원격 스트림(Remote Stream)을 실시간 감지(`ontrack`)하여 두 번째 비디오 플레이어에 바인딩합니다.
- 추가로 `createDataChannel`을 생성해 연결이 확립된 피어끼리 별도 서버 없이 완전한 P2P 방식의 초고속 채팅 데이터를 전송합니다.

> ⚠️ **주의**: 실제 통신 환경에서는 공유기 뒤의 기기들을 찾기 위해 STUN 및 TURN 서버(예: Google STUN 또는 Coturn 인프라) 환경 설정이 사전에 동반되어야 정상 동작합니다.'),

('adv-c4_redis_rate_limit', 'Upstash Redis 기반 API 속도 제한기', 'Cloudflare Workers Edge 미들웨어 환경에서 Upstash Redis를 사용하여 IP 및 Token 기준 API 호출 제한(Rate Limiting) 장치를 설계합니다.', '심화', '인증/보안', 'Redis,RateLimit,보안,Edge', '트랙 C: 고급 OS & AI 인프라', '9.5K', 3, 'Lock', 0, '### ⚡ 실습 과정 안내

서버리스 에지 인프라(Cloudflare Workers)의 성능 저하를 방지하고 비용 절감 및 DDoS 공격을 원천 제어할 수 있는 에지 기반 **API Rate Limiter**를 구축합니다.

#### 1. Upstash Redis 서버리스 인스턴스 구축
- 글로벌 엣지 통신 속도에 맞추어 HTTP 연결을 지원하는 Upstash Serverless Redis를 구성합니다.
- API Route에서 통신 가능한 `@upstash/redis` SDK 및 자격 증명 환경 변수(`UPSTASH_REDIS_REST_URL`, `TOKEN`)를 설정합니다.

#### 2. Sliding Window Log 및 Fixed Window 알고리즘
- 단위 시간당 들어오는 요청 수를 엄밀하게 통제하기 위한 카운트 기반 제한 시스템을 설계합니다.
- 클라이언트의 고유 IP 또는 로그인 세션 토큰 정보를 고유 Key로 정하고 Redis의 `incr` 및 `expire` 원자적(Atomic) 연산을 수행합니다.

#### 3. Edge Middleware 및 HTTP 응답 처리
- Next.js 미들웨어(`middleware.ts`) 레이어에서 수신 요청의 헤더를 읽어 차단 여부를 에지 레벨에서 1ms 이내로 판별합니다.
- 제한 한도 초과 시 **HTTP Status 429 (Too Many Requests)** 응답 코드와 함께 남은 복구 시간을 `Retry-After` 헤더에 실어 응답합니다.

> 🔒 **보안**: IP 위변조 방지를 위해 로드 밸런서 헤더(`x-forwarded-for`, `cf-connecting-ip`) 신뢰 가이드를 엄격히 적용해야 합니다.');

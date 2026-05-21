-- Migration: Diversify Advanced Track Practice Projects (5+ per track)

-- 기존 미분류 심화 실습을 트랙에 편입
UPDATE practice_projects SET curriculum_link = '트랙 A: 수익형 빌딩' WHERE id = '18';
UPDATE practice_projects SET curriculum_link = '트랙 A: 수익형 빌딩' WHERE id = 'p8';

-- 트랙 A: 수익형 빌딩 (SaaS & Game) - 신규 3개
INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, views, completion_rate, icon_name, is_hidden, content) VALUES
('adv-a1', '구독형 SaaS 과금 시스템', '월간/연간 구독 플랜을 설계하고 Stripe 또는 토스 정기결제 API를 연동하여 자동 갱신 과금 흐름을 완성합니다.', '심화', '인증/보안', '결제,SaaS,구독,Stripe', '트랙 A: 수익형 빌딩', '10.2K', 6, 'Lock', 0, '### 실습 과정 안내

SaaS 비즈니스의 핵심인 정기 구독 과금 시스템을 설계하고 구현합니다.

#### 1. 플랜 설계
- Free / Pro / Enterprise 3단계 요금제 테이블을 구성합니다.
- 각 플랜별 기능 제한(Feature Gate)을 미들웨어로 제어합니다.

#### 2. 정기결제 연동
- Stripe Checkout 또는 토스 빌링키 발급 API를 통해 카드 등록 후 매월 자동 결제를 실행합니다.
- Webhook을 수신하여 결제 성공/실패/해지 이벤트를 DB에 기록합니다.'),

('adv-a2', 'HTML5 Canvas 미니게임 엔진', 'HTML5 Canvas와 requestAnimationFrame을 활용하여 수익형 광고를 탑재할 수 있는 캐주얼 웹 게임을 제작합니다.', '심화', 'UI/UX', 'Canvas,게임,HTML5,광고', '트랙 A: 수익형 빌딩', '7.8K', 4, 'Code', 0, '### 실습 과정 안내

브라우저에서 즉시 플레이 가능한 HTML5 Canvas 미니게임을 만듭니다.

#### 1. 게임 루프 설계
- requestAnimationFrame 기반 60fps 게임 루프를 구축합니다.
- 충돌 감지(Collision Detection) 알고리즘을 구현합니다.

#### 2. 수익화 연동
- 게임 오버 시 리워드 광고(Rewarded Ad)를 노출하는 흐름을 설계합니다.
- 스코어보드와 리더보드를 구현하여 리텐션을 높입니다.'),

('adv-a3', '광고 수익화 SDK 연동', 'Google AdSense 및 카카오 애드핏을 웹 서비스에 연동하여 페이지뷰 기반 광고 수익 파이프라인을 구축합니다.', '심화', 'API 연동', 'AdSense,광고,수익화', '트랙 A: 수익형 빌딩', '6.3K', 3, 'LineChart', 0, '### 실습 과정 안내

웹 서비스에 광고를 안전하게 삽입하고 수익을 분석하는 시스템을 구축합니다.

#### 1. 광고 삽입
- AdSense 스크립트를 Next.js Script 컴포넌트로 안전하게 로드합니다.
- 반응형 광고 유닛을 사이드바, 콘텐츠 사이, 푸터에 배치합니다.

#### 2. 성과 분석
- Google Analytics와 연동하여 광고 클릭률(CTR)과 RPM을 모니터링합니다.
- A/B 테스트로 최적 광고 위치를 실험합니다.');

-- 트랙 B: 플랫폼 확장 (Mobile & Extensions) - 신규 4개
INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, views, completion_rate, icon_name, is_hidden, content) VALUES
('adv-b1', 'React Native 크로스플랫폼 앱', 'Expo와 React Native를 사용하여 iOS와 Android에서 동시에 동작하는 하이브리드 모바일 앱을 제작합니다.', '심화', 'UI/UX', 'ReactNative,Expo,모바일', '트랙 B: 플랫폼 확장', '11.5K', 5, 'Menu', 0, '### 실습 과정 안내

하나의 코드베이스로 두 플랫폼을 정복하는 React Native 앱을 빌드합니다.

#### 1. Expo 환경 구축
- npx create-expo-app으로 프로젝트를 초기화하고 Expo Go로 실시간 프리뷰를 확인합니다.

#### 2. 핵심 기능 구현
- React Navigation으로 탭/스택 내비게이션을 설계합니다.
- AsyncStorage로 로컬 데이터를 영구 보존합니다.
- 푸시 알림(Expo Notifications)을 세팅합니다.'),

('adv-b2', 'PWA 오프라인 서비스 워커', 'Service Worker와 Cache API를 활용하여 네트워크가 끊겨도 완벽하게 동작하는 프로그레시브 웹앱을 구현합니다.', '심화', '상태 관리', 'PWA,ServiceWorker,캐시', '트랙 B: 플랫폼 확장', '5.9K', 3, 'Code', 0, '### 실습 과정 안내

오프라인에서도 매끄럽게 작동하는 PWA를 설계합니다.

#### 1. Service Worker 등록
- install, activate, fetch 이벤트를 핸들링하여 정적 자산을 캐싱합니다.

#### 2. 오프라인 전략
- Cache First 전략으로 정적 페이지를 즉시 로딩합니다.
- Network First 전략으로 API 데이터의 신선도를 보장합니다.
- 오프라인 폴백 페이지를 디자인합니다.'),

('adv-b3', 'Capacitor 네이티브 카메라 연동', 'Capacitor 플러그인을 활용하여 웹 앱에서 모바일 카메라에 직접 접근하고 촬영한 사진을 클라우드에 업로드합니다.', '심화', '파일 관리', 'Capacitor,카메라,네이티브', '트랙 B: 플랫폼 확장', '4.7K', 2, 'Upload', 0, '### 실습 과정 안내

웹 기술로 네이티브 하드웨어에 접근하는 Capacitor Camera 연동을 구현합니다.

#### 1. Capacitor 세팅
- 기존 Next.js/React 프로젝트에 Capacitor를 추가하고 iOS/Android 네이티브 프로젝트를 생성합니다.

#### 2. 카메라 플러그인 연동
- Camera.getPhoto() API로 촬영 또는 갤러리 선택 후 이미지 데이터를 획득합니다.
- Base64 또는 Blob으로 변환하여 R2/S3 스토리지에 업로드합니다.'),

('adv-b4', 'VS Code 확장 프로그램 제작', 'VS Code Extension API를 활용하여 코드 스니펫 자동 삽입, 사이드바 패널 등을 갖춘 개발 생산성 확장 도구를 만듭니다.', '심화', '기타', 'VSCode,Extension,개발도구', '트랙 B: 플랫폼 확장', '8.1K', 4, 'Terminal', 0, '### 실습 과정 안내

개발자의 일상 워크플로우를 혁신하는 VS Code Extension을 직접 제작합니다.

#### 1. 프로젝트 스캐폴딩
- yo code 제너레이터로 확장 프로젝트를 초기화합니다.
- package.json의 contributes 필드에 명령어, 키바인딩, 뷰를 등록합니다.

#### 2. 핵심 기능 구현
- registerCommand로 커스텀 명령어를 등록하고 단축키를 바인딩합니다.
- TreeDataProvider로 사이드바에 커스텀 트리 뷰를 렌더링합니다.
- Marketplace에 배포하는 전체 파이프라인을 학습합니다.');

-- 트랙 C: 고급 OS & AI 인프라 - 신규 3개
INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, views, completion_rate, icon_name, is_hidden, content) VALUES
('adv-c1', 'Docker 컨테이너 원클릭 배포', 'Dockerfile을 작성하고 Docker Compose로 웹 앱과 DB를 한번에 컨테이너화하여 어디서든 동일한 환경을 재현합니다.', '심화', '기타', 'Docker,컨테이너,DevOps', '트랙 C: 고급 OS & AI 인프라', '9.3K', 5, 'Code', 0, '### 실습 과정 안내

개발 환경을 완벽하게 캡슐화하는 Docker 컨테이너 배포를 마스터합니다.

#### 1. Dockerfile 작성
- Multi-stage Build로 프로덕션 이미지 크기를 최소화합니다.
- .dockerignore로 불필요한 파일을 빌드 컨텍스트에서 제외합니다.

#### 2. Docker Compose 오케스트레이션
- 웹 앱, PostgreSQL, Redis를 하나의 docker-compose.yml로 통합 관리합니다.
- 볼륨 마운트로 데이터 영속성을 보장합니다.'),

('adv-c2', 'Linux VPS 초기 세팅 자동화', 'Ubuntu VPS에 SSH 접속 후 방화벽, Nginx 리버스 프록시, SSL 인증서, Node.js 런타임을 자동으로 세팅하는 쉘 스크립트를 작성합니다.', '심화', '기타', 'Linux,VPS,서버,SSH', '트랙 C: 고급 OS & AI 인프라', '7.6K', 3, 'Terminal', 0, '### 실습 과정 안내

리눅스 서버를 처음부터 프로덕션 레디 상태로 구성하는 자동화 스크립트를 개발합니다.

#### 1. 보안 기초 설정
- root 비밀번호 변경, SSH 키 인증 전환, UFW 방화벽 포트 오픈 순서를 학습합니다.

#### 2. 서비스 스택 설치
- Nginx를 리버스 프록시로 세팅하고 Let''s Encrypt SSL 인증서를 자동 갱신합니다.
- PM2로 Node.js 앱을 데몬으로 구동하고 시스템 재부팅 시 자동 시작을 등록합니다.'),

('adv-c3', 'Electron 시스템 트레이 알림 앱', 'Electron으로 시스템 트레이에 상주하며 주기적으로 API를 폴링하여 중요 알림을 OS 네이티브 노티피케이션으로 전달하는 앱을 만듭니다.', '심화', 'API 연동', 'Electron,트레이,알림,데스크톱', '트랙 C: 고급 OS & AI 인프라', '6.4K', 3, 'MessageSquare', 0, '### 실습 과정 안내

백그라운드에서 조용히 동작하는 Electron 시스템 트레이 앱을 개발합니다.

#### 1. 트레이 아이콘 구현
- Tray 클래스로 시스템 트레이에 아이콘과 컨텍스트 메뉴를 등록합니다.
- 메인 윈도우 없이 트레이 전용으로 동작하도록 설계합니다.

#### 2. 주기적 폴링 및 알림
- setInterval로 외부 API를 주기적으로 호출하여 신규 데이터를 감지합니다.
- Notification API로 OS 네이티브 알림을 발송하고 클릭 시 상세 페이지를 엽니다.');

-- 트랙 D: 자동화 파이프라인 - 신규 3개
INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, views, completion_rate, icon_name, is_hidden, content) VALUES
('adv-d1', 'GitHub Actions CI/CD 파이프라인', 'Pull Request 생성 시 자동 린트/테스트를 수행하고, main 브랜치 머지 시 Cloudflare Pages에 자동 배포하는 워크플로우를 구축합니다.', '심화', '기타', 'CI/CD,GitHubActions,배포', '트랙 D: 자동화 파이프라인', '8.7K', 4, 'Code', 0, '### 실습 과정 안내

코드 품질과 배포를 자동으로 보장하는 CI/CD 파이프라인을 설계합니다.

#### 1. 워크플로우 파일 작성
- .github/workflows/ci.yml에 on: push, pull_request 트리거를 정의합니다.
- npm ci, lint, test, build 단계를 순차적으로 실행합니다.

#### 2. 자동 배포 연동
- main 브랜치 머지 시 wrangler pages deploy를 자동 실행하는 CD 스텝을 추가합니다.
- Slack Webhook으로 배포 성공/실패 알림을 전송합니다.'),

('adv-d2', 'AI 블로그 포스팅 자동 생성기', 'OpenAI API를 활용하여 키워드 입력만으로 SEO 최적화된 블로그 포스트 초안을 자동 생성하고 CMS에 발행하는 파이프라인을 구축합니다.', '심화', 'API 연동', 'AI,GPT,콘텐츠,자동화', '트랙 D: 자동화 파이프라인', '14.2K', 7, 'Edit3', 0, '### 실습 과정 안내

AI를 활용한 대량 콘텐츠 생성 자동화 시스템을 구축합니다.

#### 1. 프롬프트 엔지니어링
- 키워드, 타겟 독자, 톤앤매너를 입력받아 구조화된 프롬프트 템플릿을 생성합니다.

#### 2. 자동 발행 파이프라인
- OpenAI Chat Completions API로 제목, 본문, 메타 설명을 생성합니다.
- 생성된 마크다운을 Headless CMS(Notion API 또는 WordPress REST API)에 자동 업로드합니다.
- 생성 이력과 발행 상태를 대시보드에서 모니터링합니다.'),

('adv-d3', 'SNS 자동 포스팅 봇', 'Puppeteer 또는 SNS 공식 API를 활용하여 예약된 시간에 텍스트와 이미지를 자동으로 업로드하는 소셜 미디어 자동화 봇을 만듭니다.', '심화', '기타', 'SNS,봇,Puppeteer,자동화', '트랙 D: 자동화 파이프라인', '9.8K', 5, 'Sun', 0, '### 실습 과정 안내

마케팅 업무를 획기적으로 줄여주는 SNS 자동 포스팅 시스템을 구현합니다.

#### 1. 스케줄러 설계
- node-cron 또는 n8n Cron Trigger로 매일 특정 시간에 포스팅 작업을 트리거합니다.

#### 2. 플랫폼별 연동
- Twitter/X API v2로 텍스트 및 이미지 트윗을 자동 발행합니다.
- Instagram Graph API 또는 Puppeteer로 피드 포스트를 자동 업로드합니다.
- 포스팅 성과(좋아요, 리트윗)를 수집하여 CSV로 리포트를 생성합니다.');

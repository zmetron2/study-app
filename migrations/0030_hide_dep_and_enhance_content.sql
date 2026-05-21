-- Migration: Hide redundant projects and enhance 24 real projects with standard 3-step guide format

-- 1. Hide obsolete dummy and redundant projects
UPDATE practice_projects 
SET is_hidden = 1 
WHERE id IN ('3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14');

-- 2. Enhance content for the 24 active projects

-- p15: SEO 최적화용 메타 태그 주입기
UPDATE practice_projects
SET description = '국내 주요 포털(네이버, 다음) 및 글로벌 검색엔진(구글)에 최적화된 Meta 태그, OpenGraph 태그, JSON-LD 구조화 데이터를 동적으로 제어 및 생성하는 최적화 솔루션을 구축합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- React Helmet 또는 Next.js App Router의 내장 Metadata API 환경을 준비합니다.
- 검색엔진 봇이 렌더링하기 용이하도록 정적 마크업 분석 구조 및 헤더 템플릿을 구비합니다.

### 🔐 핵심 기능 구현 단계
1. **[동적 메타 정보 및 타이틀 갱신]**: 컴포넌트 라이프사이클에 맞춰 브라우저 페이지의 `document.title`과 `description` 메타 속성을 동적으로 변이시키는 헬퍼 모듈을 작성합니다.
2. **[리치 소셜 공유 오픈그래프 바인딩]**: 카카오톡, 페이스북, 트위터 공유 시 고품질 요약 정보가 출력되도록 `og:title`, `og:image`, `og:description` 및 Twitter Card 메타 태그 속성을 동적으로 주입합니다.
3. **[JSON-LD 구조화 데이터 삽입]**: 구글 검색 노출 가이드를 완벽히 적용할 수 있도록 검색봇이 인식하는 구조화 문서 규격인 `application/ld+json` 스크립트를 동적으로 헤더 단에 삽입합니다.

### 💡 구현 팁 및 주의 사항
> **검색 엔진 캐싱 대응**: 카카오톡이나 페이스북 등은 이미 크롤링해 간 메타 정보 캐시를 장기간 유지하므로, 이미지가 갱신되었을 경우 URL에 쿼리 파라미터(예: `?v=2`)를 추가하거나 플랫폼별 개발자 도구 캐시 삭제 API를 활용하는 기법이 유용합니다.'
WHERE id = 'p15';

-- p16: 국내 웹호스팅 서버 헬스체커
UPDATE practice_projects
SET description = '가비아, Cafe24 등 국내의 일반적인 웹호스팅 환경에서 작동하는 타겟 서버의 연결 포트 상태, 응답 속도 지연(RTT)을 상시 체크하고 장애 발생 시 외부 알림으로 자동 릴레이하는 시스템을 구현합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- HTTP 호출 성능 측정을 위해 Axios 또는 Fetch API를 사용할 수 있는 환경을 마련합니다.
- 서버 다운타임 또는 성능 저하 시 경고를 수신할 Slack Webhook URL 또는 Discord 알림 API 포트를 미리 확보합니다.

### 🔐 핵심 기능 구현 단계
1. **[Fetch 왕복 지연 RTT 측정]**: 타겟 도메인 주소로 경량 HTTP HEAD 요청을 날려 커넥션 성공 유무를 판단하고, `performance.now()`를 활용해 응답 지연 밀리초(ms)를 정밀하게 기록합니다.
2. **[HTTP 상태 코드 분기 및 판단]**: 응답 수신 시 HTTP Status Code(200 OK, 500 Server Error 등) 및 `response.ok` 플래그를 추출하여 서버 헬스 상태를 세밀하게 정형화합니다.
3. **[에러 스킵 및 Webhook 알림 트리거]**: 연속 3회 응답 지연이 3000ms를 초과하거나 상태 코드가 500대일 경우, Slack/Discord 수신 채널로 에러 로그 정보를 담은 알림 페이로드를 긴급 전송합니다.

### 💡 구현 팁 및 주의 사항
> **CORS 제약 극복**: 웹 프론트엔드 브라우저에서 외부 호스트 도메인을 향해 다이렉트로 Fetch를 수행하면 대부분 CORS(Cross-Origin Resource Sharing) 에러를 마주하므로, Next.js API Route나 Workers와 같은 백엔드 프록시 미들웨어를 경유하여 헬스체크를 우회 기동하는 구조가 필수적입니다.'
WHERE id = 'p16';

-- p17: 회원가입 유효성 검증 시스템
UPDATE practice_projects
SET description = 'React Hook Form과 Zod 검증 스키마를 단단히 연동하여, 이메일 규칙, 패스워드 복잡도 강도 측정 및 비밀번호 실시간 매칭 UI를 포함한 견고한 폼 제어 최적화 환경을 구성합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 입력 양식 제어를 위해 `react-hook-form`, `zod` 및 resolver 연동용 `@hookform/resolvers` 패키지를 설치합니다.
- 사용자 실시간 인풋 변경 이벤트를 감지할 입력 폼 레이아웃을 작성합니다.

### 🔐 핵심 기능 구현 단계
1. **[Zod 실시간 유효성 스키마 빌드]**: 이메일 정규표현식, 대소문자/숫자/특수문자 조합 8자 이상 패스워드 조건, 비밀번호 및 재입력값 필드의 완전 일치 검증 로직 스키마를 구성합니다.
2. **[React Hook Form 컨트롤러 바인딩]**: `useForm`에 `zodResolver`를 결합하고, 입력 필드 인풋 컴포넌트에 `register` 함수를 주입하여 실시간 상태 변화 및 유효성 실패 이벤트를 감지하도록 동기화합니다.
3. **[패스워드 안전 강도 게이지 UI]**: 입력된 패스워드 패턴의 자릿수 및 복잡성 점수를 판별하여 위험(Weak), 보통(Medium), 안전(Strong) 상태를 직관적인 멀티 컬러 프로그레스 게이지로 실시간 드로잉합니다.

### 💡 구현 팁 및 주의 사항
> **리렌더링 최소화**: React Hook Form의 `mode: "onBlur"` 또는 `mode: "onChange"` 옵션을 적절히 조율하여 불필요한 키 입력 단위 컴포넌트 리렌더링 폭탄을 예방하고 최적의 메모리 가용성을 유지하세요.'
WHERE id = 'p17';

-- p18: 반응형 매출 분석 대시보드 위젯
UPDATE practice_projects
SET description = 'CSS Grid와 Recharts 라이브러리를 연동하여 데스크톱(다단 뷰) 및 모바일(단일 열 뷰) 레이아웃에 반응해 깔끔하게 뷰포트가 맞춰지는 매출 분석 대시보드 위젯 세트를 구축합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 차트 그래픽 렌더링에 최적화된 리액트 전용 라이브러리 `recharts`를 설치합니다.
- 반응형 1단/2단 그리드 구성을 위해 Tailwind CSS의 격자 속성(`grid`, `grid-cols-1`, `md:grid-cols-2`)을 지원할 준비를 마칩니다.

### 🔐 핵심 기능 구현 단계
1. **[차트 컴포넌트 및 Mock 데이터 가공]**: 일/월별 매출 데이터를 AreaChart와 BarChart 컴포넌트에 로드하고 가독성 높은 축 라벨(XAxis, YAxis) 및 호버 가이드 툴팁(Tooltip)을 연동합니다.
2. **[반응형 컨테이너 감싸기]**: Recharts의 `ResponsiveContainer` 래퍼 컴포넌트를 사용해 뷰포트 너비나 부모 컨테이너 비율이 변할 때 차트 영역도 스무스하게 실시간 리사이징되도록 바인딩합니다.
3. **[대시보드 그리드 다단 배치]**: 대형 화면에서는 누적 영역 차트와 누적 바 차트가 2열로 나열되고, 모바일 세로 뷰에서는 1열 스택 형태로 보기 편하게 내려앉는 그리드 UI를 완성합니다.

### 💡 구현 팁 및 주의 사항
> **모바일 터치 툴팁 보완**: 모바일 디바이스 스크롤 시 차트 위를 직접 스와이프할 때 툴팁이 화면을 가리거나 스크롤이 잠기는 제스처 방해 오작동을 피하기 위해, 터치 터미널에서는 툴팁의 포탈 속성을 오프셋 조절하거나 간단한 스크롤 락 바이패스 레이아웃 처리를 가하는 것이 좋습니다.'
WHERE id = 'p18';

-- p19: Cloudflare R2 기반 고속 파일 업로더
UPDATE practice_projects
SET description = '서버 부하 없이 클라이언트 브라우저에서 직접 대용량 파일을 Cloudflare R2 스토리지 버킷으로 고속 전송할 수 있는 Presigned URL 안전 발급 프로세스 및 프로그레스 UI를 제작합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- Cloudflare R2 버킷을 대시보드 상에서 개설하고 API 토큰(Access Key, Secret Key) 및 엔드포인트 URL 주소를 취득합니다.
- 백엔드에 `@aws-sdk/client-s3` 및 `@aws-sdk/s3-request-presigner` 모듈을 설치합니다.

### 🔐 핵심 기능 구현 단계
1. **[안전한 Presigned URL 발급 Route]**: 서버리스 API Route에서 R2 S3 Client를 초기화하고, 파일 확장자 및 고유 파일명을 넘겨받아 10분의 제한 유효 타임을 지닌 파일 업로드용 Signed URL을 발행해 클라이언트로 내려줍니다.
2. **[브라우저 직접 업로드 구현]**: 클라이언트 폼 단에서 취득한 Signed URL 주소로 실제 파일 바이너리를 담아 Axios 또는 `fetch` API를 통해 직접 `PUT` 통신 요청을 쏘아줍니다.
3. **[실시간 업로드 진척도 시각화]**: Axios `onUploadProgress` 콜백 함수나 XHR progress 이벤트를 중간에서 인터셉트하여 완료율(%) 상태값을 갱신하고 스무스한 CSS 애니메이션을 먹인 프로그레스 바 UI를 완성합니다.

### 💡 구현 팁 및 주의 사항
> **R2 버킷 CORS 명시 필수**: 외부 브라우저 단에서 클라우드 R2 오브젝트 스토리지로 다이렉트 `PUT` 헤더를 전송하여 쓰기 작업을 수행하기 위해서는 R2 대시보드의 CORS 정책 설정에서 허용 오리진(`AllowedOrigins`)과 허용 메서드(`PUT`, `GET`)를 정확하게 지정해야 Cross-Origin 요청 차단 사태를 겪지 않습니다.'
WHERE id = 'p19';

-- p20: Supabase 실시간 데이터베이스 연동기
UPDATE practice_projects
SET description = 'Supabase Realtime 데이터 스트림 구독 기능을 활용하여, 데이터베이스 테이블 상에 쓰기/수정/삭제 변이가 일어날 때마다 클라이언트 리스트 화면을 즉시 동기화해 주는 인터랙티브 채널을 구현합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- Supabase 대시보드에서 프로젝트를 생성하고, DB 연결용 클라이언트 SDK인 `@supabase/supabase-js` 모듈을 설치합니다.
- 시스템 환경변수 파일에 `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 셋업합니다.

### 🔐 핵심 기능 구현 단계
1. **[싱글톤 Supabase Client 인스턴스 구축]**: 컴포넌트 생명주기 및 렌더링에 독립적인 싱글톤 구조의 Supabase 클라이언트 접속 도구를 전역 선언해 둡니다.
2. **[실시간 브로드캐스트 채널 리스너 구성]**: `supabase.channel()` API를 구동하여 타겟 테이블의 변동 트랜잭션(`INSERT`, `UPDATE`, `DELETE` 이벤트)을 전체 모니터링 수신하는 리스너 파이프라인을 작성합니다.
3. **[화면 리스트 동기화 및 낙관적 업데이트]**: DB 이벤트 캡처 즉시 로컬 리액트 상태 배열(`setItems`)에 신규 항목을 정밀 매핑하여 반영하고, 스무스한 페이드인 애니메이션과 함께 목록을 갱신합니다.

### 💡 구현 팁 및 주의 사항
> **Replication 활성화 필수**: Supabase의 실시간 스트리밍은 기본적으로 꺼져 있으므로, 반드시 Supabase 대시보드의 **Database -> Replication** 메뉴로 진입하여 타겟 테이블의 실시간 송출 토글(`Source -> Realtime`)을 활성화 상태로 켜주어야 브라우저 클라이언트로 패킷이 안전하게 브로드캐스팅됩니다.'
WHERE id = 'p20';

-- p21: 토스페이먼츠 간편결제 연동
UPDATE practice_projects
SET description = '토스페이먼츠 결제창 연동 SDK 라이브러리를 바인딩하여 안전하게 결제 모달을 트리거하고, 결제 성공 랜딩 페이지 상에서 가맹점 백엔드 서버 검증(Confirm API) 과정을 처리하는 실전 흐름을 만듭니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 토스페이먼츠 개발자 가이드에 맞춰 `@tosspayments/payment-sdk` 모듈을 연동하거나 HTML 단에 클라이언트 SDK 임포트 태그를 배치합니다.
- 토스페이먼츠 콘솔의 테스트용 클라이언트 키와 시크릿 API 자격 증명을 획득합니다.

### 🔐 핵심 기능 구현 단계
1. **[Toss 결제 위젯 렌더링]**: 클라이언트 컴포넌트가 마운트되면 `loadPaymentWidget` 메서드를 실행하여 가로형 정렬 방식의 토스 결제 수단 스낵 UI를 동적으로 화면에 그립니다.
2. **[결제창 트리거 및 랜딩 콜백 지정]**: 사용자가 결제 버튼을 터치하면 `requestPayment` API를 호출하고 성공 수신 타겟 엔드포인트 URL(`successUrl`)과 에러 발생 랜딩 URL을 매핑합니다.
3. **[결제 승인 API 교차 검증]**: 결제 성공 라우트로 회귀 시 쿼리 스트링 파라미터(`paymentKey`, `orderId`, `amount`)를 발췌하여, 백엔드 API 단에서 토스페이먼츠 승인 엔드포인트(`/v1/payments/confirm`)로 검증 POST를 날려 최종 구매 확정 처리를 맺습니다.

### 💡 구현 팁 및 주의 사항
> **금액 위변조 방어책**: 해커가 결제 요청 직전에 클라이언트 자바스크립트 변수를 조작하여 초저가 결제를 시도하는 참사를 막기 위해, 백엔드 승인(Confirm) 단계 호출 전 가맹점 서버 DB에 보관 중이던 원본 주문 정보의 원화 금액과 토스로부터 랜딩된 `amount` 금액이 단 1원도 어긋나지 않는지 더블 검증하는 비즈니스 보호 로직이 필수로 요구됩니다.'
WHERE id = 'p21';

-- p22: Ollama API 연동 로컬 LLM 챗봇
UPDATE practice_projects
SET description = '로컬 컴퓨터 환경에서 기동하는 고성능 Ollama LLM(Llama3, Gemma2 등) API의 비동기 응답 채널을 Next.js 에지 API Route에 브릿징하여 실시간 스트리밍 타이핑 효과가 적용된 AI 챗 인터페이스를 완성합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 개발 PC 로컬 환경에 Ollama 클라이언트를 설치 및 기동하고, 가벼운 오픈소스 거대언어모델(`ollama run llama3` 등)을 사전에 pull 받아 구동해 둡니다.
- Next.js API Route 단에서 로컬 Ollama 기본 API 통신 주소(`http://localhost:11434`) 연동 준비 상태를 점검합니다.

### 🔐 핵심 기능 구현 단계
1. **[Ollama API 스트리밍 Route 설계]**: 백엔드 Route를 생성해 클라이언트의 질문들을 취합하고, Ollama 로컬 `/api/chat` 엔드포인트를 호출하되 JSON 페이로드에 `stream: true` 옵션을 포함시킵니다.
2. **[ReadableStream 데이터 릴레이]**: Ollama가 점진적으로 흘려보내 주는 텍스트 청크(chunk) 데이터 스트림을 인코딩하고, 클라이언트에 `text/event-stream` 포맷의 HTTP 응답으로 스무스하게 릴레이 송출합니다.
3. **[말풍선 스트리밍 타이핑 UI]**: 클라이언트 단에서는 `fetch`와 Reader 객체를 사용하여 유입되는 스트리밍 문자열을 실시간 취합하여 AI 말풍선 상태값을 갱신하고 스무스하게 아래로 자동 스크롤(Auto Scroll)을 유도합니다.

### 💡 구현 팁 및 주의 사항
> **로컬 CORS 설정 주의**: Ollama 인스턴스를 웹 브라우저에서 다이렉트로 직접 통신 시 CORS 보안 위반 차단 사태가 빈번하므로, Next.js 백엔드 레이어에서 API Route 프록시 교두보를 생성해 우회 통신하거나 Ollama 시스템 서비스 환경 변수에 `OLLAMA_ORIGINS="*" ` 설정을 심어두어야 안전합니다.'
WHERE id = 'p22';

-- p23: Chrome 확장 프로그램 템플릿
UPDATE practice_projects
SET description = '모던 브라우저 확장 프로그램 규격인 Manifest v3 구조를 준수하는 기본 템플릿을 개발하고, 백그라운드 서비스 워커 스크립트와 액션 팝업 HTML 간의 이기종 양방향 메시징 파이프라인을 구축합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 새 디렉토리에 Chrome 확장 프로그램의 메타 메인 파일이 될 `manifest.json` 파일을 생성합니다.
- 팝업창 UI 구성을 위한 `popup.html`, `popup.js` 및 `background.js` 파일을 빈 템플릿 파일로 배치합니다.

### 🔐 핵심 기능 구현 단계
1. **[Manifest v3 상세 규격 작성]**: `manifest_version: 3` 명세를 확립하고, 필요한 접근 권한(`activeTab`, `storage` 등)과 `background.service_worker`, `action.default_popup` 매핑 속성을 정의합니다.
2. **[Background Service Worker 구현]**: 브라우저 생명주기 이벤트(탭 변경, 주소 로딩 등)를 백그라운드 상에서 모니터링하여 감지하는 `background.js` 리스너를 기동시킵니다.
3. **[IPC 런타임 메시징 연동]**: 사용자가 우측 상단 플러그인 아이콘을 누르면 실행되는 팝업창 스크립트(`popup.js`) 단에서 `chrome.runtime.sendMessage` API를 활용해 백그라운드 서비스 워커 단과 비동기 연산 패킷을 주고받는 파이프를 완성합니다.

### 💡 구현 팁 및 주의 사항
> **로컬 디버깅 팁**: Chrome 브라우저의 확장 프로그램 관리 탭(`chrome://extensions`)으로 이동하여 우측 상단의 개발자 모드 토글을 켜고, ''압축해제된 확장 프로그램을 로드'' 버튼을 통해 로컬 개발 폴더를 로딩해 두어야 코드 수정 즉시 수동 새로고침 단추를 눌러 테스트를 반복 수행할 수 있어 기동력이 향상됩니다.'
WHERE id = 'p23';

-- p24_new: Tauri 데스크톱 파일 탐색기
UPDATE practice_projects
SET description = 'Rust 백엔드의 초경량 Native OS 제어 라이브러리와 React SPA 프론트를 Tauri 브릿지로 밀접하게 결합하여, 기기 내부의 파일 목록을 급속 스캔하고 시각화하는 전용 크로스플랫폼 탐색기 위젯을 제작합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- Rust 컴파일러 도구 묶음(rustup) 및 각 OS에 대응하는 C++ 빌드 필수 도구들을 셋업합니다.
- Tauri CLI 툴을 설치하고 `npx tauri init` 커맨드를 돌려 React 단과 `src-tauri` Rust 환경 뼈대를 구성합니다.

### 🔐 핵심 기능 구현 단계
1. **[Rust 파일 디렉토리 스캔 Command 설계]**: `src-tauri/src/main.rs` 단에 로컬 하드 드라이브의 경로 정보를 전달받아 하위 디렉토리 및 파일 메타 목록을 급속 스캔하는 `#[tauri::command]` Rust 전용 비동기 함수를 작성합니다.
2. **[tauri.conf.json 샌드박스 정책 셋업]**: 보안 사고를 미연에 제어하기 위해 Tauri 구성 파일의 fs 및 path 화이트리스트 접근 범위를 개발자가 정한 로컬 폴더(사용자 폴더 등) 범위 내로 타이트하게 제한해 둡니다.
3. **[React-Tauri invoke 통신 바인딩]**: React UI 단에서 Tauri 브릿지 라이브러리인 `@tauri-apps/api/core`를 호출하여 Rust 단의 스캔 커맨드를 `invoke` 호출하고, 수신된 JSON 목록 구조 데이터를 파싱하여 가로세로 대시 트리 뷰 UI로 그립니다.

### 💡 구현 팁 및 주의 사항
> **바이너리 용량 절감 요령**: 최종 데스크톱 네이티브 설치 바이너리(`.msi`, `.dmg`) 빌드(`npm run tauri build`) 시 Rust 컴파일 옵션 내 `lto = true` 및 `codegen-units = 1` 설정을 `Cargo.toml`에 주입하면 배포용 인스톨러의 설치 용량을 15MB 이하 수준으로 획기적으로 줄여줄 수 있어 유용합니다.'
WHERE id = 'p24_new';

-- p25: n8n 활용 자동 뉴스레터 메일링
UPDATE practice_projects
SET description = '설치형 오픈소스 자동화 엔진인 n8n을 기동하여 특정 RSS 피드 뉴스를 요약 가공하고, Google Gmail API를 연동하여 다수의 구독자 이메일 목록에 메일을 일괄적으로 발송해 주는 자동화 워크플로우를 완성합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- n8n 서비스 인스턴스를 로컬(Docker 혹은 npx 실행)이나 클라우드 VPS 환경에 안전하게 구동합니다.
- 메일 일괄 전송을 처리하기 위해 Google Cloud Console에 들어가 Gmail API 사용 설정을 켜고 OAuth2 클라이언트 보안 자격 인증서 키를 미리 저장합니다.

### 🔐 핵심 기능 구현 단계
1. **[RSS Feed 수집 노드 배치]**: n8n 워크플로우 캔버스 상에서 RSS Read 노드를 신규 마운트하고, 국내외 주요 기술 블로그의 RSS 피드 주소를 설정해 주기적으로 신규 게시글을 감지하도록 트리거를 조율합니다.
2. **[Markdown / HTML 이메일 템플릿 노드 연동]**: 데이터 가공 노드(Code Node 또는 Set Node)를 결합하여 뉴스레터의 격자형 디자인 메일 본문 마크업을 동적 조합하고 메일 바디 변수를 생성합니다.
3. **[Gmail Send 노드 및 자동화 배포]**: 최종 Gmail 발송 노드를 구성해 발급받은 OAuth2 Credential을 연동한 뒤, 구독자 배열 정보를 한 바퀴 돌면서 메일을 자동 메일링하는 파이프라인 워크플로우를 배포 및 가동합니다.

### 💡 구현 팁 및 주의 사항
> **Gmail 스팸 방어 주의**: 단시간 내에 n8n 자동화 봇으로 수백 통이 넘는 동일한 이메일을 외부 Gmail API로 쏘게 되면 Google 스팸 필터 레이어에 의해 API 접근 크리덴셜이 강제 회수될 수 있으므로, 루프 사이에 2~3초의 고의적인 시간차 딜레이 노드를 삽입하거나 외부 유료 전문 메일링 서비스(SendGrid 등) 연동을 추가하는 안전 조치를 권장합니다.'
WHERE id = 'p25';

-- adv-a1: 구독형 SaaS 과금 시스템
UPDATE practice_projects
SET description = 'Free, Pro, Enterprise 요금제 테이블을 구성하고 Stripe Checkout 결제 세션 API를 연동하여, 사용자의 실시간 정기 결제 갱신 및 해지 이벤트를 Webhook을 통해 안전하게 DB와 동기화하는 엔터프라이즈 과금 체계를 마스터합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- Stripe 가맹점 가입 후 개발 대시보드에서 정기 구독 상품(Pro Plan 및 Enterprise Plan)을 정의하고 API Secret Key와 Publishable Key를 발급받습니다.
- 서버단 환경변수에 Stripe Key와 Webhook 수신을 검증할 `STRIPE_WEBHOOK_SECRET`을 설정합니다.

### 🔐 핵심 기능 구현 단계
1. **[SaaS 요금제 구성 및 결제창 진입]**: UI 화면 상에서 3단계 플랜 설명 테이블을 렌더링하고, Pro 가입 버튼 선택 시 백엔드 단에서 `stripe.checkout.sessions.create` API를 쏘아 Stripe 다이렉트 카드 결제창 페이지로 안전하게 리다이렉트합니다.
2. **[성공 세션 매핑 및 DB 기록]**: 결제가 성공적으로 만료되면 돌아오는 랜딩 성공 라우트 상에서 세션 토큰 정보를 취득하여, 유저 테이블에 Stripe Customer ID와 구독 만료 타임스탬프 정보를 영속 저장합니다.
3. **[Stripe Webhook 수신 동기화]**: 사용자의 카드 잔액 부족 등으로 월 결제 갱신이 실패하거나(`invoice.payment_failed`) 사용자가 구독을 일방 해지했을 때(`customer.subscription.deleted`), Stripe 웹훅 수신 라우트에서 DB 상의 해당 사용자 등급 등 권한 상태를 강제 정지 처리합니다.

### 💡 구현 팁 및 주의 사항
> **일할 계산(Proration) 대책**: 사용자가 Pro 등급 중간에 Enterprise 플랜으로 교차 업그레이드를 단행할 경우, 남은 날짜만큼의 일할 차감 금액이 다음 청구서에 자동 합산되는 Stripe 고유의 계산 메커니즘을 백엔드 비즈니스 로직 단에서도 안전하게 인지하고 예외 처리를 반영해야 중복 결제 민원 사태를 막을 수 있습니다.'
WHERE id = 'adv-a1';

-- adv-a2: HTML5 Canvas 미니게임 엔진
UPDATE practice_projects
SET description = 'HTML5 Canvas 2D 그래픽 렌더링 컨텍스트를 활용해 requestAnimationFrame 루프로 상시 기동하며 작동하는 2D 게임 엔진을 개발하고, 캐릭터 조작 물리 연산과 장애물 충돌 감지 오버레이 스코어보드를 동기화합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- React 컴포넌트 내부에서 `useRef` 훅을 바인딩한 `<canvas>` 엘리먼트를 마운트하고, 렌더링의 핵심이 될 `getContext("2d")` 객체를 준비합니다.
- 게임 상태(Player 위치, Obstacle 장애물 배열, 점수 스토어) 관리 구조를 설계합니다.

### 🔐 핵심 기능 구현 단계
1. **[60FPS 렌더링 게임 루프 구축]**: `requestAnimationFrame`을 활용한 무한 재귀 렌더링 루프를 구성하고, `window.addEventListener("keydown")`을 매핑하여 키보드 방향키 조작에 기민하게 반응하도록 설계합니다.
2. **[2D 물리 연산 및 AABB 충돌 알고리즘]**: 플레이어 캐릭터의 중력, 관성 마찰 및 점프 높이 위치 가산 수식을 설계하고, 루프 회전 주기마다 캐릭터와 장애물 사각형의 경계 박스 충돌(Axis-Aligned Bounding Box)을 정밀 산출합니다.
3. **[점수 트래킹 및 Canvas 오버레이 렌더링]**: 충돌 즉시 게임 중단 팝업창을 캔버스 중앙에 부드럽게 드로잉하고, 플레이 도중 가산된 최종 점수 상태를 동적 업데이트하여 스코어판에 출력합니다.

### 💡 구현 팁 및 주의 사항
> **Delta Time 기반 물리 보정**: 모니터의 화면 주사율(60Hz, 144Hz 등)에 따라 물리 연산 속도가 제각각 빨라지는 게임 가속도 버그를 원천 봉쇄하려면, 이전 프레임과 현재 프레임의 간격 타임스탬프 차이(`delta time`)를 물리 위치 변화량에 곱 연산해 주는 델타 타임 물리 보정을 넣는 것이 정석입니다.'
WHERE id = 'adv-a2';

-- adv-a3: 광고 수익화 SDK 연동
UPDATE practice_projects
SET description = '구글 애드센스(Google AdSense)의 반응형 디스플레이 광고 유닛 스크립트를 SPA 환경에 유기적으로 탑재하고, 유저 브라우저 상의 광고 차단(AdBlocker) 플러그인 유무를 지능적으로 감지해 대체 뷰를 노출하는 실전형 수익화 연동 가이드를 제시합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 구글 애드센스 콘솔에 가입하고 발행받은 파트너 ID와 광고 유닛 ID(`data-ad-client`, `data-ad-slot`) 식별 값을 확보합니다.
- HTML 헤더 템플릿에 애드센스 비동기 클라이언트 엔진 주소를 마운트해 둡니다.

### 🔐 핵심 기능 구현 단계
1. **[React SPA 전용 디스플레이 광고 카드 구현]**: 사용자의 뷰포트에 맞추어 너비가 조절되는 반응형 광고 엘리먼트 컨테이너를 배치하고, `useEffect` 마운트 시점에 맞춰 `(window.adsbygoogle = window.adsbygoogle || []).push({})` 스크립트를 기동합니다.
2. **[광고 로딩 차단 AdBlock 감지 시스템]**: 광고 영역에 임의의 더미 광고 배너 클래스(예: `adsbox` 혹은 `doubleclick` 등 광고 차단 프로그램이 적극 탐색해 가리는 클래스명)를 지닌 안보이는 요소를 삽입하고, 마운트 직후 높이(`offsetHeight`) 값이 0으로 짜부라드는지 체크하여 애드블록 활성화 유무를 탐지합니다.
3. **[양질의 대체 UI 노출]**: 애드블록 플러그인에 의해 광고 파일 로드가 원천 무산되었음이 확인되면, 빈자리 회색 여백 대신 ''바이브코더 서비스의 지속적인 발전을 위해 광고 차단 설정을 잠시 해제해 주세요''라는 커스텀 안내 배너 및 멤버십 전환 가이드를 품위 있게 띄워줍니다.

### 💡 구현 팁 및 주의 사항
> **SPA 라우팅 전환 오작동 예방**: 싱글 페이지 어플리케이션(SPA) 특성상 페이지를 넘나들며 광고 스크립트 실행 함수(`push`)가 반복해서 다중 호출되면 애드센스 라이브러리가 크래시되거나 브라우저 경고가 누적되므로, 페이지 언마운트 시점에 해당 광고 슬롯 인스턴스 참조를 깔끔하게 리셋 및 가비지 컬렉션 처리를 가해 주어야 장시간 브라우저 점유 중 메모리 누수가 발생하지 않습니다.'
WHERE id = 'adv-a3';

-- adv-b1: React Native 크로스플랫폼 앱
UPDATE practice_projects
SET description = 'Metro 번들러 세팅, iOS/Android 각각의 상이한 노치 및 SafeArea 영역 제어를 수행하고, 햅틱 피드백 및 모바일 전용 터치 슬라이더 제스처 제어를 완벽하게 바인딩하는 고성능 모바일 앱 개발 기술을 습득합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- React Native CLI 또는 Expo CLI 개발 킷을 설치하고 모바일 시뮬레이터(Xcode iOS / Android Studio Emulator) 환경이 정상 작동하는지 사전 진단합니다.
- 모바일 뷰 작성을 위해 `react-native`, `react-native-gesture-handler` 라이브러리를 연동합니다.

### 🔐 핵심 기능 구현 단계
1. **[SafeArea 및 플랫폼별 레이아웃 제어]**: 최상단 노치나 하단 터치바 영역 침범을 예방하기 위해 `SafeAreaView` 컴포넌트로 코어를 묶고, `Platform.OS` 분기를 통과시켜 iOS와 Android의 컴포넌트 여백 높이를 픽셀 단위로 동적 스왑합니다.
2. **[제스처 핸들러 슬라이드 제어]**: `PanGestureHandler` 훅을 셋업하여 손가락 드래그 터치 이동 거리를 동적 가산하고, 메인 대시보드 카드가 손끝 움직임에 따라 쫀득하고 부드럽게 좌우로 미끄러지는 스와이핑 액션 카드를 연출합니다.
3. **[네이티브 진동 및 햅틱 피드백]**: 버튼 탭이나 스와이프 완료 등 중요 상호작용 도달 순간 `Haptics.notificationAsync` API를 호출해 손끝에 전해지는 묵직한 진동 반응을 트리거하여 UI 반응 품질을 향상시킵니다.

### 💡 구현 팁 및 주의 사항
> **Flexbox 방향 구조 주의**: React Native의 CSS는 웹 표준과 다르게 `flex-direction`의 기본 디폴트 지배 구조가 세로 방향(`column`)이므로, 웹 프론트엔드 작업에 익숙했던 개발자가 가로 단추 등을 그릴 때 가로 정렬(`row`) 속성을 명시적으로 재할당해 주는 습관을 들이지 않으면 시작부터 UI 레이아웃이 뭉개지기 일쑤이므로 주의해야 합니다.'
WHERE id = 'adv-b1';

-- adv-b2: PWA 오프라인 서비스 워커
UPDATE practice_projects
SET description = '오프라인 네트워크가 완전히 끊긴 절체절명의 오지 환경에서도 웹 사이트가 앱처럼 정상적으로 열리고 기동하도록, Service Worker 백그라운드 캐싱 라이프사이클을 돌려 안전한 오프라인 대체 웹 페이지 환경을 만듭니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 웹 서비스 디렉토리 최상단 루트 경로에 `manifest.json` 모바일 전용 인앱 메타파일과 `service-worker.js` 스크립트를 마련합니다.
- 서비스 워커가 정상적으로 설치 및 실행될 수 있도록 안전한 로컬 HTTPS 보안 서버 환경을 구비해 둡니다.

### 🔐 핵심 기능 구현 단계
1. **[서비스 워커 설치 및 활성화 사이클]**: 브라우저 메인 단에서 `navigator.serviceWorker.register` 명령어를 쏘아 백그라운드 상주를 개시하고, 서비스 워커의 `install` 및 `activate` 이벤트를 받아 구동 준비를 맺습니다.
2. **[핵심 CSS/JS 정적 에셋 로컬 프리캐싱]**: `caches.open()` API를 활용해 사이트 구동에 절대 필수적인 로컬 JS, CSS 폰트 및 로고 이미지들을 로컬 캐시 메모리에 통째로 캐싱 저장합니다.
3. **[네트워크 절단 오프라인 대체 렌더링]**: `fetch` 이벤트를 중간에 가로채(intercept) 네트워크 수신 패킷과 캐시 자원을 상호 비교하고, 인터넷 연결이 아예 무너진 상태에서는 캐싱해 두었던 로컬 자원을 다이렉트 공급하며, 새롭게 요청한 미캐싱 페이지에는 ''인터넷 연결이 꺼져 있습니다'' 커스텀 대체 HTML 문서를 브라우저에 반환합니다.

### 💡 구현 팁 및 주의 사항
> **강제 캐싱 지연 주의**: 브라우저는 `service-worker.js` 스크립트 파일을 기가 막히게 메모리에 캐싱하므로 코드 수정사항을 즉각 릴리즈하기 곤란합니다. 반드시 웹 서버 HTTP 헤더 응답 설정 시 서비스 워커 파일 자체에 대해서만은 `Cache-Control: no-store, no-cache` 헤더를 강제 셋업해 두는 편이 현명합니다.'
WHERE id = 'adv-b2';

-- adv-b3: Capacitor 네이티브 카메라 연동
UPDATE practice_projects
SET description = '기존에 존재하던 Next.js/React 웹 사이트를 하이브리드 앱으로 즉시 래핑하고, Capacitor Camera API를 사용해 Android/iOS의 네이티브 카메라 장치 구동 권한을 획득하여 실시간 사진을 캡처합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 기존 Next.js 웹 폴더 상에 `@capacitor/core`, `@capacitor/cli` 및 `@capacitor/camera` 모듈을 설치합니다.
- `npx cap add ios` 및 `npx cap add android` 커맨드를 가동하여 모바일 개발 폴더를 빌드 생성해 둡니다.

### 🔐 핵심 기능 구현 단계
1. **[OS 네이티브 장치 권한 명세 설정]**: iOS의 `Info.plist` 및 Android의 `AndroidManifest.xml` 메타 구성 파일 내부에 사용자 카메라 장치 구동 목적 명칭 및 포토 앨범 권한 획득 문구를 정확하게 써넣어 빌드 사전을 채웁니다.
2. **[Capacitor 카메라 하드웨어 인터페이스]**: 클라이언트 자바스크립트 단에서 `Camera.checkPermissions()` 훅을 기동하고 권한이 거부되어 있다면 다이얼로그 시스템 팝업을 울려 승인을 받습니다.
3. **[네이티브 사진 촬영 및 실시간 렌더링]**: `Camera.getPhoto` 명령을 쏘아 기기의 네이티브 카메라 하드웨어를 직접 기동하여 캡처한 이미지 원본 바이너리를 BASE64 주소로 받아 화면에 이미지 뷰 컴포넌트로 로드합니다.

### 💡 구현 팁 및 주의 사항
> **webDir 빌드 경로 수평 싱크**: 웹 정적 빌드를 릴리즈 시 아웃풋 디렉토리 주소(예: Next.js의 `out` 또는 `.next`)와 Capacitor 설정 파일(`capacitor.config.json`) 내 `webDir` 파라미터 대상 경로가 한 치의 오차도 없이 일치해야 `npx cap copy`를 쳤을 때 모바일 프로젝트로 에셋이 누락 없이 정상 복사 릴리즈됩니다.'
WHERE id = 'adv-b3';

-- adv-b4: VS Code 확장 프로그램 제작
UPDATE practice_projects
SET description = 'VS Code의 강력한 에디터 내부 라이브러리(VSX API)를 사용하여, 텍스트 가공용 단축키 커스텀 명령어 등록, 에디터 영역 텍스트 변환 및 타이핑 시 연관 코드를 채워주는 지능형 자동완성 확장을 만듭니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- VS Code 확장 프로그램 보일러플레이트 자동 생성 도구인 `yo generator-code` 모듈을 전역으로 설치합니다.
- Yeoman 도구의 질문 절차를 따라 TypeScript 기반 VS Code 확장 프로그램 빈 폴더를 프로비저닝합니다.

### 🔐 핵심 기능 구현 단계
1. **[package.json 확장 매니페스트 선언]**: `package.json` 파일의 `contributes.commands` 단에 에디터 단축키를 눌렀을 때 반응할 커스텀 명령어 식별 코드와 제목을 추가합니다.
2. **[Editor Active Text 가져오기 및 조작]**: `extension.ts` 소스의 `activate` 훅 내부에서 `vscode.window.activeTextEditor` 객체를 취득하여, 유저가 마우스 드래그로 지정한 활성 선택 텍스트 영역의 알파벳 대소문자를 급변시키는 가공 알고리즘을 짭니다.
3. **[IntelliSense 자동완성 제공자 기여]**: `vscode.languages.registerCompletionItemProvider` API를 연결하고 트리거 문자(예: `$` 혹은 `@`)를 모니터링하여, 사용자가 타이핑 시 사전에 미리 준비한 특수 코드 템플릿 상자 목록을 드롭다운 툴팁으로 자동 주입합니다.

### 💡 구현 팁 및 주의 사항
> **F5 개발 호스트 디버깅**: 개발 환경에서 확장 프로그램의 실시간 버그 테스트를 위해서는 VS Code 상단 실행 탭에서 `F5` 키를 가볍게 눌러주면, 내가 짠 코드가 임시 마운트되어 실행되는 깨끗한 ''확장 개발 호스트'' 새 에디터 창이 뜨므로 이 전용 창을 활용해 디버깅을 기동성 있게 진행하세요.'
WHERE id = 'adv-b4';

-- adv-c1: Docker 컨테이너 원클릭 배포
UPDATE practice_projects
SET description = 'Dockerfile 멀티 스테이지 빌드 최적화 기법을 적용해 Next.js 앱 컨테이너의 덩치를 극단적으로 좁히고, Docker Compose로 복수의 앱과 캐시 서버를 묶어 원클릭 자동 배포하는 쉘 프로세스를 다듬습니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 사용 중인 로컬 머신 또는 타겟 Linux VPS 서버 환경에 Docker 및 Docker Compose 킷이 설치되어 구동 중인지 터미널 버전 조회를 통해 선제 점검합니다.
- 프로젝트 최상단 디렉토리 상에 `Dockerfile`과 `docker-compose.yml` 빈 텍스트 문서를 작성합니다.

### 🔐 핵심 기능 구현 단계
1. **[Dockerfile 멀티 스테이지 빌드]**: 개발 도구와 프로드 런타임의 환경 레이어를 철저히 이격하기 위해 `node:alpine` 기반 종속성 설치 스테이지(Build stage)와 오직 정적 산출물만을 복사해 기동하는 최후의 미니멀 런타임 스테이지를 구분해 이미지 빌드 용량을 80% 이상 최적화합니다.
2. **[Docker Compose 복수 컨테이너 오케스트레이션]**: `docker-compose.yml` 명세 상에 Next.js 빌드 서비스 컨테이너와 메모리 캐시 최적화용 Redis DB 컨테이너를 함께 바인딩하고 내부 동일 네트워크 포트로 격리 연결망을 선언합니다.
3. **[원클릭 deploy.sh 배포 쉘 구현]**: Git 저장소 풀(Pull), Docker Compose의 다운 타임 없는 재빌드 및 불필요한 미사용 캐시 이미지 일괄 소거(`docker image prune -f`) 과정을 한 줄의 쉘 파일로 실행 기동되게 스크립팅합니다.

### 💡 구현 팁 및 주의 사항
> **.dockerignore 명세 선언 필수**: 로컬 개발 폴더의 무거운 `node_modules` 폴더나 절대 노출되어선 안 되는 `.env.local` 같은 민감 비밀 환경 변수 보안 파일들이 Docker 빌드 컨텍스트에 포함되어 컨테이너 깊숙이 압축 빌드되는 치명적인 보안 탈루 사고를 모면하려면, 빌드 배제 파일 목록인 `.dockerignore` 파일을 Dockerfile과 함께 가장 먼저 작성해 두는 습관이 극도로 권장됩니다.'
WHERE id = 'adv-c1';

-- adv-c2: Linux VPS 초기 세팅 자동화
UPDATE practice_projects
SET description = '클린 상태의 리눅스 가상 서버를 인계받은 직후, 비밀번호 차단 SSH Key 접속 세팅, UFW 방화벽 구성 및 필수 Node/Nginx 패키지를 원클릭으로 완벽 세팅하는 배포 쉘 스크립트 엔진을 만듭니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 국내외 클라우드 인프라사(AWS, Cafe24 등)에서 클린 상태의 우분투 리눅스(Ubuntu 22.04 LTS 권장) VPS 가상 서버 인스턴스를 즉각 발급받고 root 패스워드를 인지합니다.
- 로컬 머신 단에서 안전한 비공개 키쌍(`ssh-keygen`) 파일을 준비합니다.

### 🔐 핵심 기능 구현 단계
1. **[SSH Key 기반 무작위 대입 해킹 완전 봉쇄]**: 로컬 비공개 키값을 VPS 서버 `/root/.ssh/authorized_keys`에 주입한 뒤, 리눅스 SSH 설정 정보(`/etc/ssh/sshd_config`)를 건드려 비밀번호로 접속하려는 모든 트래픽을 거부(`PasswordAuthentication no`) 처리하고 SSH 기본 포트를 변경합니다.
2. **[UFW 서버 방화벽 원격 차단 장치]**: 우분투 리눅스에 UFW 보안 방화벽을 구동하여 22(SSH 임시포트), 80(HTTP Web), 443(HTTPS SSL) 포트 이외에 미사용 포트로 불시에 유입되는 전체 해커 소켓 인바운드 연결망을 깔끔히 드롭시킵니다.
3. **[원라인 환경 구축 패키지 Bash 쉘 작성]**: `apt update` 구동, Node.js 필수 LTS 버전 내려받기, 리버스 프록시로 동작할 Nginx 및 SSL 암호화 인증서 자동 발급용 Certbot 툴을 차례대로 에러 없이 자동 셋업하는 통합 `.sh` 스크립트를 빌드 릴리즈합니다.

### 💡 구현 팁 및 주의 사항
> **방화벽 차단 자폭 사태 예방**: 방화벽을 강제 활성화하는 명령어(`ufw enable`)를 수행하기 바로 전 단계에서 반드시 SSH 서비스 접근 허용(`ufw allow 22` 혹은 변경된 포트 대역) 규칙을 서버에 먼저 영속 선언해 두어야 합니다. 이 순서를 망각하고 ufw를 켜면 현재 연결된 SSH 원격 쉘 세션이 즉시 차단당해 서버에 절대 재접속할 수 없는 처참한 자폭 파국을 맞이하게 되므로 유의해야 합니다.'
WHERE id = 'adv-c2';

-- adv-c3: Electron 시스템 트레이 알림 앱
UPDATE practice_projects
SET description = 'Electron 데스크톱 엔진 환경에서, 메인 백그라운드 프로세스와 렌더러 웹뷰 프로세스 간의 IPC 통신 구조를 세우고, 작업 표시줄 트레이 아이콘 최소화 기능 및 시스템 OS 고유 푸시 알림 발송 채널을 구성합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 데스크톱 프레임워크인 `npm install electron --save-dev` 종속성을 설치합니다.
- 패키지 매니페스트에 메인 프로세스로 동작할 `main.js`와 화면 단 리소스를 책임질 `index.html` 및 preload 보안용 브릿지 파일을 생성합니다.

### 🔐 핵심 기능 구현 단계
1. **[운영체제 시스템 트레이 바인딩]**: Electron 메인 루프 단에서 OS 작업 표시줄 우측 영역에 상주할 `Tray` 객체 인스턴스를 선언하고, 트레이 전용 마스크 처리된 알파 채널 PNG 아이콘 이미지를 로드하여 바인딩합니다.
2. **[메인 윈도우 팝오버 토글 제어]**: 창의 닫기 버튼 터치 시 데스크톱 앱을 완전 종료시키는 대신 시스템 트레이의 안보이는 영역으로 최소화(`window.hide()`)하고, 유저가 작업 표시줄 아이콘을 더블클릭할 시 메모리에 보관 중이던 창을 그 자리에서 스무스하게 띄워 복구하는 이벤트 제어 시스템을 구축합니다.
3. **[IPC 양방향 브릿지 및 OS 푸시 알림]**: 렌더러 단의 버튼 클릭이나 스케줄러 트리거 발생 이벤트를 IPC(`ipcRenderer.send`)로 메인에 실어 나르고, 메인 단에서 OS 고유 네이티브 `Notification` 모듈을 실행하여 윈도우/맥 데스크톱 우측 하단에서 슬라이드로 팝업되는 무선 푸시 알림 채널을 활성화합니다.

### 💡 구현 팁 및 주의 사항
> **플랫폼별 트레이 규격 분기**: Windows용 트레이 아이콘 파일은 32x32 크기에 컬러 파일이 유연하게 렌더링되지만, macOS 환경에서는 16x16 또는 22x22 스펙에 다크모드/라이트모드 자동 감지 대응을 위한 알파 채널 모노크롬 특수 템플릿 파일명(예: `IconTemplate.png`) 구조 규약을 철저하게 지켜 컴파일해 주어야 그래픽 깨짐 참사를 미연에 방지할 수 있습니다.'
WHERE id = 'adv-c3';

-- adv-d1: GitHub Actions CI/CD 파이프라인
UPDATE practice_projects
SET description = 'push/PR 이벤트 발생 시 리포지토리의 소스코드를 안전하게 빌드하여, Lint 검사 및 단위 테스트를 자동으로 돌리고, 무결성 통과 판정 시 Cloudflare Pages/AWS 원격 배포 파이프라인까지 무중단 고속 자동화하는 최상위 자동 배포 파이프라인을 구축합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- 저장소 루트에 GitHub 시스템이 자동 분석 감지할 `.github/workflows/deploy.yml` YAML 구성 파일을 배치합니다.
- 타겟 인프라(Cloudflare 또는 AWS)에 안전히 무선 접속하기 위한 API 인증 토큰을 획득하여 GitHub 저장소 Settings -> Secrets -> Actions 메뉴에 보안 상수로 엄격히 등록해 둡니다.

### 🔐 핵심 기능 구현 단계
1. **[워크플로우 트리거 및 가상 인프라 구축]**: main 브랜치로의 `push` 또는 `pull_request` 발생 이벤트를 포착하여 workflow가 기동하도록 정의하고, 가상 러너 인스턴스인 `ubuntu-latest` 격리 리눅스 런타임을 구동합니다.
2. **[자동화 Lint & Unit Test 검증 단계]**: `actions/checkout` 스텝으로 가상 가상 컨테이너에 내 소스코드를 동기화해 옮겨놓고, 지정 패키지 버전을 설치한 뒤 `npm run lint` 및 `npm run test` 품질 보증 명령어를 통과시키는 검증 파이프를 작성합니다.
3. **[인프라 즉시 릴리즈 및 무중단 배포]**: 무결성 검사가 올 패스로 성공 처리되면, 빌드된 파일들을 `cloudflare/wrangler-action` 또는 `aws-actions`를 경유해 타겟 클라우드 서버리스 인프라에 배포하는 자동 릴리즈 파이프라인을 완성합니다.

### 💡 구현 팁 및 주의 사항
> **동적 캐싱을 통한 빌드 가속**: 매 릴리즈 배포마다 수백 메가의 `node_modules` 패키지를 매번 바닥에서부터 새로 내려받는 비효율적인 시간 소모를 차단하기 위해, `actions/cache` 혹은 `actions/setup-node` 스텝 내부에 제공되는 npm 캐싱 옵션(`cache: ''npm''`)을 YAML 단축 선언 한 줄로 설정해 빌드 주기 시간을 60% 이상 드라마틱하게 단축하는 습관을 들이는 것이 비즈니스 비용 면에서 절대적으로 유리합니다.'
WHERE id = 'adv-d1';

-- adv-d2: AI 블로그 포스팅 자동 생성기
UPDATE practice_projects
SET description = 'OpenAI GPT-4o 또는 Google Gemini API 채널을 개설하여, 지정 키워드에 입각한 정교한 구조화 프롬프트를 전송해 완성도 높은 마크다운 콘텐츠를 출력하고, 이를 국내 주요 블로그 CMS(Tistory, WordPress) API로 원스톱 포스팅하는 자동 발행 시스템을 제작합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- OpenAI 개발자 API 콘솔 또는 Google AI Studio에 접속하여 개인 결제 연동 및 Secret API Key를 취득합니다.
- 백엔드 노드 단에 `@google/generative-ai` 혹은 `openai` 모듈 설치를 마칩니다.
- 발행 처리를 맡길 Tistory / WordPress 블로그 계정의 REST API Access Token 키를 확보합니다.

### 🔐 핵심 기능 구현 단계
1. **[정교한 구조화 AI 프롬프트 엔지니어링]**: AI 모델을 호출하되, 단순한 설명글이 아닌 검색엔진 상위 노출에 적합한 단락 구성(H2, H3 태그 등), 타겟 전문 필진 페르소나 주입 및 가독성 높은 한국어 문어체 포맷 지시를 담은 시스템 지시 프롬프트를 취합해 API에 전달합니다.
2. **[생성 텍스트 마크다운 정제]**: 수신된 결과 JSON 버퍼 및 답변 청크를 파이팅하여 깨진 문자열이나 불필요한 서두를 발라내고, 가독성 넘치는 마크다운 규격 및 HTML 포맷 문자열로 변환 직렬화합니다.
3. **[블로그 CMS REST API 자동 업로드]**: 생성 완료된 타이틀 제목과 본문 스트링을 포장하여 WordPress REST API(`/wp-json/wp/v2/posts`) 혹은 Tistory API 엔드포인트로 POST 전송해 클릭 한 번에 실제 블로그에 원스톱으로 비밀글/발행 게시글이 신규 등록되는 스케줄러 봇을 마감합니다.

### 💡 구현 팁 및 주의 사항
> **검색 엔진 저품질 우회 대책**: 매번 일관된 기계적 투로 블로그 글을 다수 찍어내면 포털 검색봇이 즉시 ''AI 자동화 저품질 문서''로 감지해 블로그 노출을 완전 영구 차단(Sandbox 페널티)시켜 버립니다. 이를 피하기 위해 API 매개변수 중 답변의 예측 불허 다양성을 올리는 `temperature` 값을 0.75 선으로 기분 좋게 튜닝하고, AI 답변 끝부분에 사람다운 말투 변환 규칙을 강제 적용하는 2차 검수 로직을 쉘터로 포함해야 안전합니다.'
WHERE id = 'adv-d2';

-- adv-d3: SNS 자동 포스팅 봇
UPDATE practice_projects
SET description = 'X(구 트위터) Developer Portal 및 Meta Graph API 권한을 획득하고 OAuth 2.0 세션을 셋업하여, Sharp 이미지 리사이징 자동화를 거친 후, 지정 시각마다 플랫폼에 마케팅 피드를 발송하는 소셜 자동 포스팅 기계를 조립합니다.',
    content = '### 🛠 실습 준비 및 환경 설정
- Meta Developer 계정 및 X 개발자 포털에 들어가서 API App을 개설하고 OAuth 2.0 자격 증명 토큰 및 리프레시 토큰을 안전하게 획득합니다.
- 백엔드에 이미지 처리를 맡을 고성능 `sharp` 라이브러리와 `twitter-api-v2` 또는 페이스북 Graph API SDK 모듈을 설치합니다.

### 🔐 핵심 기능 구현 단계
1. **[Sharp 이미지 소셜용 자동 리사이징]**: 업로드 대상 그래픽 이미지를 SNS별 최적 규격(X용 2:1 피드 이미지, 인스타그램용 1:1 또는 4:5 직사각형 픽셀)에 맞춰 찌그러짐 없이 오토 크롭하고 용량을 슬림화하는 Sharp 파이프라인 배치 가공기를 완성합니다.
2. **[OAuth 2.0 Access Token 기반 API 업로드]**: 수득한 OAuth 권한 토큰을 기반으로 가공된 카드 뉴스를 미디어 API로 우선 무선 업로드한 뒤, 수신된 media_id 정보와 하이퍼링크가 걸린 텍스트 메시지를 최종 바인딩하여 X 피드 혹은 인스타그램 비디오/피드로 POST 발행합니다.
3. **[배치 스케줄러(Cron) 시간 연동 가동]**: Node-cron 헬퍼 모듈 또는 OS 스케줄러 시스템을 기동하여 유저 유입이 가장 조밀하게 활성화되는 황금 황금 시간대(예: 아침 9시 및 저녁 6시)에 맞춰 포스팅이 무인으로 발사되는 Cron 봇을 활성화합니다.

### 💡 구현 팁 및 주의 사항
> **Rate Limit 위반에 대응하는 예외 복구**: SNS 사들은 기계적인 대량 유포 스팸성 도배 봇을 극단적으로 검열하기 위해 API 호출 제한(Rate Limits)을 매우 빡빡하게 유지합니다. 봇이 한 번에 너무 많은 플랫폼에 동시 호출을 쏘면 계정이 강제 동결(Ban)될 수 있으므로, 플랫폼 간 발송 시각에 20초 이상의 안전 갭(지연)을 확보하고 API 오류코드 발생 시 리프레시 토큰을 자동으로 다시 갱신해 재시도(Retry)하는 방어적 래퍼 함수 구조를 적용해 두어야 봇이 한밤중에 크래시로 뻗는 불상사를 철저히 차단할 수 있습니다.'
WHERE id = 'adv-d3';

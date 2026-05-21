import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

interface PracticeProject {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tags: string;
  curriculum_link: string;
  views?: string;
  completion_rate: number;
  icon_name: string;
  is_hidden: number;
  content: string;
  created_at?: string;
}


// GET: 리스트 조회
export async function GET(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      console.error("getRequestContext failed:", e);
    }
    const env = context?.env;

    if (!env || !env.DB) {
      if (process.env.NODE_ENV === 'development') {
        const mockProjects = [
          { 
            id: '1', 
            title: '로그인 기능 만들기 (Dev)', 
            description: '이메일 형식 유효성 체크 및 패스워드 최소 8자 이상 입력 조건을 검증하고, 로그인 성공 시 세션/쿠키를 생성하며, 잘못된 정보 입력 시 사용자 친화적인 에러 메시지를 표시해야 합니다.', 
            level: '입문', 
            category: '인증/보안', 
            tags: '인증,폼 처리', 
            curriculum_link: '2회차 - 인증 기초', 
            views: '12.4K', 
            completion_rate: 3, 
            icon_name: 'ShieldCheck', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- React hook form 및 Zod (유효성 검사용) 설치를 권장합니다.\n- 인증 상태를 클라이언트 전역으로 공유할 수 있는 AuthContext 파일을 생성합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[인풋 제어 및 유효성 검사]**: 이메일 정규표현식 매칭 및 비밀번호 유효성 조건을 검사하여 실시간 에러 경고를 UI에 반영합니다.\n2. **[API 연동 및 에러 처리]**: Mock API를 사용하여 자격 증명을 전송하고, 네트워크 오류나 계정 불일치 시 401 에러와 오류 메시지를 화면에 출력합니다.\n3. **[로그인 상태 영속화]**: 인증 토큰을 브라우저의 Cookie 또는 LocalStorage에 저장하여 새로고침 시에도 로그인 상태가 풀리지 않도록 조치합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **보안 권장**: 비밀번호 및 토큰과 같은 민감 정보는 어떠한 경우에도 일반 텍스트 형태로 로컬 저장소에 상시 노출되어선 안 되며, HTTPS 환경에서만 전송되도록 보안 옵션을 고려하세요.`
          },
          { 
            id: '2', 
            title: '할 일 리스트 (Dev)', 
            description: '새로운 할 일 등록(Create), 목록 렌더링 및 완료 체크(Read/Update), 할 일 삭제(Delete) 기능을 포함하고, 데이터 상태를 LocalStorage에 실시간 동기화하여 지속성을 보장해야 합니다.', 
            level: '기초', 
            category: 'CRUD', 
            tags: 'CRUD,로컬스토리지', 
            curriculum_link: '3회차 - 상태 관리', 
            views: '8.7K', 
            completion_rate: 2, 
            icon_name: 'CheckCircle2', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- React의 기본 Hook인 \`useState\`와 \`useEffect\`만을 사용하여 외부 도구 없이 순수 리액트 상태 구조로 실습을 준비합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[목록 추가 및 출력]**: 사용자 텍스트 입력을 받아 유니크한 ID값(\`Date.now()\` 활용)을 지닌 Todo 객체를 생성하고 목록 리스트에 동적 렌더링합니다.\n2. **[완료 상태 토글]**: 각 Todo 카드의 체크박스를 눌렀을 때 특정 Todo 객체의 \`completed\` 상태 불리언 값을 실시간 반전 업데이트합니다.\n3. **[LocalStorage 동기화]**: \`useEffect\` 훅을 활용하여 Todo 배열 상태가 변경될 때마다 로컬저장소에 JSON 문자열로 저장하고, 최초 컴포넌트 마운트 시 이를 로드해 초기 상태를 채웁니다.\n\n### 💡 구현 팁 및 주의 사항\n> **UX 개선**: 사용자가 빈 텍스트를 등록하지 못하게 앞뒤 공백을 제거(\`.trim()\`)하는 예외 처리를 필수로 반영하고, 목록이 비어있을 때 친절한 플레이스홀더를 보여주세요.`
          },
          { 
            id: 'p29_comments', 
            title: '방명록 및 댓글 작성기', 
            description: '간단한 방명록 입력 폼을 통해 메시지를 등록하고, 등록된 각 글에 실시간 댓글을 달거나 수정/삭제할 수 있는 중첩 구조의 CRUD 코멘트 시스템을 구축합니다.', 
            level: '기초', 
            category: 'CRUD', 
            tags: 'CRUD,폼 제어,상태관리', 
            curriculum_link: '3회차 - 상태 관리', 
            views: '3.2K', 
            completion_rate: 3, 
            icon_name: 'MessageSquare', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 컴포넌트 내부 상태를 리액티브하게 제어하기 위해 \`''use client'';\` 지시어를 클라이언트 컴포넌트 상단에 명시합니다.\n- 작성자 이름과 본문을 입력받을 수 있는 입력 폼(Input & Textarea) 및 등록 버튼이 있는 레이아웃을 마크업으로 작성합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[메시지 등록 및 조회]**: \`useState\` 훅을 활용하여 방명록 목록 상태 배열(\`messages\`)을 선언하고, 폼 제출 시 유니크한 ID와 작성일이 포함된 메시지 객체를 배열 맨 앞에 결합(\`[newMsg, ...prev]\`)하여 렌더링합니다.\n2. **[실시간 댓글 중첩 CRUD]**: 각 방명록 카드 내부에 댓글 리스트 상태를 서브 배열로 두거나, 방명록 ID를 키값으로 하는 평탄화된 댓글 맵(\`commentsMap\`) 상태를 모델링하여, 특정 방명록에 종속된 댓글을 생성, 조회, 삭제할 수 있도록 다차원 상태를 가공합니다.\n3. **[게시글 수정 및 즉시 삭제]**: 유저가 수정 모드로 전환(\`isEditing\`)하면 입력란을 텍스트 필드로 활성화하고 변경된 값으로 특정 ID 객체의 내용을 매핑(\`map\`)하여 수정 저장하며, 삭제 버튼 탭 시 필터링(\`filter\`) 처리를 통해 화면에서 영구 차단합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **메모리 최적화**: 중첩된 데이터 구조에서 깊은 복사(Deep Copy) 없이 1레벨 수정만 대충 가동하면, 자식 컴포넌트들이 정상 리렌더링되지 않는 불일치 버그가 빈번합니다. 상태를 조작할 때는 항상 스프레드 연산자(\`...\`)를 활용해 불변성(Immutability)을 엄격하게 수호하며 부드럽게 복사본을 갱신하는 리액트다운 코딩 습관이 필수적입니다.`
          },
          { 
            id: 'p30_cart', 
            title: '쇼핑 장바구니 관리기', 
            description: '상품 목록에서 장바구니에 아이템을 동적으로 담고(Create), 장바구니 화면에서 각 아이템의 수량을 실시간으로 증감하거나 삭제하여(Update/Delete) 총 결제 금액을 실시간 계산하는 커머스 필수 CRUD를 구현합니다.', 
            level: '기초', 
            category: 'CRUD', 
            tags: 'CRUD,계산 로직,상태관리', 
            curriculum_link: '3회차 - 상태 관리', 
            views: '2.8K', 
            completion_rate: 3, 
            icon_name: 'ShoppingCart', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 상품 명세 데이터(상품 ID, 이름, 가격, 이미지 가상 URL)로 구성된 초기 Mock 상품 리스트 배열을 선언합니다.\n- 장바구니 아이템 리스트(\`cartItems\`) 및 총 합계 금액(\`totalPrice\`)을 기억할 전역/지역 리액티브 상태를 확보합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[장바구니 아이템 추가]**: 특정 상품의 ''담기'' 버튼을 클릭하면 장바구니 배열 상태를 갱신합니다. 이때 이미 장바구니에 해당 상품이 존재한다면 신규로 행을 추가하지 않고 기존 아이템의 수량(\`quantity\`) 필드 값만 1 가산하는 예외 조건을 설계합니다.\n2. **[수량 변경 및 실시간 유효성 체크]**: 장바구니 리스트 카드에서 \`+\` 및 \`-\` 버튼을 바인딩하여 특정 아이템 수량을 조절합니다. 수량이 1 미만으로 내려가려 할 경우, 경고 모달을 띄우거나 자동으로 삭제 프로세스로 연동하도록 방어적 기획 분기를 처리합니다.\n3. **[아이템 개별 삭제 및 총 결제 금액 실시간 연산]**: 장바구니에서 휴지통 단추를 누르면 해당 아이템을 목록에서 제외(\`filter\`)하고, 장바구니 목록 상태가 바뀔 때마다 리액트 \`useMemo\` 훅을 활용하여 \`totalPrice = cartItems.reduce(...)\` 연산을 가동해 실시간 청구 금액을 미려하게 갱신합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **UX 친화성**: 유저가 최종 구매 의사 결정을 망설이지 않도록 수량 조절 버튼 동작에 적절한 트랜지션 애니메이션과 클릭 디바운싱 처리를 연계하여, 연속 타격 시 발생하는 불필요한 리렌더링 버스트를 차단하는 튜닝을 곁들이면 훨씬 모던한 쇼핑 경험을 선사할 수 있습니다.`
          },
          { 
            id: 'p10', 
            title: 'AI 챗봇 인터페이스', 
            description: 'OpenAI 또는 Vercel AI SDK를 활용하여 실시간 답변 스트리밍(streamText)과 마크다운 렌더링을 지원하는 대화형 AI 챗봇 UI를 구축합니다.', 
            level: '실전', 
            category: 'API 연동', 
            tags: 'AI,채팅', 
            curriculum_link: '8회차 - AI 연동', 
            views: '15K', 
            completion_rate: 5, 
            icon_name: 'MessageSquare', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- Next.js 또는 Vanilla JS 프로젝트 폴더 상에 \`@ai-sdk/openai\` 및 \`ai\` (Vercel AI SDK 코어) 패키지를 설치합니다.\n- OpenAI 개발자 콘솔에서 API Key를 획득하여 로컬 환경 변수 파일(\`.env.local\`)에 \`OPENAI_API_KEY\` 변수를 안전하게 선언해 둡니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[스트리밍 API 라우트 구축]**: Next.js App Router API 엔드포인트(\`src/app/api/chat/route.ts\`) 상에 \`streamText\` 함수를 정의하고, AI 패키지의 \`openai('gpt-4o-mini')\` 모델을 연동하여 클라이언트에 텍스트 데이터 청크를 실시간 스트림 스트림 반환합니다.\n2. **[useChat 훅 기반 메시지 관리]**: 프론트엔드 단에 Vercel AI SDK의 \`useChat\` 훅을 연결하여 유저의 인풋 폼 핸들러, 대화 히스토리 어레이(\`messages\`) 관리 및 전송/응답 수신 라이프사이클을 자동 오케스트레이션합니다.\n3. **[자동 스크롤 및 Markdown 말풍선 렌더링]**: 수신되는 마크다운 포맷 답변을 실시간으로 가공 및 렌더링하고, 새로운 채팅 청크가 도착할 때마다 컨테이너 Ref를 활용하여 대화창 스크롤을 최하단으로 부드럽게 고정(\`scrollTo({ top: scrollHeight, behavior: 'smooth' })\`)합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **스트리밍 UI 예외 바인딩**: 모바일 인앱 브라우저나 저사양 환경에서는 실시간 DOM 재생성이 렌더링 지연을 유발할 수 있으므로, \`useEffect\` 디바운싱을 통해 스크롤 유휴 간격을 확보하거나 가볍게 마크다운 파싱 범위를 조율하는 최적화 기법을 적용하는 편이 성능 상 매우 안전합니다.`
          },
          { 
            id: 'p11', 
            title: '드래그 앤 드롭 리스트', 
            description: '@dnd-kit 라이브러리를 사용해 복수의 작업 상태 열(할일, 진행중, 완료) 간에 마우스 및 터치 드래그로 카드를 부드럽게 이동하는 칸반 보드 UI를 빌드합니다.', 
            level: '실전', 
            category: 'UI/UX', 
            tags: 'Dnd,UI', 
            curriculum_link: '3회차 - 인터랙션', 
            views: '4.2K', 
            completion_rate: 3, 
            icon_name: 'Edit3', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- React/Next.js 프로젝트 디렉토리에 \`@dnd-kit/core\`, \`@dnd-kit/sortable\`, 및 \`@dnd-kit/utilities\` 핵심 패키지를 패키지 매니저로 셋업합니다.\n- 칸반 보드 컴포넌트 상단에 리액트 훅 구동을 명시하는 \`'use client';\` 지시어를 최상단에 선언합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[DndContext 및 Droppable 열 설계]**: 메인 래퍼 영역을 \`DndContext\`로 감싸고, 할 일(Todo), 진행 중(Progress), 완료(Done) 3개의 칼럼에 각각 고유 ID를 부여한 \`useDroppable\` 타겟 컨테이너 영역을 설정합니다.\n2. **[useDraggable 기반 드래그 센서 연동]**: 개별 카드 컴포넌트에 \`useDraggable\` 훅을 바인딩하여 드래그 핸들 속성(\`listeners\`, \`attributes\`)과 카드 이동에 적용할 transform 스타일 속성을 네이티브 좌표계에 싱크하여 부여합니다.\n3. **[드래그 엔드 좌표 감지 및 상태 스왑]**: 유저가 카드를 드롭하면 \`onDragEnd\` 이벤트를 인터셉트하여, 드래그 대상 카드가 속한 이전 컬럼 어레이에서 신규 목표 컬럼 어레이로 소속 데이터 인덱스를 스왑하는 전역 리액트 상태 업데이트 함수를 가동합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **모바일 드래그 접근성 제어**: 모바일 터치 스크린 상에서는 유저가 화면 스크롤을 내리려는 제스처와 드래그 카드를 끌어내리려는 의도가 겹쳐 레이아웃 충돌이 일어납니다. 이를 예방하기 위해 dnd-kit 센서 설정에 \`TouchSensor\`를 명시적으로 등록하고, 최소 지연 조건(\`delay: 250, tolerance: 5\`)을 부여하여 묵직하게 터치해야만 드래그가 기동되도록 조율해야 합니다.`
          },
          { 
            id: '18', 
            title: '가상 스크롤 리스트', 
            description: '수만 개의 대용량 데이터를 성능 저하 없이 부드럽게 렌더링하기 위해, 화면 영역(Viewport) 내의 DOM 노드만 동적으로 갈아끼우는 가상 스크롤 최적화 리스트를 만듭니다.', 
            level: '실전', 
            category: 'UI/UX', 
            tags: '성능최적화,데이터', 
            curriculum_link: '트랙 A: 수익형 빌딩', 
            views: '2.1K', 
            completion_rate: 5, 
            icon_name: 'Layers', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 프론트엔드 작업 폴더에 경량화 가상화 스크롤 라이브러리인 \`react-window\` 및 \`@types/react-window\` 데브 패키지를 장착합니다.\n- 데이터 렌더링 부하 테스트를 위해 수만 개의 랜덤 가상 텍스트 객체 어레이 데이터를 임시 로컬 변수로 선언해 둡니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[FixedSizeList 가상 돔 규격 설정]**: 메인 뷰포트 영역에 \`react-window\` 라이브러리의 \`FixedSizeList\` 컴포넌트를 마운트하고, 가시창의 전체 높이(\`height\`), 가로 크기(\`width\`), 그리고 개별 행의 고정 높이(\`itemSize\`) 명세를 선언합니다.\n2. **[렌더러 함수 분기 및 스타일 바인딩]**: 스크롤 오프셋에 따라 절대 좌표(\`absolute\`)로 동적 포지셔닝되는 개별 아이템 렌더링 함수(\`Row\`)를 셋업하고, 내부 스타일 객체 파라미터를 하위 돔 요소에 한 치의 틈도 없이 완전히 바인딩합니다.\n3. **[스크롤 동기 및 렌더링 오버헤드 차단]**: 유저가 마우스 휠을 빠르게 당길 때 브라우저 돔 생성 오버헤드가 없도록, 현재 뷰포트 밖에 소거되는 인덱스 돔 요소를 물리적으로 삭제하고 즉각적으로 재사용 가능한 빈 프레그먼트로 스왑하는 원리를 수동 코딩으로 디버깅 분석합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **동적 높이 아이템 대응 방침**: 개별 행 아이템의 글자 수나 이미지 크기에 따라 높이가 유동적으로 변하는 동적 리스트(Dynamic size list)의 경우, 고정 크기 fixed 모델을 사용하면 영역이 뭉개집니다. 이때는 자매품 컴포넌트인 \`VariableSizeList\`를 활용하고, 캐시 헬퍼 라이브러리를 별도 부착하여 스크롤 높이를 사전에 추정 저장하는 동적 캐싱 방어 로직을 가동해야 합니다.`
          },
          { 
            id: '21', 
            title: '엑셀 데이터 파싱', 
            description: '업로드한 엑셀(.xlsx) 파일을 브라우저 메모리 단에서 바이너리로 읽어 JSON 객체로 파싱하고, 스프레드시트 표 형식으로 동적 바인딩하는 어드민 도구를 빌드합니다.', 
            level: '실전', 
            category: '파일 관리', 
            tags: '데이터,엑셀,파싱', 
            curriculum_link: '5회차 - 데이터 필터링', 
            views: '4.7K', 
            completion_rate: 4, 
            icon_name: 'Code', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 프로젝트 파일에 스프레드시트 파싱 표준 규격인 \`xlsx\` (SheetJS) 라이브러리를 세팅합니다.\n- 유저가 로컬 문서를 끌어올 수 있는 드래그 앤 드롭 파일 인풋 존을 마크업으로 레이아웃 구성합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[FileReader 바이너리 스트림 로드]**: 인풋 이벤트 또는 Drop 핸들러를 가동해 수신된 파일 객체를 \`new FileReader()\` API에 전달하고, 엑셀 파일 고유 바이트 규격의 원본 훼손이 없도록 \`readAsArrayBuffer\` 메서드로 동적 로드합니다.\n2. **[SheetJS 통합 문서 변환 처리]**: 로드된 바이너리 버퍼 어레이를 SheetJS 패키지의 \`XLSX.read\` 인스턴스로 감싸 가공하고, 첫 번째 활성 시트의 이름을 취득하여 타겟 행/열 영역을 식별합니다.\n3. **[JSON 직렬화 및 테이블 바인딩]**: 취득된 타겟 워크시트를 \`XLSX.utils.sheet_to_json\` API를 사용해 완전한 로컬 JSON 배열 구조로 다이렉트 컨버전하고, 리액트 상태에 주입하여 브라우저 테이블 뷰어에 스프레드시트 표 형식으로 동적 바인딩합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **데이터 타입 오파싱 방지**: 엑셀의 숫자형 셀 데이터나 날짜 데이터 포맷은 바이너리 파싱 시 숫자가 날짜 타임스탬프로 밀리거나 유실되는 치명적인 데이터 탈루가 잦습니다. 파싱 옵션 호출 시 반드시 \`{ raw: false, dateNF: 'yyyy-mm-dd' }\` 와 같이 날짜 변환 정형화 포맷을 파라미터로 명시해야만 사후 비즈니스 가공에서 데이터가 유실되는 비극을 예방할 수 있습니다.`
          },
          { 
            id: '20', 
            title: '실시간 알림 시스템', 
            description: 'WebSocket 연결 세션을 안전하게 열고 서버에서 실시간 브로드캐스트하는 인앱 푸시 메시지를 수신하여 상단 토스트 알림창 및 안 읽은 알림 카운트 배지를 동적으로 업데이트합니다.', 
            level: '실전', 
            category: 'API 연동', 
            tags: 'WebSocket,상태관리', 
            curriculum_link: '13회차 - 실시간 통신', 
            views: '5.5K', 
            completion_rate: 4, 
            icon_name: 'Zap', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 실시간 통신 상태를 실무 규격으로 셋업하기 위해, 로컬에 임시 웹소켓 에코 서버를 마련하거나 public WebSocket 데모 엔드포인트를 확보합니다.\n- 클라이언트 컴포넌트 내부에서 소켓 세션을 메모리 누수 없이 보관할 소켓 전용 Ref 객체를 마련합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[안전한 WebSocket 세션 마운트]**: 컴포넌트 마운트 순간 \`new WebSocket(WS_URL)\` 객체를 생성하고, 브라우저가 예기치 않게 새로고침되거나 컴포넌트가 언마운트되는 순간 메모리 누수가 발생하지 않도록 \`socket.close()\` 수거 핸들러를 cleanup 함수로 명시합니다.\n2. **[실시간 메세지 수신 및 파싱 파이프라인]**: 소켓의 \`onmessage\` 이벤트 리스너를 결속하여 데이터 프레임을 확보하고, 데이터 패킷을 JSON 객체로 파싱하여 미확인 상태의 신규 알림 어레이 최상단에 언시프트(\`[parsedMsg, ...prev]\`) 주입합니다.\n3. **[알림 카운팅 배지 및 토스트 연동]**: 수신과 동시에 인앱 알림 종 배지에 수치 카운팅 효과를 dynamic 가동하고, UI 우측 하단에서 즉시 솟아오르는 실시간 토스트 알림 팝오버를 트리거하여 유저의 접근 편의성을 유도합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **소켓 단절 시 자동 재접속(Auto Reconnect)**: 와이파이 전환이나 네트워크 순간 불안정으로 소켓 세션이 끊겼을 때 무대책으로 세션이 다운 방치되는 구조는 실무에서 극도로 위험합니다. \`onclose\` 핸들러가 격발 시 타이머 디바운싱을 돌려 지수 백오프 방식(\`retryInterval * 2\`)으로 끊임없이 재접속을 자동 시도하는 회복탄력성 방어 코드를 내장해 두어야 안정적인 서비스를 유지합니다.`
          },
          { 
            id: '19', 
            title: '권한별 접근 제어', 
            description: 'Next.js Edge Middleware 단에서 사용자 JWT 토큰의 권한 등급(Admin, Manager, User)을 판별하여 비인증 또는 불충분 권한 트래픽의 접근을 차단하고 403 리다이렉트 처리하는 보안 게이트를 구축합니다.', 
            level: '실전', 
            category: '인증/보안', 
            tags: '보안,미들웨어', 
            curriculum_link: '11회차 - 고급 인증', 
            views: '6.2K', 
            completion_rate: 5, 
            icon_name: 'Lock', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- Next.js App Router 디렉토리 최상단 루트 경로에 \`middleware.ts\` 파일을 생성합니다.\n- 사용자 인증 처리에 활용할 토큰 서명 키 스트링을 \`.env.local\` 파일 상에 안전한 비밀 상수로 할당해 둡니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[미들웨어 라우트 매칭 스코프 필터]**: \`middleware.ts\` 하단에 config 매칭 메타데이터 객체를 생성하여, 권한 보호가 엄격히 수행되어야 하는 \`/admin/*\` 또는 \`/dashboard/*\` 경로의 정규식 패턴을 스코프로 지정합니다.\n2. **[JWT 토큰 Edge 파싱 및 페이로드 복호화]**: Edge Runtime 환경에서도 호환되는 경량 암호화 라이브러리 \`jose\`를 활용하여 요청 쿠키 속의 토큰을 복호화하고, 페이로드에 은닉 수록된 \`user_role\` 속성을 해독 취득합니다.\n3. **[RBAC 권한 분기 및 하드 리다이렉션]**: 관리자 권한이 요구되는 \`/admin\` 경로를 유저가 접근하려는데 복호화된 롤 정보가 단순 일반 회원(\`User\`)일 경우, 요청 흐름을 차단하고 \`NextResponse.redirect(new URL('/403', request.url))\` 구문을 쏘아 403 리다이렉션 페이지로 트래픽을 가차없이 튕겨냅니다.\n\n### 💡 구현 팁 및 주의 사항\n> **Edge API의 라이브러리 제약**: Next.js Middleware는 브라우저보다 가볍고 빠른 Edge 환경에서 실행되므로, 기존 Node.js 환경 전용 암호 패키지(예: \`jsonwebtoken\`, \`bcrypt\` 등)를 미들웨어 소스 상에 다이렉트 임포트하면 빌드 단계에서 워커 크래시가 발생하며 빌드가 가로막힙니다. 반드시 경량화가 입증된 Web Crypto API 기반 패키지사용해야 안전합니다.`
          },
          { 
            id: '10', 
            title: '스켈레톤 로딩 구현', 
            description: 'API 비동기 로딩 대기 시간 동안 부자연스러운 로딩 스피너 대신, 콘텐츠 레이아웃 윤곽선에 흐르는 듯한 그라데이션 애니메이션(animate-pulse) 효과를 입힌 고급 스켈레톤 카드를 구현합니다.', 
            level: '기초', 
            category: 'UI/UX', 
            tags: 'UI/UX,애니메이션', 
            curriculum_link: '4회차 - 로딩 최적화', 
            views: '3.1K', 
            completion_rate: 1, 
            icon_name: 'Zap', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- UI 스타일링을 효율적으로 마스터하기 위해, 프로젝트에 Tailwind CSS 라이브러리가 로드되어 있는지 사전 점검합니다.\n- 데이터를 인위적으로 3초 지연시킨 뒤 마운트 렌더링하는 비비동기 목업 API 핸들러 함수를 리액트 단에 구축합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[스켈레톤 카드 프레임 레이아웃 ಮ್ಯಾಪ್ಪ]**: 목업 대기 상태(\`isLoading\`) 분기에 맞춰 실제 렌더링될 메인 카드와 정확히 1:1 크기 대칭 높이를 점유하는 빈 플레이스홀더 디브(\`div\`) 프레임을 Flex/Grid 레이아웃을 통해 구현합니다.\n2. **[Tailwind 펄스 및 그라데이션 장착]**: 스켈레톤의 세부 골격 디브 블록들에 Tailwind의 실시간 깜빡임 효과 속성인 \`animate-pulse\` 클래스와 미려한 그레이 계열 백그라운드 색상(\`bg-slate-200\`)을 순서대로 할당합니다.\n3. **[스무스한 콘텐츠 리렌더링 교체]**: 비동기 데이터 통신 로드가 완료되면, 깜빡이던 스켈레톤 카드를 투명도 소멸 페이드인(\`transition-opacity duration-500\`) 애니메이션 트랜지션을 주입하여 리얼 알짜 데이터 콘텐츠 카드로 스무스하게 렌더링 스왑합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **접근성 명세(A11y) 추가 셋업**: 스켈레톤 블록은 본질적으로 보이지 않는 임시 프레임이므로 스크린 리더기를 켜고 사이트를 훑는 시각 장애인 수강생에게는 아무 의미 없는 벽돌 덩어리에 불과해 혼란을 줍니다. 스켈레톤 최상단 래퍼 영역에 반드시 \`aria-busy="true"\` 및 \`aria-live="polite"\` 명세 태그를 동적으로 바인딩하여 브라우저에 데이터 대기 중 상태임을 신사적으로 공지해야 완성도 높은 모던 UI라고 할 수 있습니다.`
          },
          { 
            id: '17', 
            title: 'PDF 문서 뷰어', 
            description: 'pdfjs-dist 라이브러리를 활용하여 외부 PDF 문서를 다운로드 없이 브라우저 내에서 고해상도 그래픽 캔버스로 다이렉트 렌더링하고, 인쇄 및 다중 페이지 전환 컨트롤을 구현합니다.', 
            level: '실전', 
            category: '파일 관리', 
            tags: '파일,PDF,라이브러리', 
            curriculum_link: '6회차 - 파일 처리', 
            views: '3.5K', 
            completion_rate: 4, 
            icon_name: 'Edit3', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- Next.js 또는 리액트 디렉토리에 고해상도 PDF 파싱 표준 라이브러리인 \`pdfjs-dist\` 모듈을 연동합니다.\n- 브라우저 빌드 환경에서 PDF 워커 스크립트가 온전히 호스트 마운트될 수 있도록 전용 CDN 주소나 로컬 워커 주소 바인딩을 메타 셋업합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[PDF 문서 로드 및 타겟 페이지 해독]**: 뷰어 컴포넌트 상에서 \`pdfjsLib.getDocument(PDF_URL)\` 비동기 프로미스 메서드를 격발하여 문서 파일의 바이너리를 로드하고, 유저가 선택한 현재 페이지 개체 객체를 획득합니다.\n2. **[Canvas 그래픽 컨텍스트 렌더링]**: 획득한 PDF 페이지의 가로세로 비율(Viewport)을 취득한 뒤, 문서 뷰어 화면 크기에 연동되는 스케일(Scale) 값을 연산합니다. 이후 돔 상의 \`<canvas>\` 엘리먼트를 노드로 취득해 \`renderContext\`를 기동하고 그래픽 드로잉을 시작합니다.\n3. **[네이티브 인쇄 및 제어판 구현]**: 이전/다음 페이지 전환 기능과 줌인/줌아웃 버퍼 배율 제어판을 구성하고, 인쇄 버튼 클릭 시 임시 iframe을 띄워 브라우저 인앱 인쇄 대화상자(\`window.print()\`)를 다이렉트로 격발하는 출력 핸들러를 완성합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **고해상도 디스플레이 그래픽 깨짐 방지**: 맥북의 레티나 디스플레이나 최신 고화소 기기에서는 픽셀 밀도(Retina ratio) 분기 대응을 무시하고 1배수로 캔버스를 렌더링하면 문자가 부옇고 흐릿하게 뭉개지는 현상이 벌어집니다. \`window.devicePixelRatio\` 배율을 측정하여 캔버스의 실제 해상도(width, height)는 2배 이상 키우고, CSS 스타일 너비는 고정하는 픽셀 스케일링 기법을 적용해야 칼같이 날카로운 텍스트 가독성을 보장할 수 있습니다.`
          },
          { 
            id: 'p6', 
            title: '이미지 업로드 & 미리보기', 
            description: 'HTML5 FileReader API 및 Object URL 생성을 가동하여, 로컬 이미지 파일을 웹 서버 전송 이전에 즉시 인메모리 주소로 읽어와 고해상도 미리보기 이미지 썸네일을 렌더링합니다.', 
            level: '기초', 
            category: '파일 관리', 
            tags: 'File API,업로드', 
            curriculum_link: '6회차 - 파일 처리', 
            views: '4.5K', 
            completion_rate: 3, 
            icon_name: 'Upload', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 이미지를 등록하고 관리할 수 있도록 표준 \`<input type="file" accept="image/*" />\` 노드 요소를 마크업으로 작성합니다.\n- 모던하고 깔끔한 그래픽 미리보기 공간을 마련하기 위해 Tailwind 테두리 링 및 디브 카드를 디자인합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[이미지 파일 취득 및 파일 타입 검사]**: 인풋 컴포넌트 단에 파일 드롭 또는 셀렉트 이벤트를 바인딩하고, 수신된 \`File\` 객체가 올바른 이미지 확장자(JPEG, PNG, WEBP 등)를 유지하고 있는지 정적 유효성 필터를 태웁니다.\n2. **[FileReader API를 통한 인메모리 로딩]**: Browser 빌트인 \`new FileReader()\` 인스턴스를 격발하고 \`reader.readAsDataURL(file)\` 메서드를 가동하여, 로컬 저장소 상의 파일 물리 주소를 완전한 BASE64 인코딩 바이너리 데이터 텍스트 주소로 치환하여 상태 변수에 세이브합니다.\n3. **[미리보기 썸네일 이미지 및 취소 브릿지 렌더링]**: 획득된 BASE64 가상 주소를 이미지 컴포넌트의 \`src\` 파라미터에 전달해 화면에 즉시 렌더링하고, 유저가 마음을 바꾸어 다른 사진을 올리거나 선택 취소 시 메모리 누수와 이전 주소 상태를 소거하는 리셋 취소 함수를 구현합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **Object URL을 활용한 대용량 메모리 절약**: 수 메가바이트가 넘어가는 고화질 DSLR 촬영 사진들을 수십 장 동시에 올리는 과정에서 무거운 BASE64 텍스트 스트링 주소를 다이렉트로 다수 로드하면, 브라우저가 과도한 메모리 누수로 급격히 느려지거나 다운됩니다. 이 경우에는 텍스트 변환 대신 브라우저 세션 가상 주소를 경량 매핑해 주는 \`URL.createObjectURL(file)\` 메서드를 채택하고, 컴포넌트 언마운트 시 메모리 점유를 반환하는 \`URL.revokeObjectURL(url)\` 함수를 기동하는 것이 완벽한 메모리 누수 방지 기법입니다.`
          },
          { 
            id: 'p5', 
            title: '실시간 날씨 대시보드', 
            description: '브라우저 Geolocation API로 획득한 현재 위치의 GPS 위도/경도를 날씨 API에 전달하고, 기상 상태 코드에 맞춰 화면 테마 스타일링을 동적으로 스왑하는 대시보드를 제작합니다.', 
            level: '기초', 
            category: 'API 연동', 
            tags: 'API,Fetch', 
            curriculum_link: '4회차 - 비동기 처리', 
            views: '5.1K', 
            completion_rate: 2, 
            icon_name: 'Sun', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 날씨 기상 현황 데이터 획득을 위해 OpenWeather API 콘솔에 가입하고 고유한 개발자 서비스 인증 토큰 키를 수령해 둡니다.\n- 위치 정보 제공 거부 상태와 로딩 상태를 표시하기 위해 UI 상에 깔끔한 대기 인스펙터 화면을 마련합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[Geolocation 브라우저 네이티브 GPS 취득]**: 유저 마운트와 동시에 브라우저 네이티브 \`navigator.geolocation.getCurrentPosition\` 메서드를 쏘아 유저의 실시간 지리적 위도(\`latitude\`)와 경도(\`longitude\`) 좌표 매개변수를 성공 취득합니다.\n2. **[OpenWeather REST API 무선 호출]**: 취득한 GPS 좌표 데이터 쌍과 API 토큰 상수를 결속하여 API 엔드포인트 URL에 Fetch GET 무선 요청을 쏘아 기상 온도, 풍속, 습도 및 고유 기상 상태 코드를 추출하여 상태에 바인딩합니다.\n3. **[기상 기상 매칭 상태 비주얼 테마 제어]**: 기상 코드가 'Rain'(비)일 경우 흐릿한 블루 톤의 백그라운드 색상 스타일링과 빗방울 떨어지는 CSS 애니메이션 레이어를 연출하고, 'Clear'(맑음) 상태 도달 시에는 오렌지빛 그라데이션 태양 일러스트 테마 카드를 동적으로 스위칭 렌더링합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **사용자 위치 정보 접근 권한 거부 예방 대책**: 상당수 유저는 브라우저의 GPS 제공 다이얼로그 요청 시 개인정보 유출을 방지하기 위해 권한 허용을 거절합니다. 권한이 거절되었을 때 대시보드가 크래시나 에러창으로 뻗어버리는 참사를 모면하려면, \`errorCallback\` 핸들러 단을 안전하게 구현하여 국내 대표 중심지 좌표(예: 서울시청 위경도)를 디폴트 대체 주소로 무결성 백업 인계하는 방어적 폴백 전략을 철저히 취해두어야 안전합니다.`
          },
          { 
            id: 'p26_kakao', 
            title: '카카오톡 SDK 활용 링크 공유기', 
            description: '비동기로 카카오 Javascript SDK를 안전하게 초기화하고, 썸네일/텍스트/버튼이 있는 피드 템플릿 정보를 작성하여 모바일 기기에서 카카오톡 인앱 브라우저 랜딩 및 설치 여부에 따른 딥링크 분기 처리를 구현해야 합니다.', 
            level: '입문', 
            category: 'API 연동', 
            tags: '카카오톡,공유,SDK,API', 
            curriculum_link: '입문 단계', 
            views: '3.5K', 
            completion_rate: 2, 
            icon_name: 'MessageSquare', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- [카카오 디벨로퍼스](https://developers.kakao.com)에 로그인 후 신규 어플리케이션을 생성하고, 로컬 웹 호스트 주소(예: localhost:3000)를 플랫폼 도메인에 추가합니다.\n- 카카오로부터 발급받은 JavaScript 키를 발췌하여 환경변수 파일에 바인딩합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[SDK 비동기 로딩 및 검증]**: Next.js의 \`Script\` 컴포넌트를 활용해 카카오 SDK 라이브러리를 안전하게 호출하고, 마운트 직후 \`window.Kakao.isInitialized()\` 여부를 판단해 초기화 단계를 거칩니다.\n2. **[공유 피드 템플릿 빌드]**: 카카오톡 공유 API인 \`window.Kakao.Share.sendDefault\` 메서드를 주입하고, 이미지 URL(가로세로 2:1 권장), 제목, 본문 설명 및 랜딩 URL 파라미터를 JSON 구조로 정의합니다.\n3. **[딥링크 연동 모바일 테스트]**: 모바일 환경에서 공유된 링크 터치 시 카카오톡 앱이 열리면서 내부 인앱 웹뷰로 안전하게 진입하는지 다이렉트 랜딩 성능을 검증합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **주의 사항**: 카카오 SDK 함수들은 전역 객체 \`window\`가 완전하게 생성된 후 사용되어야 하므로 클라이언트 컴포넌트(\`'use client'\`) 레벨에서 라이프사이클 훅에 맞추어 선언해야 스크립트 오작동을 피할 수 있습니다.`
          },
          { 
            id: 'p27_zustand_i18n', 
            title: 'Zustand 기반 다국어(i18n) 시스템', 
            description: 'Zustand 스토어 내부에 다국어 사전 번들 데이터를 바인딩하여 새로고침 없는 실시간 3개 언어(한국어, 영어, 일본어) 다국어 스위칭 환경을 구성하고 로컬 스토리지에 세션을 유지해야 합니다.', 
            level: '기초', 
            category: '상태 관리', 
            tags: 'Zustand,i18n,다국어,상태관리', 
            curriculum_link: '기초 단계', 
            views: '5.4K', 
            completion_rate: 3, 
            icon_name: 'Menu', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- Zustand 패키지를 설치합니다.\n- 다국어 사전 파일 번들인 \`ko.json\`, \`en.json\`, \`ja.json\`을 로컬 디렉토리에 생성하여 기본 텍스트 딕셔너리를 구비합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[Zustand 번역 스토어 설계]**: 현재 브라우저 로케일 상태를 기억하고, 사전 키값을 인자로 받아 번역 문장을 즉시 응답하는 \`t(key)\` 전역 리액티브 함수를 갖춘 Zustand 스토어를 만듭니다.\n2. **[실시간 번역 바인딩 및 트리거]**: 리액트 UI 단에서 \`t("home.title")\` 처럼 사용하여 텍스트 컴포넌트를 감싸고, 언어 전환 셀렉터를 탭하면 리렌더링 없이 페이지 전체 텍스트가 즉시 다국어로 전환되는 화면을 완성합니다.\n3. **[시스템 언어 우선 순위 설정]**: 로컬스토리지에 기존 선택한 번역 세션이 없다면 \`navigator.language\`를 읽어 사용자의 기본 OS 언어에 맞추어 화면을 초기화합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **동적 텍스트 팁**: 단순 번역 매핑을 넘어 \`t("welcome.message", { name: "홍길동" })\` 처럼 동적 변수를 파라미터로 받아 문자열 내부 치환 처리를 지원하는 고급 포맷터 함수를 Zustand 스토어 내부에 보강해 보세요.`
          },
          { 
            id: 'p28_playwright_e2e', 
            title: 'Playwright 브라우저 E2E 테스트 자동화', 
            description: 'Playwright 테스트 러너를 구축하여 복잡한 시나리오(인풋 입력, 클릭, 비동기 상태 확인, 페이지 이동 등)를 헤드리스 모드로 시뮬레이션하고 검증해야 합니다.', 
            level: '실전', 
            category: '기타', 
            tags: 'Playwright,테스트,자동화,CI', 
            curriculum_link: '실전 단계', 
            views: '6.1K', 
            completion_rate: 2, 
            icon_name: 'CheckCircle2', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- \`@playwright/test\` 설치 커맨드를 실행하여 러너 엔진을 세팅하고, 로컬 디렉토리에 기본 \`playwright.config.ts\` 구성 파일을 생성합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[E2E 시나리오 테스트 케이스 작성]**: \`test('테스트 명칭', async ({ page }) => { ... })\` 블록을 구성하고 지정된 실무 URL에 브라우저가 자동 이동하게 설계합니다.\n2. **[인풋 제어 및 상태 어설션]**: 사용자 로그인 Input 및 Button 선택자를 타겟하고 타이핑과 클릭 이벤트를 강제한 뒤, \`expect(page).toHaveURL()\`을 사용해 성공 페이지 이동 여부를 검증합니다.\n3. **[테스트 리포트 분석 및 CI 연동]**: 테스트 완료 후 생성되는 HTML 리포터를 로컬 브라우저로 띄워 각 단계별 타임라인 스냅샷 및 비동기 통신 이력을 상세 확인합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **테스트 격리**: 매 테스트 시나리오마다 매번 번거로운 로그인을 수행하는 비효율을 방지하기 위해, 최초 로그인 세션 데이터(Cookie 및 Session Storage)를 별도로 구워둔 뒤 개별 테스트에 안전하게 복사/주입하는 스토리지 상태 재사용 패턴을 적용해 보세요.`
          },
          { 
            id: 'adv-a4_webrtc', 
            title: 'WebRTC 1:1 실시간 화상 미팅 룸', 
            description: '미디어 스트림 오디비주얼 캡처 및 화면 제어 장치를 구현하고, P2P 통신 성립을 위한 RTCPeerConnection을 구성하여 Offer/Answer/ICE Candidate 교환을 거쳐 실시간 1:1 비디오 스트리밍을 완성해야 합니다.', 
            level: '심화', 
            category: 'API 연동', 
            tags: 'WebRTC,P2P,미디어,실시간', 
            curriculum_link: '트랙 A: 수익형 빌딩', 
            views: '11.2K', 
            completion_rate: 4, 
            icon_name: 'MessageSquare', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- 피어 간 신호 패킷 전달을 담당할 Signaling 서버(WebSocket 또는 Supabase Realtime 채널) 클라이언트를 준비합니다.\n- 비디오와 오디오를 렌더링할 로컬 플레이어 및 상대방 플레이어 \`<video>\` 태그 2개를 배치합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[카메라/마이크 미디어 스트림 제어]**: \`navigator.mediaDevices.getUserMedia()\` API를 호출하여 입력 장치 장치로부터 미디어 스트림을 가져와 내 화면에 바인딩하고 비활성화 스위치를 연결합니다.\n2. **[RTCPeerConnection 피어 생성]**: \`RTCPeerConnection\` 객체를 생성하고, 로컬 미디어 트랙들을 연결에 추가(\`addTrack\`)합니다.\n3. **[시그널링 및 P2P 실시간 송수신]**: Offer SDP 생성 후 시그널링 서버를 통해 전달하고, 상대방이 응답한 Answer SDP를 \`setRemoteDescription\` 처리하며, ICE Candidate를 교환하여 연결을 완성한 뒤 상대방 미디어를 수신(\`ontrack\`)합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **네트워크 환경 호환성**: 대부분의 일반적인 네트워크망(특히 대칭형 NAT 등)에서는 다이렉트 P2P 경로 탐색이 실패할 수 있으므로, 상용 서비스 출시 단계에서는 STUN 서버뿐만 아니라 데이터 릴레이를 중계하는 TURN 서버 인프라가 반드시 동반 세팅되어야 함에 유의하세요.`
          },
          { 
            id: 'adv-c4_redis_rate_limit', 
            title: 'Upstash Redis 기반 API 속도 제한기', 
            description: 'Cloudflare Workers 또는 Next.js Edge Middleware 환경에서 글로벌 분산 DB인 Upstash Redis 서버리스 인스턴스를 활용하여 IP 및 API Token 기준 실시간 Rate Limiting 미들웨어를 구축해야 합니다.', 
            level: '심화', 
            category: '인증/보안', 
            tags: 'Redis,RateLimit,보안,Edge', 
            curriculum_link: '트랙 C: 고급 OS & AI 인프라', 
            views: '9.5K', 
            completion_rate: 3, 
            icon_name: 'Lock', 
            is_hidden: 0,
            content: `### 🛠 실습 준비 및 환경 설정\n- Upstash 콘솔에서 서버리스 Redis DB 인스턴스를 하나 띄우고, \`UPSTASH_REDIS_REST_URL\`과 \`UPSTASH_REDIS_REST_TOKEN\` 자격 증명 환경 변수를 시스템에 설정합니다.\n- API 미들웨어 통신을 위해 에지 런타임 호환을 보장하는 \`@upstash/redis\` 라이브러리를 연동합니다.\n\n### 🔐 핵심 기능 구현 단계\n1. **[클라이언트 식별자 탐색]**: Next.js Edge Middleware 스코프 내에서 요청을 보낸 사용자의 고유 식별자(프록시 환경에서도 신뢰할 수 있는 IP 주소 또는 로그인 Bearer JWT 토큰)를 추출합니다.\n2. **[원자적 카운팅 로직 구현]**: Redis 내부에 고유 키값(예: \`rate_limit:ip_주소\`)으로 1분간 들어온 요청 값을 1씩 가산하고, 만료시간(expire)을 설정하는 원자적 연산을 구현합니다.\n3. **[HTTP 429 및 제한 초과 헤더 응답]**: 요청 카운트가 지정 기준(예: 분당 60회)을 넘어서면, API 호출을 미들웨어단에서 조기 중단(Early Return) 처리하고 **HTTP 429 Too Many Requests** 오류코드와 함께 남은 대기 만료시간을 담아 반환합니다.\n\n### 💡 구현 팁 및 주의 사항\n> **IP 스푸핑 보안**: 프록시 뒤나 Cloudflare CDN 프론트를 통과해 들어오는 트래픽의 실제 소스 IP를 탐색할 때, 일반적인 클라이언트 위변조가 쉬운 \`X-Forwarded-For\` 헤더 값을 그대로 신뢰하는 보안 약점을 보강하기 위해 CDN에서 전용 제공하는 신뢰할 수 있는 헤더(\`CF-Connecting-IP\`) 정보를 우선 검증하는 습관을 들이는 것이 안전합니다.`
          }
        ];
        return Response.json({ success: true, projects: mockProjects });
      }
      return Response.json({ error: "DB 연결 실패" }, { status: 500 });
    }

    const { results } = await env.DB.prepare(
      "SELECT * FROM practice_projects ORDER BY created_at DESC"
    ).all();
    return Response.json({ success: true, projects: results });
  } catch (error) {
    console.error("D1 GET Error:", error);
    return Response.json({ 
      error: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}

// POST: 새 프로젝트 등록
export async function POST(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      console.error("getRequestContext failed:", e);
    }
    const env = context?.env;
    
    let data: Partial<PracticeProject>;
    try {
      data = await request.json();
    } catch (e) {
      return Response.json({ error: "잘못된 JSON 형식입니다." }, { status: 400 });
    }

    if (!env || !env.DB) {
      return Response.json({ success: true, message: "Dev Mode: 등록 완료 (Mock)" });
    }

    const id = Date.now().toString();
    const completionRate = Number(data.completion_rate ?? 0);
    const isHidden = Number(data.is_hidden ?? 0);

    await env.DB.prepare(
      "INSERT INTO practice_projects (id, title, description, level, category, tags, curriculum_link, completion_rate, icon_name, is_hidden, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id, 
      data.title || "제목 없음", 
      data.description || "", 
      data.level || "입문", 
      data.category || "기타", 
      data.tags || "", 
      data.curriculum_link || "입문 단계", 
      completionRate, 
      data.icon_name || "Code", 
      isHidden,
      data.content || ""
    ).run();

    return Response.json({ success: true });
  } catch (error) {
    console.error("D1 POST Error:", error);
    return Response.json({ error: (error as Error).message || "서버 내부 오류" }, { status: 500 });
  }
}

// PUT: 프로젝트 수정
export async function PUT(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      console.error("getRequestContext failed:", e);
    }
    const env = context?.env;
    
    let data: Partial<PracticeProject>;
    try {
      data = await request.json();
    } catch (e) {
      return Response.json({ error: "잘못된 JSON 형식입니다." }, { status: 400 });
    }

    if (!env || !env.DB) {
      return Response.json({ success: true, message: "Dev Mode: 수정 완료 (Mock)" });
    }

    if (!data.id) {
      return Response.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    const completionRate = Number(data.completion_rate ?? 0);
    const isHidden = Number(data.is_hidden ?? 0);

    await env.DB.prepare(
      "UPDATE practice_projects SET title=?, description=?, level=?, category=?, tags=?, curriculum_link=?, completion_rate=?, icon_name=?, is_hidden=?, content=? WHERE id=?"
    ).bind(
      data.title || "제목 없음", 
      data.description || "", 
      data.level || "입문", 
      data.category || "기타", 
      data.tags || "", 
      data.curriculum_link || "입문 단계", 
      completionRate, 
      data.icon_name || "Code", 
      isHidden, 
      data.content || "",
      data.id
    ).run();

    return Response.json({ success: true });
  } catch (error) {
    console.error("D1 PUT Error:", error);
    return Response.json({ 
      error: (error as Error).message || "서버 내부 오류",
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}

// DELETE: 프로젝트 삭제
export async function DELETE(request: NextRequest) {
  try {
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      console.error("getRequestContext failed:", e);
    }
    const env = context?.env;
    
    const { id } = await request.json() as { id: string };

    if (!env || !env.DB) return Response.json({ success: true, message: "Dev Mode: 삭제 완료 (Mock)" });

    await env.DB.prepare("DELETE FROM practice_projects WHERE id = ?").bind(id).run();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

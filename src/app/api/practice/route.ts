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
            description: '이메일/비밀번호 로그인 기능을 구현해보세요.', 
            level: '입문', 
            category: '인증/보안', 
            tags: '인증,폼 처리', 
            curriculum_link: '2회차 - 인증 기초', 
            views: '12.4K', 
            completion_rate: 3, 
            icon_name: 'ShieldCheck', 
            is_hidden: 0,
            content: `### 🔐 실습 과정 안내\n\n이 실습에서는 사용자 인증의 가장 기본인 **이메일 로그인**을 구현합니다.\n\n#### 1. 환경 설정\n- Firebase 또는 Auth.js(NextAuth) 라이브러리를 설치합니다.\n- 인증 공급자(Provider) 설정을 완료합니다.\n\n#### 2. 주요 구현 내용\n- **인풋 유효성 검사**: 이메일 형식 및 비밀번호 길이를 체크합니다.\n- **에러 핸들링**: 로그인 실패 시 사용자에게 적절한 메시지를 노출합니다.\n- **세션 유지**: 로그인 성공 시 쿠키 또는 로컬스토리지를 통해 상태를 유지합니다.\n\n> 💡 **Tip**: 보안을 위해 비밀번호는 항상 암호화되어 전송되어야 합니다.`
          },
          { 
            id: '2', 
            title: '할 일 리스트 (Dev)', 
            description: '할 일 추가, 수정, 삭제가 가능한 Todo 앱을 만들어보세요.', 
            level: '기초', 
            category: 'CRUD', 
            tags: 'CRUD,로컬스토리지', 
            curriculum_link: '3회차 - 상태 관리', 
            views: '8.7K', 
            completion_rate: 2, 
            icon_name: 'CheckCircle2', 
            is_hidden: 0,
            content: `### ✅ 실습 과정 안내\n\n기초적인 **CRUD(Create, Read, Update, Delete)** 로직을 마스터합니다.\n\n#### 1. 데이터 구조 설계\n\`\`\`typescript\ninterface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n}\n\`\`\`\n\n#### 2. 기능 구현 순서\n1. 리스트 렌더링 (\`map\` 함수 활용)\n2. 새로운 할 일 추가 (\`useState\` 활용)\n3. 완료 체크 기능\n4. 항목 삭제 기능\n\n#### 3. 영구 저장\n- \`useEffect\`를 사용하여 데이터가 변경될 때마다 **LocalStorage**에 저장하세요.`
          },
          { 
            id: '3', 
            title: '반응형 내비게이션 바 (Dev)', 
            description: '모바일과 데스크톱 환경에 최적화된 메뉴바를 제작합니다.', 
            level: '실전', 
            category: 'UI/UX', 
            tags: 'UI/UX,반응형,CSS', 
            curriculum_link: '1회차 - UI 기본', 
            views: '5.2K', 
            completion_rate: 1, 
            icon_name: 'Menu', 
            is_hidden: 1,
            content: `### 📱 실습 과정 안내\n\n모든 기기에서 완벽하게 작동하는 **Responsive Navbar**를 제작합니다.\n\n#### 핵심 포인트\n- **Media Queries**: 브레이크포인트 설정 (768px)\n- **Hamburger Menu**: 모바일 뷰에서 메뉴 펼치기/접기 애니메이션\n- **Flexbox/Grid**: 레이아웃 배치 최적화\n\n#### 사용 기술\n- Tailwind CSS (또는 Vanilla CSS)\n- React useState (메뉴 토글 상태 관리)`
          },
          { 
            id: '4', 
            title: '다크모드 테마 스위처 (Dev)', 
            description: '시스템 설정과 연동되는 완벽한 다크모드 기능을 구현합니다.', 
            level: '심화', 
            category: 'UI/UX', 
            tags: 'CSS,상태관리', 
            curriculum_link: '1회차 - UI 기본', 
            views: '3.2K', 
            completion_rate: 1, 
            icon_name: 'Moon', 
            is_hidden: 0,
            content: `### 🌙 실습 과정 안내\n\n사용자 경험을 향상시키는 **Dark Mode**를 구현합니다.\n\n#### 구현 단계\n1. CSS 변수(\`--background\`, \`--foreground\`) 정의\n2. \`localStorage\`에 테마 설정 저장\n3. \`matchMedia\`를 통한 시스템 테마 감지\n\n> **Challenge**: 테마 변경 시 매끄러운 트랜지션 효과를 추가해 보세요!`
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

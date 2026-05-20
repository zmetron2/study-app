'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, Zap, 
  ChevronDown, Star, 
  MoreHorizontal, 
  FileText, Globe, Video, ChevronLeft, ChevronRight, Layout, Search, X, MessageSquare, Plus, Link as LinkIcon,
  Server, Globe2, Shield, ExternalLink, ChevronUp, Folder, Terminal, Database, Palette, Cloud, Bookmark, Edit3, Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  provider: string;
  rating: number;
  icon_text: string;
  created_at: string;
}

const CATEGORIES = [
  { label: '전체', icon: Folder },
  { label: '문서/가이드', icon: FileText },
  { label: '개발도구', icon: Terminal },
  { label: '디자인/UIUX', icon: Palette },
  { label: '서버', icon: Cloud },
  { label: '도메인', icon: Shield },
  { label: '이슈', icon: Server },
  { label: 'API', icon: Database },
  { label: '기타', icon: MoreHorizontal }
];

// 마크다운 문법 제거 후 의미있는 소제목과 문장 추출
function parseMarkdownPreview(text: string, maxLength = 400): { badge: string | null, text: string } {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.match(/^---+/));
  let badge: string | null = null;
  let textLines: string[] = [];

  for (const line of lines) {
    if (line.match(/^#{1,6}\s+/) && !badge) {
      badge = line.replace(/^#{1,6}\s+/, '').trim();
    } else if (!line.match(/^#{1,6}\s+/)) {
      textLines.push(line);
    }
  }

  let cleanText = textLines.join(' ')
    .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** 제거
    .replace(/\*(.*?)\*/g, '$1')     // *italic* 제거
    .replace(/`([^`]+)`/g, '$1')     // `code` 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [링크](url) 제거
    .replace(/^[-*+]\s+/gm, '')      // 리스트 기호 제거
    .replace(/^\d+\.\s+/gm, '');     // 번호 리스트 제거

  const truncated = cleanText.length > maxLength ? cleanText.slice(0, maxLength) + '...' : cleanText;
  
  return { badge, text: truncated || cleanText || text };
}

const DEFAULT_RESOURCES: Resource[] = [
  { id: 1, title: 'MDN Web Docs', description: '웹 개발을 위한 종합 문서. HTML, CSS, JS 가이드 제공', url: 'https://developer.mozilla.org', category: '문서/가이드', tags: 'HTML,CSS,JS', provider: 'Mozilla', rating: 4.9, icon_text: 'MDN', created_at: '' },
  { id: 2, title: 'React 공식 문서', description: 'React 공식 홈. 최신 기능 가이드 제공', url: 'https://react.dev', category: '문서/가이드', tags: 'Frontend,React', provider: 'Meta', rating: 4.8, icon_text: 'React', created_at: '' },
  { id: 3, title: 'Tailwind CSS', description: '유틸리티 퍼스트 CSS 프레임워크 공식 문서', url: 'https://tailwindcss.com', category: '개발도구', tags: 'CSS,Tailwind', provider: 'Tailwind Labs', rating: 4.7, icon_text: 'TW', created_at: '' },
  { id: 4, title: 'Figma', description: '인터랙티브 디자인 및 프로토타이핑 도구', url: 'https://figma.com', category: '디자인/UX', tags: 'Design,UI', provider: 'Figma', rating: 4.8, icon_text: 'Fig', created_at: '' },
  { id: 5, title: 'ChatGPT', description: 'AI 기반 대화형 모델 및 프롬프트 서비스', url: 'https://chat.openai.com', category: 'AI도구', tags: 'AI,LLM', provider: 'OpenAI', rating: 4.9, icon_text: 'GPT', created_at: '' },
  { id: 6, title: 'Vercel', description: 'Next.js 최적화 배포 및 호스팅 플랫폼', url: 'https://vercel.com', category: '배포/운영', tags: 'Cloud,Hosting', provider: 'Vercel', rating: 4.8, icon_text: 'Ver', created_at: '' },
  { id: 7, title: 'Supabase', description: '오픈소스 Firebase 대안 데이터베이스 플랫폼', url: 'https://supabase.com', category: 'API', tags: 'DB,Backend', provider: 'Supabase', rating: 4.7, icon_text: 'Supa', created_at: '' },
  { id: 8, title: 'Namecheap', description: '합리적인 가격의 도메인 등록 및 관리 서비스', url: 'https://namecheap.com', category: '도메인', tags: 'Domain,Infra', provider: 'Namecheap', rating: 4.5, icon_text: 'Name', created_at: '' },
  { id: 9, title: 'Visual Studio Code', description: '가장 인기 있는 오픈소스 코드 에디터', url: 'https://code.visualstudio.com', category: '개발도구', tags: 'Editor,IDE', provider: 'Microsoft', rating: 4.9, icon_text: 'VS', created_at: '' },
  { id: 10, title: 'Public APIs', description: '개발에 필요한 공개 API들의 방대한 모음집', url: 'https://public-apis.io', category: 'API', tags: 'API,OpenData', provider: 'PublicAPIs', rating: 4.6, icon_text: 'API', created_at: '' },
  { id: 11, title: 'Google Fonts', description: '무료로 사용 가능한 웹 폰트 라이브러리', url: 'https://fonts.google.com', category: '웹사이트', tags: 'Font,Design', provider: 'Google', rating: 4.9, icon_text: 'Font', created_at: '' },
  { id: 12, title: 'Claude AI', description: 'Anthropic의 고성능 대화형 AI 모델', url: 'https://claude.ai', category: 'AI도구', tags: 'AI,Claude', provider: 'Anthropic', rating: 4.8, icon_text: 'AI', created_at: '' },
  { id: 13, title: 'W3Schools', description: '웹 기술의 기초를 배우기에 좋은 튜토리얼 사이트', url: 'https://w3schools.com', category: '웹사이트', tags: 'Study,Web', provider: 'W3Schools', rating: 4.4, icon_text: 'W3S', created_at: '' },
  { id: 14, title: 'GitHub Desktop', description: 'CLI 없이 Git을 편리하게 사용하는 GUI 도구', url: 'https://desktop.github.com', category: '개발도구', tags: 'Git,Tool', provider: 'GitHub', rating: 4.7, icon_text: 'Git', created_at: '' },
  { id: 15, title: 'Gabia 도메인', description: '국내 최대 도메인 및 호스팅 서비스', url: 'https://gabia.com', category: '도메인', tags: 'Domain,Korea', provider: 'Gabia', rating: 4.3, icon_text: 'Gab', created_at: '' },
  { id: 16, title: '하이드레이션 불일치(Hydration Mismatch) 완벽 가이드', description: '### 🌊 하이드레이션 불일치(Error #418) 원인과 해결법\n\nNext.js나 React SSR 환경에서 가장 자주 발생하는 **Hydration Mismatch**는 서버에서 렌더링한 HTML과 브라우저에서 처음 렌더링한 결과가 다를 때 발생합니다.\n\n---\n\n#### 1. 대표적인 원인\n1. **비결정적 데이터 사용**: `new Date()`, `Math.random()` 등을 컴포넌트 본문에서 직접 호출하는 경우.\n2. **브라우저 전용 API 접근**: `useEffect` 밖에서 `window`, `localStorage`, `sessionStorage`를 사용하는 경우.\n3. **지역별 포맷 차이**: `toLocaleString()` 처럼 서버와 클라이언트의 시간대/언어 설정에 따라 결과가 달라지는 함수 사용.\n4. **잘못된 HTML 구조**: `<a>` 태그 안에 `<a>`를 넣거나, `<p>` 태그 안에 `<div>`를 넣는 등 문법 오류.\n\n#### 2. 확실한 해결 방법\n\n**A. `mounted` 상태 활용 (권장)**\n컴포넌트가 클라이언트에 마운트된 이후에만 동적 데이터를 그리도록 제한합니다.\n```tsx\nconst [mounted, setMounted] = useState(false);\nuseEffect(() => setMounted(true), []);\n\nreturn <div>{mounted ? localStorage.getItem(\'data\') : \'Loading...\'}</div>;\n```\n\n**B. `suppressHydrationWarning` 사용**\n텍스트가 미세하게 다를 수밖에 없는 경우(예: 다크모드 클래스, 단순 연도 등) 속성을 통해 경고를 무시합니다.\n```tsx\n<html suppressHydrationWarning>\n```\n\n**C. `useEffect` 내에서 데이터 갱신**\n초기 상태는 서버와 동일하게 고정값(예: 2026)으로 두고, 마운트 직후 실제 데이터로 업데이트합니다.\n\n#### 3. 주의사항\n- 하이드레이션 에러는 단순 경고가 아닙니다. 이 에러가 발생하면 React는 전체 DOM을 새로 그리게 되어 **성능 저하**와 **이벤트 바인딩 오류**를 유발할 수 있습니다.\n- 모든 동적 요소는 반드시 클라이언트 사이드 마운트 이후에 결정되도록 설계하세요.', url: '#', category: '문서/가이드', tags: 'Hydration,Next.js,React,ErrorFix', provider: 'Vibe', rating: 5.0, icon_text: 'HYD', created_at: '2026-05-05' },
  { id: 17, title: '서버 정보 및 관리 보안 가이드', description: '### 🔐 서버 정보 및 관리자 계정 보안 관리 가이드\n\n현대적인 웹 개발 환경에서 민감한 정보를 안전하게 관리하는 것은 프로젝트의 생존과 직결됩니다. 특정 플랫폼에 종속되지 않는 보편적인 보안 관리 원칙을 정리합니다.\n\n---\n\n#### 1. 환경 변수(Environment Variables) 활용\n가장 기본적인 원칙은 **"코드는 공개되어도 정보는 비공개여야 한다"**는 것입니다.\n- **절대 하드코딩 금지**: API 키, DB 접속 정보 등을 코드에 직접 쓰지 마세요.\n- **.env 파일 분리**: 개발 환경에서는 `.env` 파일을 사용하고, 이 파일은 반드시 `.gitignore`에 등록하여 Git 저장소에서 제외해야 합니다.\n- **플랫폼 시크릿 매니저**: 배포 환경(Cloudflare, Vercel, AWS 등)에서 제공하는 전용 환경 변수 관리 도구를 사용하세요.\n\n#### 2. 서비스 계정 및 비밀 파일 처리\nFCM이나 Google Cloud의 JSON 키 파일과 같이 파일 형태의 보안 정보가 필요한 경우:\n- **문자열화(Stringify)**: 파일 내용을 JSON 문자열로 변환하여 환경 변수에 저장하고, 필요할 때 코드에서 `JSON.parse()`로 읽어 사용하세요.\n- **보안 금고(Vault)**: 대규모 프로젝트라면 HashiCorp Vault나 AWS Secrets Manager 같은 전문 도구 도입을 검토하세요.\n\n#### 3. 관리자 계정 및 접근 제어\n- **최소 권한의 원칙(Least Privilege)**: 관리자 계정이라도 필요한 권한만 부여하세요. 모든 권한을 가진 Root 계정은 가급적 일상 작업에 쓰지 않습니다.\n- **2단계 인증(2FA/MFA) 필수**: 관리 대시보드나 서버 접근 시 Google Authenticator 등을 통한 2차 인증을 반드시 활성화하세요.\n- **IP 화이트리스팅**: 관리자 페이지는 사내 IP나 특정 VPN 환경에서만 접근할 수 있도록 제한하는 것이 안전합니다.\n\n#### 4. 정기적인 키 갱신(Rotation)\n- **유효 기간 설정**: API 키나 비밀번호는 유출 여부와 관계없이 정기적(예: 3개월)으로 갱신하는 습관을 들이세요.\n- **퇴사자 처리**: 팀원이 프로젝트를 떠날 경우 즉시 모든 접근 권한을 회수하고 필요한 경우 키를 재발급하세요.\n\n#### 5. 감사 로그(Audit Logs) 확인\n- **누가, 언제, 무엇을 했는가?**: 시스템 설정 변경이나 민감 데이터 접근 기록을 남기고 정기적으로 모니터링하세요. 이상 징후를 조기에 발견하는 핵심입니다.', url: '#', category: '문서/가이드', tags: 'Security,DevOps,Admin', provider: 'Vibe', rating: 5.0, icon_text: 'SEC', created_at: '2026-05-05' },
  { id: 18, title: '기타 유용한 사이트 모음', description: '여러 카테고리에 속하지 않는 유용한 유틸리티 모음', url: '#', category: '기타', tags: 'Misc,Utils', provider: 'Vibe', rating: 4.0, icon_text: 'Etc', created_at: '' },
];

export default function ResourcesPage() {
  const [mounted, setMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as { role: string };
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/resources');
      const data = await res.json() as { success: boolean, data: Resource[], message?: string };
      
      if (data.success) {
        let allResources = data.data;
        
        // Only use defaults if DB is empty and not in Mock mode
        if (allResources.length === 0 && !data.message?.includes('Mock')) {
          allResources = DEFAULT_RESOURCES;
        }
        
        // Handle local storage for Mock mode
        if (data.message?.includes('Mock')) {
          const localData = localStorage.getItem('local_vibe_resources');
          if (localData) {
            allResources = JSON.parse(localData) as Resource[];
          } else {
            allResources = DEFAULT_RESOURCES;
          }
        }
        
        setResources(allResources);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setResources(DEFAULT_RESOURCES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    let result = resources;
    if (activeCategory !== '전체') {
      result = result.filter(r => r.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredResources(result);
  }, [resources, activeCategory, searchQuery]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 자료를 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
      const data = await res.json() as { success: boolean };
      if (data.success) {
        alert('삭제되었습니다.');
        fetchResources();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsProposalModalOpen(true);
  };

  const stats = {
    total: resources.length,
    docs: resources.filter(r => r.category === '문서/가이드').length,
    tools: resources.filter(r => r.category === '개발도구').length,
    api: resources.filter(r => r.category === 'API').length,
    server: resources.filter(r => r.category === '서버').length,
    issues: resources.filter(r => r.category === '이슈').length
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors">

      {/* --- Header Area (Hero) --- */}
      <header className="relative py-16 md:py-24 px-6 overflow-hidden border-b border-slate-200 dark:border-white/5">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#0b0f1a] -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)] -z-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-6 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-700">
              <Plus className="w-3 h-3" /> Knowledge Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
              기술의 정수를 모은<br />
              <span className="text-indigo-600">스마트 자료실</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed text-sm md:text-base font-medium">
              실무 개발과 스터디에 즉시 활용 가능한 검증된 기술 자료와 도구들을 확인해보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center lg:justify-start">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="무엇을 찾으시나요?" 
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm w-full sm:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white dark:border-white/5 shadow-2xl shadow-indigo-500/5">
              <StatusCard icon={Folder} label="전체 자료" count={stats.total.toString()} color="text-indigo-500" />
              <StatusCard icon={Database} label="API 명세" count={stats.api.toString()} color="text-blue-500" />
              <StatusCard icon={Server} label="이슈/해결" count={stats.issues.toString()} color="text-red-500" />
              <StatusCard icon={FileText} label="문서/가이드" count={stats.docs.toString()} color="text-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar */}
        <aside className="lg:w-64 space-y-8 shrink-0">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-6 shadow-sm transition-colors">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <CategoryItem 
                  key={cat.label}
                  label={cat.label} 
                  count={resources.filter(r => cat.label === '전체' ? true : r.category === cat.label).length.toString()} 
                  icon={cat.icon} 
                  active={activeCategory === cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                />
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 space-y-4 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <MessageSquare className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">자료 제안하기</h3>
              <p className="text-[11px] text-indigo-100 leading-relaxed mb-4 font-medium">
                더 많은 사람들이 도움을 받을 수 있도록 좋은 자료를 추천해주세요!
              </p>
              <button 
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full bg-white text-indigo-600 py-3 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                추천하기 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Resource List */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 dark:border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{activeCategory}</h2>
              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-400 rounded uppercase">{filteredResources.length} Items</span>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              <TabItem label="최신순" active />
              <TabItem label="인기순" />
              <TabItem label="즐겨찾기" />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-black animate-pulse uppercase tracking-widest">Loading Resources...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredResources.map((resource) => (
                <ResourceItem 
                  key={resource.id} 
                  resource={resource} 
                  isAdmin={isAdmin}
                  onEdit={() => handleEdit(resource)}
                  onDelete={() => handleDelete(resource.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <Folder className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">해당 카테고리에 자료가 없습니다.</p>
              <button onClick={() => {setActiveCategory('전체'); setSearchQuery('');}} className="mt-4 text-indigo-600 font-black text-xs hover:underline">모든 자료 보기</button>
            </div>
          )}

          {/* Pagination (Visual Only) */}
          {filteredResources.length > 5 && (
            <div className="flex justify-center items-center gap-2 pt-10">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-600/20">1</button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 transition-all"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </main>

      {/* --- Proposal Modal --- */}
      {isProposalModalOpen && (
        <ResourceProposalModal 
          onClose={() => {
            setIsProposalModalOpen(false);
            setEditingResource(null);
          }} 
          onSuccess={() => {
            fetchResources();
            setEditingResource(null);
          }}
          editData={editingResource}
        />
      )}
    </div>
  );
}

// Subcomponents
function StatusCard({ icon: Icon, label, count, color }: { icon: React.ElementType, label: string, count: string, color: string }) {
  return (
    <div className="space-y-3 group cursor-pointer p-2 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all">
      <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-center sm:text-left">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{count}</p>
      </div>
    </div>
  );
}

function CategoryItem({ label, count, icon: Icon, active, onClick }: { label: string, count: string, icon: React.ElementType, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900'}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-black">{label}</span>
      </div>
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-indigo-500/30' : 'bg-slate-100 dark:bg-white/10'}`}>{count}</span>
    </div>
  );
}

function CustomCodeBlock({ children, className, inline, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  if (inline) {
    return <code className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-[12px]" {...props}>{children}</code>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black text-white transition-all active:scale-95"
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>
      <pre className="bg-slate-950 text-slate-200 p-6 rounded-2xl overflow-x-auto font-mono text-[13px] leading-relaxed border border-white/5 shadow-2xl custom-scrollbar">
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  );
}

function ResourceItem({ 
  resource, 
  isAdmin, 
  onEdit, 
  onDelete 
}: { 
  resource: Resource, 
  isAdmin: boolean,
  onEdit: () => void,
  onDelete: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const preview = parseMarkdownPreview(resource.description);

  return (
    <div 
      className={`bg-white dark:bg-slate-900 rounded-2xl border ${isOpen ? 'border-indigo-500/50 shadow-xl' : 'border-slate-200 dark:border-white/10'} flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden`}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex flex-col md:flex-row gap-5 cursor-pointer"
      >
        <div className="w-14 h-14 bg-slate-900 dark:bg-indigo-600 rounded-2xl flex items-center justify-center text-xs font-black text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
          {resource.icon_text}
        </div>
        <div className="flex-1 space-y-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{resource.title}</h4>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-sm uppercase tracking-tighter whitespace-nowrap">{resource.category}</span>
            </div>
            {!isOpen && (
              <div className="text-[13px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                <p className="line-clamp-2">
                  {preview.badge && (
                    <span className="inline-block mr-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider">{preview.badge}</span>
                  )}
                  {preview.text}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {resource.tags.split(',').map((tag, i) => (
              <span key={i} className="text-[10px] font-black px-2.5 py-1 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-lg border border-slate-100 dark:border-white/5 tracking-wider uppercase">{tag.trim()}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0 flex md:flex-col justify-between items-end md:justify-center border-t md:border-t-0 md:border-l border-slate-50 dark:border-white/5 pt-4 md:pt-0 md:pl-5 gap-3">
          <div className="flex flex-col items-end gap-2 w-full">
            <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-3">
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); /* Bookmark Toggle */ }}
                className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors active:scale-95"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-black">
                <Star className="w-3.5 h-3.5 fill-yellow-500" /> {resource.rating}
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-indigo-500 transition-colors mt-auto md:mt-2">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-white/5">
          <div className="py-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-black text-slate-900 dark:text-white mt-8 mb-4 pb-2 border-b border-slate-100 dark:border-white/5" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2 ml-1 md:ml-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words ml-2 md:ml-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 ml-2 md:ml-4 marker:text-slate-400" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 ml-2 md:ml-4 marker:text-slate-400 font-bold" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                a: ({node, ...props}) => <a className="text-indigo-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} {...props} />,
                strong: ({node, ...props}) => <strong className="font-black text-slate-800 dark:text-slate-200" {...props} />,
                code: CustomCodeBlock,
                hr: ({node, ...props}) => <hr className="my-8 border-slate-200 dark:border-white/10" {...props} />,
                table: ({children}) => (
                  <div className="overflow-x-auto my-8 px-1">
                    <table className="w-full border-collapse border-t-2 border-b-2 border-slate-200/50 dark:border-white/10 border-l-0 border-r-0">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({children}) => <thead className="bg-slate-100/80 dark:bg-white/10">{children}</thead>,
                th: ({children}) => (
                  <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest border-b border-slate-200/80 dark:border-white/20 border-r border-slate-200/80 dark:border-white/20 last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({children}) => (
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10 border-r border-slate-200/60 dark:border-white/10 last:border-r-0">
                    {children}
                  </td>
                )
              }}
            >
              {resource.description}
            </ReactMarkdown>
          </div>
          
          {resource.url && resource.url !== '#' && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="font-black text-slate-700 dark:text-slate-300 mr-2">참고 :</span>
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                {resource.url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabItem({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-5 py-2 rounded-lg text-[11px] font-black transition-all ${active ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-slate-800'}`}>
      {label}
    </button>
  );
}

function ResourceProposalModal({ 
  onClose, 
  onSuccess, 
  editData 
}: { 
  onClose: () => void, 
  onSuccess: () => void,
  editData?: Resource | null
}) {
  const [formData, setFormData] = useState({ 
    title: editData?.title || '', 
    url: editData?.url || '', 
    description: editData?.description || '', 
    category: editData?.category || '개발도구', 
    tags: editData?.tags || '', 
    provider: editData?.provider || '', 
    icon_text: editData?.icon_text || '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('자료 명칭은 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editData ? 'PUT' : 'POST';
      const bodyData = editData 
        ? { ...formData, id: editData.id }
        : {
          ...formData,
          rating: 4.5,
          icon_text: formData.icon_text || formData.title.substring(0, 3).toUpperCase()
        };

      const res = await fetch('/api/resources', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json() as { success: boolean, message?: string };
      
      if (data.success) {
        alert(editData ? '자료가 수정되었습니다.' : '소중한 자료 추천 감사합니다!');
        onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              {editData ? 'Edit Asset' : 'Propose Asset'}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {editData ? '자료 수정하기' : '자료 제안하기'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                {editData ? '자료의 정보를 최신 상태로 업데이트합니다.' : '스터디원들과 함께 공유하고 싶은 훌륭한 기술 자료나 사이트를 알려주세요!'}
              </p>
            </div>
            
            <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">자료 명칭</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="예: Tailwind UI" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">카테고리</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition-all dark:text-white"
                  >
                    {CATEGORIES.filter(c => c.label !== '전체').map(c => (
                      <option key={c.label} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">참고 링크 (URL)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="url" 
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">제공처</label>
                  <input 
                    type="text" 
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    placeholder="예: Meta, Google" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">아이콘 텍스트</label>
                  <input 
                    type="text" 
                    value={formData.icon_text}
                    onChange={(e) => setFormData({...formData, icon_text: e.target.value})}
                    placeholder="예: REA" 
                    maxLength={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">태그 (쉼표 구분)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="React, Frontend" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">상세 내용 (마크다운 지원)</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="자료에 대한 상세 설명이나 유용한 정보를 마크다운 형식으로 작성해주세요." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? '처리 중...' : (editData ? '수정 완료하기' : '추천 제안 제출하기')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

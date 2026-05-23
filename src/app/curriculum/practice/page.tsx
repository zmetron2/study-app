'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Edit3, 
  Clock, ChevronDown, ChevronRight, LayoutGrid, Timer, Rocket, Code, Shield, Layers, Box, Monitor, Bot, Newspaper, Sparkles, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PracticeCurriculumPage() {
  const router = useRouter();
  const [courseType, setCourseType] = useState<'regular' | 'special'>('regular');
  const [activeSection, setActiveSection] = useState('core');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleStartPractice = () => {
    if (!isLoggedIn) {
      alert('강의 신청자에게 제공되는 자료입니다. 로그인이 필요합니다.');
    } else {
      setIsMaterialOpen(true);
    }
  };

  const handleCourseTypeChange = (type: 'regular' | 'special') => {
    setCourseType(type);
    if (type === 'special') {
      router.push('/curriculum/special-saas');
    }
  };

  // ScrollSpy Logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['core', 'track-a', 'track-b', 'track-c'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors scroll-smooth">

      {/* --- Header Area --- */}
      <header className="relative bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white py-16 transition-colors border-b border-slate-200 dark:border-white/5 text-left overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-slate-500/5 dark:from-indigo-500/10 dark:to-slate-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Rocket size={14} className="animate-pulse" /> Step 03. Serverless & Global Execution
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">커리큘럼 : 실전</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              해외 플랫폼을 활용하여 서버리스 아키텍처로 웹 서비스를 실전 운영하는 단계입니다.<br />
              글로벌 배포, 기능별 최적의 서버리스 조합, 그리고 지능형 에이전트와 인증 기능까지 완벽하게 결합합니다.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-indigo-600/20"
              >
                <PlayCircle className="w-5 h-5" /> 학습 문의하기
              </Link>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                자료다운로드 안내
              </button>
            </div>
          </div>
          
          {/* Compact Learning Outcomes Card */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-indigo-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> 습득 역량
              </h3>
              <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20">
                LEVEL 3
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Layers size={12} />} label="글로벌 서버리스 배포" desc="Cloudflare, Vercel 등을 통한 배포 통제" />
                <OutcomeItem icon={<Zap size={12} />} label="기능별 서버 조합" desc="기능성 페이지를 서버리스로 유기적 설계" />
                <OutcomeItem icon={<Rocket size={12} />} label="지능형 에이전트 통합" desc="보안 인증 및 AI 에이전트 파이프라인 완성" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-indigo-600/5 dark:bg-indigo-500/10 rounded-xl px-3 py-2 border border-indigo-500/10">
                  <span className="text-[12px] font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">글로벌 서버리스 상용 서비스 배포 및 런칭</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    교육시간
                  </span>
                  <span className="text-[12px] font-black text-indigo-600 dark:text-indigo-400">6시간</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Section --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
        
        {/* Binder Tabs Wrapper */}
        <div className="flex flex-col w-full relative z-20">
          {/* Binder Tabs Header */}
          <div className="flex gap-1.5 pl-3">
            <button 
              onClick={() => handleCourseTypeChange('regular')}
              className={`px-5 py-3 text-xs font-black rounded-t-xl border-t border-x transition-all duration-200 relative -mb-[1px] ${
                courseType === 'regular' 
                  ? 'bg-card border-border text-slate-800 dark:text-white z-20 pb-[14px] pt-3' 
                  : 'bg-slate-100/50 dark:bg-white/5 border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 z-10 pb-2.5 pt-2.5'
              }`}
            >
              정규과정
            </button>
            <button 
              onClick={() => handleCourseTypeChange('special')}
              className={`px-5 py-3 text-xs font-black rounded-t-xl border-t border-x transition-all duration-200 relative -mb-[1px] ${
                courseType === 'special' 
                  ? 'bg-card border-border text-slate-800 dark:text-white z-20 pb-[14px] pt-3' 
                  : 'bg-slate-100/50 dark:bg-white/5 border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 z-10 pb-2.5 pt-2.5'
              }`}
            >
              특화과정
            </button>
          </div>

          {/* Roadmap Bar (Binder Body) */}
          <div className="bg-card rounded-xl border border-border p-2 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar transition-colors relative z-10">
            <div className="flex items-center gap-2 px-4 whitespace-nowrap group cursor-pointer">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">정규과정 로드맵</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-100 dark:bg-white/10 mx-2" />
            <RoadmapItem label="1. 입문" rounds="Mindset & Comm." href="/curriculum" />
            <RoadmapArrow />
            <RoadmapItem label="2. 기초" rounds="System & Structure" href="/curriculum/basic" />
            <RoadmapArrow />
            <RoadmapItem label="3. 실전" rounds="Execution & Build" href="/curriculum/practice" active />
            <RoadmapArrow />
            <RoadmapItem label="4. 심화" rounds="Scale & Real World" href="/curriculum/advanced" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-colors text-left">
              <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-1 transition-colors">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="bg-indigo-600 text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">3</span> 
                  실전 단계
                </h3>
                <p className="text-[12px] text-indigo-500 font-bold">"실제로 결과물을 만드는 단계"</p>
              </div>
              <div className="divide-y divide-border">
                <SidebarItem 
                  title="핵심 주제 (Core)" 
                  active={activeSection === 'core'} 
                  onClick={() => scrollToSection('core')}
                />
                
                <div className="flex flex-col">
                  <SidebarItem 
                    title="선택형 프로젝트 트랙" 
                    active={['track-a', 'track-b', 'track-c'].includes(activeSection)}
                    onClick={() => scrollToSection('track-a')}
                  />
                  
                  <div className="bg-slate-50/50 dark:bg-white/5 py-1">
                    <SidebarItem title="트랙 A: 글로벌 에지 배포" active={activeSection === 'track-a'} onClick={() => scrollToSection('track-a')} isSubItem />
                    <SidebarItem title="트랙 B: 기능별 서버 조합" active={activeSection === 'track-b'} onClick={() => scrollToSection('track-b')} isSubItem />
                    <SidebarItem title="트랙 C: 에이전트 & 인증 연동" active={activeSection === 'track-c'} onClick={() => scrollToSection('track-c')} isSubItem />
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Guide */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="text-lg">🎁</span> 실전 프로젝트 가이드
                </h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-indigo-500 uppercase tracking-widest">트랙 A 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="Cloudflare/Vercel 에지 글로벌 배포" />
                    <BenefitItem text="커스텀 도메인 & SSL 보안 적용" />
                  </ul>
                </div>
                <div className="h-[1px] bg-border" />
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-teal-500 uppercase tracking-widest">트랙 B 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="Supabase, R2, D1 서버리스 데이터 연동" />
                    <BenefitItem text="특성별 기능성 페이지 API 조합 설계" />
                  </ul>
                </div>
                <div className="h-[1px] bg-border" />
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-orange-500 uppercase tracking-widest">트랙 C 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="OAuth 소셜 로그인 및 보안 회원가입" />
                    <BenefitItem text="지능형 에이전트 런타임 탑재 완성" />
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-16">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-12 transition-colors">
              {/* Content Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-8 border-b border-border text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Execution & Build</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">3. 실전: 프로덕트 빌딩</h2>
                  <p className="text-indigo-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "실제로 결과물을 만드는 단계"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    설계를 넘어 실제 사용자가 사용할 수 있는 어플리케이션을 구축합니다.<br />
                    보안, 일관성, 확장성을 고려한 프로급 개발 프로세스를 경험하세요.
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div id="core" className="scroll-mt-32 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">핵심 주제 (Common Core)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "글로벌 서버리스 원리", desc: "Vercel/Cloudflare Pages 등 글로벌 에지 노드 배포 메커니즘" },
                    { title: "서버리스 데이터 저장소", desc: "D1, Supabase PostgreSQL, R2 스토리지의 기능 및 특장점 비교" },
                    { title: "OAuth & 보안 회원가입", desc: "간편 소셜 로그인 및 토큰 기반 보안 회원 인증 체계" },
                    { title: "지능형 에이전트 아키텍처", desc: "서버 환경에서의 AI 에이전트 설정 및 상태 보존 프레임워크" },
                    { title: "마이크로서비스 조합 설계", desc: "결제, 이메일, 이미지 처리 등 서버리스 기능 유기적 연동" },
                    { title: "트래픽 모니터링 & 로깅", desc: "서버리스 환경에서의 실시간 트래픽 추적과 비용 최적화 전략" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Tracks */}
              <div className="pt-4 border-t border-border text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Box size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">선택형 프로젝트 트랙 (Optional Projects)</h3>
                </div>
                
                <div className="space-y-12">
                  {/* Track A */}
                  <div id="track-a" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track A</div>
                      <Monitor className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">서버리스 글로벌 배포</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">작성한 코드를 글로벌 에지 네트워크에 배포하고 무중단 운영 환경을 조성합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. Cloudflare Pages & Vercel 프로덕션 배포</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">로컬 코드를 Git과 연동하여 전 세계 사용자가 1초 만에 접근 가능한 글로벌 에지 CDN 배포를 수행합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 커스텀 도메인 & SSL 자동 바인딩</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">배포된 서버리스 어플리케이션에 브랜드 고유한 도메인과 서브도메인을 할당하고 무료 SSL 보안 인증서를 자동 적용합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all"
                    >
                      서버리스 배포 시작
                    </button>
                  </div>

                  {/* Track B */}
                  <div id="track-b" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-100 dark:border-blue-500/20 p-8 space-y-6 hover:border-blue-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track B</div>
                      <Code className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">기능별 서버 조합 아키텍처</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">데이터베이스, 스토리지, 컴퓨팅 리소스를 서버리스 서비스별 특장점에 맞게 최적으로 조합합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. Supabase DB + R2 스토리지 연계</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">안정적인 대용량 파일 저장소(R2)와 트랜잭션 유저 DB(Supabase)를 연결하여 멀티 리소스 간의 효율적 연동을 이뤄냅니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 기능성 페이지 API 서버 조합 구성</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">로그인, 상품 조회, 결제 처리 등 각 페이지의 비즈니스 성격에 따라 가장 합리적이고 저비용의 컴퓨팅 유닛 조합을 완성합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all"
                    >
                      서버리스 아키텍처 실습 시작
                    </button>
                  </div>

                  {/* Track C */}
                  <div id="track-c" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-100 dark:border-orange-500/20 p-8 space-y-6 hover:border-orange-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track C</div>
                      <Bot className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">에이전트 및 연동 설정</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">보안 회원가입 인프라를 마련하고 지능형 AI 에이전트를 안정적으로 서비스에 탑재합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 보안 회원가입 & 배포 설정 연동</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">OAuth 소셜 로그인과 회원가입 흐름을 연동하고, 상용 배포 단계에서 필수적인 환경 변수(.env) 보안 관리 체계를 수립합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. AI 에이전트 설정 & 실시간 파이프라인</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">사용자의 동적 요청에 대응하고 다양한 작업을 자율 처리하는 AI 에이전트를 클라우드 에지 함수에 탑재하여 실시간 구동시킵니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-500 transition-all"
                    >
                      에이전트 및 인증 실습 시작
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/basic">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" /> 2. 기초 단계로
                  </button>
                </Link>
                <Link href="/curriculum/advanced">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/20">
                    4. 심화 단계: 비즈니스 스케일업 <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      {isGuideOpen && <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />}

      {/* Material Modal (Logged-in only) */}
      {isMaterialOpen && <MaterialModal isOpen={isMaterialOpen} onClose={() => setIsMaterialOpen(false)} />}
    </div>
  );
}

function OutcomeItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group/item">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover/item:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-0">
        <h4 className="text-[12px] font-black text-slate-800 dark:text-white leading-tight">{label}</h4>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 group cursor-default">
      <CheckCircle2 className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
      <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-tight">
        {text}
      </span>
    </li>
  );
}

function RoadmapItem({ label, rounds, href, active = false }: { label: string, rounds: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className="block shrink-0">
      <div className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all cursor-pointer ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-[12px] whitespace-nowrap ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{rounds}</span>
      </div>
    </Link>
  );
}

function RoadmapArrow() {
  return <ArrowRight className="w-4 h-4 text-slate-200 shrink-0" />;
}

function SidebarItem({ title, active = false, onClick, isSubItem = false }: { title: string, active?: boolean, onClick: () => void, isSubItem?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 flex items-center justify-between cursor-pointer transition-all ${
        active 
          ? 'bg-indigo-600/10 border-r-4 border-indigo-600' 
          : 'hover:bg-slate-50 dark:hover:bg-white/5'
      } ${isSubItem ? 'pl-9 py-2.5' : ''}`}
    >
      <span className={`font-bold transition-colors ${
        isSubItem ? 'text-[12px]' : 'text-xs'
      } ${
        active ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {title}
      </span>
      {active && !isSubItem && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
      {active && isSubItem && <div className="w-1 h-1 rounded-full bg-indigo-600/60" />}
    </div>
  );
}

function GuideStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
        {number}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h4>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function GuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">자료다운로드 프로세스 안내</h3>
            <div className="space-y-6 pt-4">
              <GuideStep 
                number="01" 
                title="결제 및 강의 신청" 
                desc="문의하기 또는 상담을 통해 강의를 신청하고 결제를 완료합니다." 
              />
              <GuideStep 
                number="02" 
                title="로그인 정보 수령" 
                desc="관리자로부터 강의 사이트 접속을 위한 전용 로그인 정보를 전달받습니다." 
              />
              <GuideStep 
                number="03" 
                title="로그인 및 자료 확인" 
                desc="전달받은 정보로 로그인 후, 각 커리큘럼 단계에서 실습 자료를 다운로드합니다." 
              />
              <GuideStep 
                number="04" 
                title="바이브 코딩 실습" 
                desc="제공된 자료와 AI 도구를 활용하여 실제 프로젝트 실습을 진행합니다." 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
            >
              확인했습니다
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6 text-center">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-indigo-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">실전 단계 프로젝트 패키지.zip</span>
              <button className="text-indigo-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">상용 배포 체크리스트.pdf</span>
              <button className="text-indigo-600 font-black text-sm hover:underline">다운로드</button>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-xs text-slate-400 mb-4">* 본 자료의 무단 배포 및 상업적 이용을 금지합니다.</p>
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 dark:bg-white/10 text-white py-4 rounded-2xl font-black transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

export const runtime = 'edge';


import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Edit3, 
  Clock, ChevronDown, ChevronRight, LayoutGrid, Timer, Target, Sparkles, Cpu, Box, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CurriculumPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Zap size={14} className="animate-pulse" /> Step 01. Mindset
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">커리큘럼 : 입문</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              코딩 실력 이전에 AI와 소통하는 법(Mindset)을 먼저 익힙니다.<br />
              명확한 지시가 어떻게 드라마틱한 결과의 차이를 만드는지 직접 경험해보세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-emerald-600/20"
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-emerald-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 습득 역량
              </h3>
              <div className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                LEVEL 1
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Cpu size={12} />} label="AI 구조 이해" desc="작동 원리와 한계 명확히 인지" />
                <OutcomeItem icon={<Edit3 size={12} />} label="요청 작성" desc="프롬프트 설계 및 소통 능력" />
                <OutcomeItem icon={<Box size={12} />} label="결과물 1개" desc="자신만의 첫 결과물 완성" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-emerald-600/5 dark:bg-emerald-500/10 rounded-xl px-3 py-2 border border-emerald-500/10">
                  <span className="text-[12px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">AI로 원하는 결과 만들기</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    정규과정 (입문 단계)
                  </span>
                  <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">이 단계: 6시간</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    특강 (입문 단계)
                    <span className="relative group/tooltip inline-flex items-center ml-0.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      {/* Tooltip Popup */}
                      <span className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none border border-white/10 font-normal leading-relaxed text-left">
                        <span className="block font-bold text-amber-400 mb-1 text-[12px]">
                          💡 특강 과정이란?
                        </span>
                        디자이너, 기획자, 개발자, PM 등 관련 종사자처럼 <strong>배경지식이 있어 빠르게 교육 진행이 가능한 분</strong>들을 위한 맞춤형 단기 압축 과정입니다. (입문, 기초... 각 단계별로 각각 3시간씩 진행)
                        <span className="absolute top-full left-4 border-4 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95" />
                      </span>
                    </span>
                  </span>
                  <span className="text-[12px] font-black text-amber-600 dark:text-amber-400">이 단계: 3시간</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Section --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
        
        {/* Course Type Switcher */}
        <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 p-1 rounded-2xl w-fit border border-slate-200 dark:border-white/5 shadow-inner">
          <button 
            onClick={() => handleCourseTypeChange('regular')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              courseType === 'regular' 
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-white/5' 
                : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-350'
            }`}
          >
            정규과정 (Step 1-4)
          </button>
          <button 
            onClick={() => handleCourseTypeChange('special')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              courseType === 'special' 
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-white/5' 
                : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-350'
            }`}
          >
            단일주제과정 (심화 트랙)
          </button>
        </div>

        {/* Roadmap Bar */}
        <div className="bg-card rounded-xl border border-border p-2 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar transition-colors relative z-20">
          <div className="flex items-center gap-2 px-4 whitespace-nowrap group cursor-pointer">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">정규과정 로드맵</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-100 dark:bg-white/10 mx-2" />
          <RoadmapItem label="1. 입문" rounds="Mindset & Comm." href="/curriculum" active />
          <RoadmapArrow />
          <RoadmapItem label="2. 기초" rounds="System & Structure" href="/curriculum/basic" />
          <RoadmapArrow />
          <RoadmapItem label="3. 실전" rounds="Execution & Build" href="/curriculum/practice" />
          <RoadmapArrow />
          <RoadmapItem label="4. 심화" rounds="Scale & Real World" href="/curriculum/advanced" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-colors text-left">
              <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-1 transition-colors">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="bg-emerald-600 text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">1</span> 
                  입문 단계
                </h3>
                <p className="text-[12px] text-emerald-600 font-bold">"국내 호스팅 환경에 웹사이트 제작"</p>
              </div>
              <div className="divide-y divide-border">
                <SidebarItem 
                  title="핵심 주제 (Core)" 
                  active={activeSection === 'core'} 
                  onClick={() => scrollToSection('core')}
                />
                
                <div className="flex flex-col">
                  {/* Main Track Menu */}
                  <SidebarItem 
                    title="선택형 실습 트랙" 
                    active={['track-a', 'track-b', 'track-c'].includes(activeSection)}
                    onClick={() => scrollToSection('track-a')} // Scroll to first track
                  />
                  
                  {/* Sub-menu Tracks with Indentation */}
                  <div className="bg-slate-50/50 dark:bg-white/5 py-1">
                    <SidebarItem 
                      title="트랙 A: 서버 및 도메인" 
                      active={activeSection === 'track-a'} 
                      onClick={() => scrollToSection('track-a')}
                      isSubItem
                    />
                    <SidebarItem 
                      title="트랙 B: 웹 프로젝트 구현" 
                      active={activeSection === 'track-b'} 
                      onClick={() => scrollToSection('track-b')}
                      isSubItem
                    />
                    <SidebarItem 
                      title="트랙 C: DB 및 기술스택" 
                      active={activeSection === 'track-c'} 
                      onClick={() => scrollToSection('track-c')}
                      isSubItem
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Selection Guide */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="text-lg font-normal">🎁</span> 실습 선택 가이드
                </h3>
              </div>
              <div className="space-y-5">
                {/* Track A */}
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">트랙 A 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="가상 호스팅 개설 및 도메인 DNS 연동" />
                    <BenefitItem text="클라이언트-서버 웹 통신 체계 이해" />
                  </ul>
                </div>
                
                <div className="h-[1px] bg-border" />
                
                {/* Track B */}
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">트랙 B 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="웹 기획/디자인부터 코딩 실무 마스터" />
                    <BenefitItem text="바이브코딩 활용 반응형 사이트 제작" />
                  </ul>
                </div>

                <div className="h-[1px] bg-border" />

                {/* Track C */}
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">트랙 C 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="반복 작업 자동화 경험" />
                    <BenefitItem text="실무 생산성 향상" />
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
                    <span className="bg-emerald-500/10 text-emerald-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Mindset & Background</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">1. 입문: 웹 인프라 및 사이트 제작</h2>
                  <p className="text-emerald-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "국내 호스팅 환경에서 실전 웹사이트 제작하기"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    코딩 실력 이전에 웹의 본질적인 원리(서버, DNS, DB)를 직관적으로 학습합니다.<br />
                    AI 협업 코딩 기법인 <strong>바이브코딩</strong> 패러다임을 이해하고, 나만의 실질적인 웹 프로젝트를 인프라 위에 안전하게 구축해보세요.
                  </p>
                </div>
              </div>

              {/* Core Topics (Common Core) */}
              <div id="core" className="scroll-mt-32 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Edit3 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">핵심 주제 (Common Core)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "바이브코딩의 원리와 마인드셋", desc: "코딩 지식 한계를 뛰어넘어 AI와 매끄럽게 협업하는 프롬프트(Role/Goal/Constraints) 소통 원리 이해" },
                    { title: "웹 작동원리 (Client-Server)", desc: "브라우저(Client)가 웹서버(Server)에 자원을 요청하고 화면을 렌더링하는 핵심 흐름 이해" },
                    { title: "도메인(Domain)과 DNS 구조", desc: "도메인 구매부터 DNS 네임서버 연결을 통해 가상 호스팅 서버 IP와 문자 주소를 수동 매핑하는 과정 체득" },
                    { title: "프레임워크 & 라이브러리 스택", desc: "React, Next.js 등의 모던 프레임워크와 기술스택의 차이점을 파악하고 비즈니스 목적에 맞게 매칭" },
                    { title: "데이터베이스(DB) 입문 기초", desc: "데이터를 안정적으로 관리하고 보존하기 위한 RDBMS(MySQL)의 가치와 필요성 이해" },
                    { title: "웹 아키텍처 모델링", desc: "호스팅 서버, 데이터베이스, 스토리지 등 기본적인 웹서비스 아키텍처의 설계 모델 파악" },
                    { title: "프롬프트 명시도 및 구체성 훈련", desc: "AI가 엉뚱한 코드를 짜지 않도록 목표와 제한사항을 정교하게 제어하는 개발 명세 훈련" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Tracks Section Header */}
              <div className="pt-4 border-t border-border text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">선택형 실습 트랙 (Optional Tracks)</h3>
                </div>
                <p className="text-sm text-slate-500 mb-10">본인의 비즈니스 목표에 맞는 최적의 실습 트랙을 선택하세요. (중복 실습을 적극 추천합니다)</p>
                
                <div className="space-y-12">
                  {/* Track A */}
                  <div id="track-a" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track A</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-emerald-400" /> 예상 60분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">서버 및 도메인</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">국내 웹 호스팅 환경을 기반으로 실제 가상 서버를 개설하고, 도메인 연결 및 통신 원리를 실전에 바로 적용해봅니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 가상 호스팅 개설 & 도메인 DNS 맵핑</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">국내 호스팅사를 이용해 가상 웹 서버 공간을 활성화하고, 구입한 도메인의 네임서버(DNS) 정보와 서버 IP를 수동으로 매칭합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 클라이언트-서버 웹 통신 추적</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">브라우저 개발자 도구를 열어 Client의 HTTP 요청 정보가 웹서버에 도달하고 리소스를 전송받는 실시간 네트워크 흐름을 확인합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-600/25"
                    >
                      서버/도메인 트랙 실습 시작하기
                    </button>
                  </div>

                  {/* Track B */}
                  <div id="track-b" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track B</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-emerald-400" /> 예상 60분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">웹 프로젝트 구현</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">기획과 디자인 단계부터 AI 협업 바이브코딩을 접목하여, 반응형 정적 웹페이지를 온전히 제작하고 서버에 올려 론칭합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 사이트 기획 & 반응형 레이아웃 디자인</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">만들고자 하는 웹페이지의 요구사항을 명확히 하고, 모바일 및 데스크톱 디바이스 규격에 대처하는 반응형 구조를 기획/디자인합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 바이브코딩 코딩 & FTP 서버 업로드</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">AI 비서에게 구체적인 HTML/CSS 작성을 제안하여 사이트 코딩을 신속하게 완수하고, FTP로 호스팅 공간에 전송하여 실시간 오픈합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-600/25"
                    >
                      웹 프로젝트 트랙 실습 시작하기
                    </button>
                  </div>

                  {/* Track C */}
                  <div id="track-c" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm text-left">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track C</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-emerald-400" /> 예상 60분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">DB 및 기술스택</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">데이터를 수집하고 비즈니스를 유연하게 확장할 수 있도록 DB 설계 및 프레임워크 선택 안목을 탄탄히 합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 호스팅 MySQL DB 연동 & 스키마 기본</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">호스팅에서 제공하는 MySQL DB 서버를 열고, 사용자 계정 설정 및 DB 테이블 스키마 생성과 기본적인 저장 쿼리(SELECT/INSERT)를 실습합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 서비스 최적화 프레임워크 & 기술 아키텍처 매칭</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">내 서비스 유형(단순 랜딩, 데이터 수집, 동적 앱)에 꼭 들어맞는 라이브러리/프레임워크 스택과 호스팅/클라우드 매핑 설계를 도출합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-600/25"
                    >
                      DB/기술스택 트랙 실습 시작하기
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Step Placeholder */}
              <div className="pt-8 border-t border-border flex justify-end">
                <Link href="/curriculum/basic">
                  <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all hover:scale-105 shadow-lg shadow-emerald-600/20">
                    2. 기초 단계: 시스템 사고 <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
                <button onClick={() => setIsGuideOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
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
                  onClick={() => setIsGuideOpen(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal (Logged-in only) */}
      {isMaterialOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMaterialOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6 text-center">
              <div className="flex justify-end">
                <button onClick={() => setIsMaterialOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="w-20 h-20 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="w-10 h-10 text-emerald-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
                <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">입문 단계 실습 패키지.zip</span>
                  <button className="text-emerald-600 font-black text-sm hover:underline">다운로드</button>
                </div>
                <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">프롬프트 템플릿 모음.pdf</span>
                  <button className="text-emerald-600 font-black text-sm hover:underline">다운로드</button>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-slate-400 mb-4">* 본 자료의 무단 배포 및 상업적 이용을 금지합니다.</p>
                <button 
                  onClick={() => setIsMaterialOpen(false)}
                  className="w-full bg-slate-900 dark:bg-white/10 text-white py-4 rounded-2xl font-black transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OutcomeItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group/item">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
      <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
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
        active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-[12px] whitespace-nowrap ${active ? 'text-emerald-200' : 'text-slate-400'}`}>{rounds}</span>
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
          ? 'bg-emerald-500/10 border-r-4 border-emerald-500' 
          : 'hover:bg-slate-50 dark:hover:bg-white/5'
      } ${isSubItem ? 'pl-9 py-2.5' : ''}`}
    >
      <span className={`font-bold transition-colors ${
        isSubItem ? 'text-[12px]' : 'text-xs'
      } ${
        active ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {title}
      </span>
      {active && !isSubItem && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {active && isSubItem && <div className="w-1 h-1 rounded-full bg-emerald-500/60" />}
    </div>
  );
}

function GuideStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
        {number}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h4>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

'use client';

export const runtime = 'edge';


import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Edit3, 
  Clock, ChevronDown, ChevronRight, LayoutGrid, Timer, Target, Database, Cpu, Globe, Sparkles, GitBranch, Layers, X, Box
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BasicCurriculumPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 dark:from-sky-500/10 dark:to-blue-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold">
              <Database size={14} className="animate-pulse" /> Step 02. System & Service
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">커리큘럼 : 기초</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              결과물이 만들어지는 원리를 설계하고 실무급 서비스를 모두 구현해보는 단계입니다.<br />
              도메인 DNS 심화 설정부터 각종 데이터베이스 및 기능성 서버 활용, 보안 인증 대시보드 구축까지 실전 경쟁력을 기릅니다.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-sky-600 hover:bg-sky-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-sky-600/20"
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-sky-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-sky-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" /> 습득 역량
              </h3>
              <div className="bg-sky-600/10 text-sky-600 dark:text-sky-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-sky-500/20">
                LEVEL 2
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Globe size={12} />} label="도메인 DNS 통제" desc="국내외 DNS 및 서브도메인 연결 지배" />
                <OutcomeItem icon={<Database size={12} />} label="서버 & 데이터 아키텍처" desc="SQL/NoSQL DB, 스토리지, 소켓 서버 매핑" />
                <OutcomeItem icon={<Layers size={12} />} label="실무형 기능 전체 구현" desc="로그인 인증, 회원관리 및 반응형 대시보드" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-sky-600/5 dark:bg-sky-500/10 rounded-xl px-3 py-2 border border-sky-500/10">
                  <span className="text-[12px] font-bold text-sky-600/70 dark:text-sky-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">실무 필수 웹서비스 및 고도화 인프라 완성</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-sky-500" />
                    정규과정 (기초 단계)
                  </span>
                  <span className="text-[12px] font-black text-sky-600 dark:text-sky-400">이 단계: 6시간</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    특강 (기초 단계)
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
          <RoadmapItem label="1. 입문" rounds="Mindset & Comm." href="/curriculum" />
          <RoadmapArrow />
          <RoadmapItem label="2. 기초" rounds="System & Structure" href="/curriculum/basic" active />
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
                  <span className="bg-sky-600 text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">2</span> 
                  기초 단계
                </h3>
                <p className="text-[12px] text-sky-500 font-bold">"왜 결과가 달라지는지 이해하는 단계"</p>
              </div>
              <div className="divide-y divide-border">
                <SidebarItem 
                  title="핵심 주제 (Core)" 
                  active={activeSection === 'core'} 
                  onClick={() => scrollToSection('core')}
                />
                
                <div className="flex flex-col">
                  <SidebarItem 
                    title="선택형 실습 트랙" 
                    active={['track-a', 'track-b', 'track-c'].includes(activeSection)}
                    onClick={() => scrollToSection('track-a')}
                  />
                  
                  <div className="bg-slate-50/50 dark:bg-white/5 py-1">
                    <SidebarItem 
                      title="트랙 A: 도메인 & DNS 심화" 
                      active={activeSection === 'track-a'} 
                      onClick={() => scrollToSection('track-a')}
                      isSubItem
                    />
                    <SidebarItem 
                      title="트랙 B: 기능성 서버 & 스택" 
                      active={activeSection === 'track-b'} 
                      onClick={() => scrollToSection('track-b')}
                      isSubItem
                    />
                    <SidebarItem 
                      title="트랙 C: 실무 웹서비스 구현" 
                      active={activeSection === 'track-c'} 
                      onClick={() => scrollToSection('track-c')}
                      isSubItem
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Guide */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="text-lg">🎁</span> 실습 선택 가이드
                </h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-indigo-500 uppercase tracking-widest">트랙 A 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="국내외 DNS 레코드 제어력 확보" />
                    <BenefitItem text="서브도메인 활용 멀티 서비스 연동" />
                  </ul>
                </div>
                <div className="h-[1px] bg-border" />
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-teal-500 uppercase tracking-widest">트랙 B 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="SQL/NoSQL DB 설계 및 운영 지식" />
                    <BenefitItem text="스토리지 & 실시간 소켓 서버 개설" />
                  </ul>
                </div>
                <div className="h-[1px] bg-border" />
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-orange-500 uppercase tracking-widest">트랙 C 선택 시</p>
                  <ul className="space-y-1.5">
                    <BenefitItem text="JWT/Session 회원인증 체계 구축" />
                    <BenefitItem text="실시간 반응형 데이터 대시보드 제작" />
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
                    <span className="bg-sky-100 text-sky-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">System & Structure</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">2. 기초: 시스템 사고의 시작</h2>
                  <p className="text-sky-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "왜 결과가 달라지는지 이해하는 단계"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    AI가 결과를 만들어내는 기술적 배경과 데이터의 흐름을 학습합니다.<br />
                    구조를 이해하면 더 복잡하고 안정적인 서비스를 설계할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div id="core" className="scroll-mt-32 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Database size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">핵심 주제 (Common Core)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "서버/클라이언트 & DNS 원리", desc: "국내외 DNS 레코드(A, CNAME, TXT) 구조와 라우팅 원리" },
                    { title: "SQL vs NoSQL 데이터베이스", desc: "서비스 요구사항에 맞는 올바른 DB 엔진 선정 기법" },
                    { title: "클라우드 스토리지 아키텍처", desc: "비정형 파일(이미지, 영상) 저장을 위한 클라우드 스토리지 설계" },
                    { title: "실시간 통신 & 웹소켓", desc: "실시간 양방향 데이터 전송을 위한 소켓 서버의 기본 이해" },
                    { title: "보안 회원인증 체계", desc: "세션(Session)과 토큰(JWT) 방식의 장단점 및 실무 적용 전략" },
                    { title: "실무 웹 대시보드 기획", desc: "효율적인 데이터 시각화와 반응형 레이아웃 구성 방법" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-sky-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Tracks */}
              <div className="pt-4 border-t border-border text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">선택형 실습 트랙 (Optional Tracks)</h3>
                </div>
                
                <div className="space-y-12">
                  {/* Track A */}
                  <div id="track-a" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-sky-100 dark:border-sky-500/20 p-8 space-y-6 hover:border-sky-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track A</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-sky-400" /> 예상 70분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">도메인 & DNS 심화</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">웹사이트 주소 연결과 멀티 도메인 구조를 완벽하게 통제합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 가상 호스팅 DNS 레코드 매핑</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">국내 가비아 및 해외 Cloudflare 등을 활용한 CNAME, A 레코드 설정과 SSL 보안 연결을 연동합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 서브도메인을 통한 멀티 서비스 분리</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">하나의 도메인으로 메인 웹사이트, 회원 관리 페이지, API 서버를 완벽히 분리 연동하는 라우팅을 설계합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-sky-600 transition-all"
                    >
                      도메인 & DNS 실습 시작
                    </button>
                  </div>

                  {/* Track B */}
                  <div id="track-b" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-100 dark:border-teal-500/20 p-8 space-y-6 hover:border-teal-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track B</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-teal-400" /> 예상 90분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">기능성 서버 & 데이터베이스</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">웹앱에 필수적인 다양한 특수 목적 서버와 데이터 저장 체계를 마스터합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. SQL vs NoSQL 멀티 DB 매핑</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">회원 데이터는 관계형 DB에, 실시간 로그는 비관계형 DB에 설계하고 분기 처리 CRUD API를 구축합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 클라우드 스토리지 & 실시간 소켓</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">이미지/파일 저장을 위한 스토리지 연동 및 웹소켓을 통한 실시간 채팅/알림 서버 기능을 연계 구현합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-teal-600 transition-all"
                    >
                      기능성 서버 실습 시작
                    </button>
                  </div>

                  {/* Track C */}
                  <div id="track-c" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-100 dark:border-orange-500/20 p-8 space-y-6 hover:border-orange-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track C</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} className="text-orange-400" /> 예상 80분
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">실무 웹서비스 전체 구현</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">인증, 회원 관리, 대시보드 등 현업에서 가장 필요로 하는 핵심 비즈니스 로직을 완제품으로 빌딩합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 01. 보안 회원인증 및 관리자 대시보드</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">Bcrypt 암호화, JWT 발급 기반 로그인/회원가입 기능 및 회원 권한 통제 백오피스를 제작합니다.</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold mb-2">실습 02. 반응형 통계 대시보드 시각화</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">가입 추이, 서버 상태, 데이터 트래픽 등을 반응형 차트와 데이터 그리드 표를 활용하여 실전형 UI로 시각화합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
                    >
                      실무 웹서비스 실습 시작
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" /> 1. 입문 단계로
                  </button>
                </Link>
                <Link href="/curriculum/practice">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20">
                    3. 실전 단계: 프로덕트 빌딩 <ChevronRight className="w-4 h-4" />
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
                <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
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
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
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
              
              <div className="w-20 h-20 bg-sky-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="w-10 h-10 text-sky-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
                <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">기초 단계 실습 패키지.zip</span>
                  <button className="text-sky-600 font-black text-sm hover:underline">다운로드</button>
                </div>
                <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">시스템 설계 가이드.pdf</span>
                  <button className="text-sky-600 font-black text-sm hover:underline">다운로드</button>
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
      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
        active ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-[12px] whitespace-nowrap ${active ? 'text-sky-200' : 'text-slate-400'}`}>{rounds}</span>
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
          ? 'bg-sky-600/10 border-r-4 border-sky-600' 
          : 'hover:bg-slate-50 dark:hover:bg-white/5'
      } ${isSubItem ? 'pl-9 py-2.5' : ''}`}
    >
      <span className={`font-bold transition-colors ${
        isSubItem ? 'text-[12px]' : 'text-xs'
      } ${
        active ? 'text-sky-600' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {title}
      </span>
      {active && !isSubItem && <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
      {active && isSubItem && <div className="w-1 h-1 rounded-full bg-sky-600/60" />}
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

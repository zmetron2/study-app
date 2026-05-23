'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Clock, LayoutGrid, Crown, Share2, Smartphone, Cpu, Sparkles, X, Box
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdvancedCurriculumPage() {
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
    const sections = ['core', 'track-a', 'track-b', 'track-c', 'track-d'];
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
              <Crown size={14} className="animate-pulse" /> Step 04. Scale Up
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">커리큘럼 : 심화 마스터</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              이미 바이브코딩을 활용하여 스스로 빌딩할 수 있는 분들을 위한 단계입니다.<br />
              자신의 목표에 맞는 전문 주제를 자유롭게 선택하여 스페셜리스트 트랙을 마스터하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-purple-600/20"
              >
                <PlayCircle className="w-5 h-5" /> 스페셜리스트 트랙 문의
              </Link>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                가이드 자료 다운로드
              </button>
            </div>
          </div>
          
          {/* Compact Learning Outcomes Card */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-purple-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> 핵심 습득 역량
              </h3>
              <div className="bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-purple-500/20">
                MASTER
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Share2 size={12} />} label="자율 디버깅" desc="AI 프롬프트 통제 및 에러 피드백 루프 완벽 통제" />
                <OutcomeItem icon={<Smartphone size={12} />} label="플랫폼 확장" desc="모바일 앱, 브라우저 확장 및 데스크톱 네이티브 앱 제작" />
                <OutcomeItem icon={<Cpu size={12} />} label="인프라 & 자동화" desc="리눅스 서버, 로컬 LLM 구축 및 운영/콘텐츠 자동화" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-purple-600/5 dark:bg-purple-500/10 rounded-xl px-3 py-2 border border-purple-500/10">
                  <span className="text-[12px] font-bold text-purple-600/70 dark:text-purple-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">자율형 9대 심화 스페셜리스트 트랙</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-purple-500" />
                    심화 선택과정 (트랙제)
                  </span>
                  <span className="text-[12px] font-black text-purple-600 dark:text-purple-400">자율 선택 수강</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    압축 1:1 세션 매핑
                    <span className="relative group/tooltip inline-flex items-center ml-0.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      {/* Tooltip Popup */}
                      <span className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none border border-white/10 font-normal leading-relaxed text-left">
                        <span className="block font-bold text-amber-400 mb-1 text-[12px]">
                          💡 일대일 마스터 세션
                        </span>
                        선택하신 심화 실무 주제에 대해 1:1 맞춤 피드백과 코드 리뷰, 아키텍처 가이드를 집중적으로 제공하는 맞춤형 집중 가이드 세션입니다.
                        <span className="absolute top-full left-4 border-4 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95" />
                      </span>
                    </span>
                  </span>
                  <span className="text-[12px] font-black text-amber-600 dark:text-amber-400">트랙별 맞춤 구성</span>
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
            <RoadmapItem label="3. 실전" rounds="Execution & Build" href="/curriculum/practice" />
            <RoadmapArrow />
            <RoadmapItem label="4. 심화" rounds="Scale & Real World" href="/curriculum/advanced" active />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-colors text-left">
              <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-1 transition-colors">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">4</span> 
                  심화 단계
                </h3>
                <p className="text-[12px] text-purple-500 font-bold">"자율형 스페셜리스트 트랙"</p>
              </div>
              <div className="divide-y divide-border">
                <SidebarItem 
                  title="핵심 주제 (Core)" 
                  active={activeSection === 'core'} 
                  onClick={() => scrollToSection('core')}
                />
                
                <div className="flex flex-col">
                  <SidebarItem 
                    title="선택형 심화 트랙" 
                    active={['track-a', 'track-b', 'track-c', 'track-d'].includes(activeSection)}
                    onClick={() => scrollToSection('track-a')}
                  />
                  
                  <div className="bg-slate-50/50 dark:bg-white/5 py-1">
                    <SidebarItem title="트랙 A: 수익형 빌딩" active={activeSection === 'track-a'} onClick={() => scrollToSection('track-a')} isSubItem />
                    <SidebarItem title="트랙 B: 플랫폼 확장" active={activeSection === 'track-b'} onClick={() => scrollToSection('track-b')} isSubItem />
                    <SidebarItem title="트랙 C: OS & AI 인프라" active={activeSection === 'track-c'} onClick={() => scrollToSection('track-c')} isSubItem />
                    <SidebarItem title="트랙 D: 자동화 파이프라인" active={activeSection === 'track-d'} onClick={() => scrollToSection('track-d')} isSubItem />
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Guide */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="text-lg">👑</span> 마스터 클래스 가이드
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  스스로 완결성 있는 프로덕트를 빌딩하고 배포하여, 비즈니스 가치와 운영 효율성을 극대화합니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="실제 수익 모델 다각화" />
                  <BenefitItem text="다양한 생태계 플랫폼 확장" />
                  <BenefitItem text="로컬 인프라 & 자동화 운영" />
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
                    <span className="bg-purple-100 text-purple-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Specialist Tracks</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">4. 심화: 스페셜리스트 마스터</h2>
                  <p className="text-purple-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "스스로 프로덕트를 빌딩하는 자율형 바이브코더 스페셜 세션"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    기존의 기본 과정을 이수했거나 바이브코딩을 스스로 유연하게 다룰 수 있는 분들을 대상으로,<br />
                    실제 서비스 배포 및 수익화, 인프라 구축, 운영 자동화 등 고도화된 전문 주제를 선택하여 진행합니다.
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div id="core" className="scroll-mt-32 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Share2 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">공통 핵심 지식 (Common Core)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "스스로 문제 해결하기 (자율 바이브코딩)", desc: "AI 에러 극복을 위한 고도화된 디버깅 기법 및 프롬프트 제어 파이프라인" },
                    { title: "비즈니스 기획 & BM 검증", desc: "검증되지 않은 아이디어를 빠르게 검증하고 실제 결제가 일어나는 유료 BM으로 전환하는 전략" },
                    { title: "자동 유지보수 아키텍처", desc: "주기적인 헬스체크 및 크래시 모니터링, 자율 복구 수행 에이전트 설계 및 통합" },
                    { title: "고성능 분산 인프라", desc: "트래픽 폭증에 유연하게 대응하고 엣지 컴퓨팅을 활용한 글로벌 무중단 서비스 구조" },
                    { title: "글로벌 보안 & 컴플라이언스", desc: "해외 서비스 진출 시 필수적인 GDPR, HIPAA 대응 및 토큰/환경 변수 암호화 관리" },
                    { title: "지속 가능한 리팩토링", desc: "AI 협업 규칙을 활용하여 레거시 코드를 스스로 리뉴얼하고 기술 부채를 통제하는 노하우" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Tracks */}
              <div className="pt-4 border-t border-border text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Crown size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">선택형 심화 트랙 (Advanced Focus)</h3>
                </div>
                
                <div className="space-y-12">
                  {/* Track A */}
                  <div id="track-a" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-100 dark:border-purple-500/20 p-8 space-y-6 hover:border-purple-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track A</div>
                      <Crown className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">수익형 빌딩 (SaaS & Game)</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">직접 빌딩한 서비스와 게임을 통해 시장에서 직접 수익을 실현하고 비즈니스로 전개하는 방법을 학습합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="font-bold">수익형 웹앱 제작하기:</span> 정기 결제, PG사/토스페이먼츠 연동, 구독 모델 B2B SaaS 실전 구축
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="font-bold">수익형 게임 제작하기:</span> HTML5 웹 게임 제작, 인앱 광고, 게임 루프 최적화 및 광고 수익화 아키텍처
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all"
                    >
                      수익형 빌딩 트랙 시작
                    </button>
                  </div>

                  {/* Track B */}
                  <div id="track-b" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-100 dark:border-blue-500/20 p-8 space-y-6 hover:border-blue-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track B</div>
                      <Smartphone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">플랫폼 확장 (Mobile & Extensions)</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">웹의 경계를 허물고 모바일 앱과 브라우저 확장 생태계로 서비스를 성공적으로 이식 및 전개합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="font-bold">모바일앱 제작하기:</span> WebView 기반 하이브리드 앱 제작, Capacitor/React Native 연동 및 앱스토어 패키징
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="font-bold">에이전트/크롬/기타 확장프로그램 제작하기:</span> 브라우저 내에서 백그라운드로 작동하는 Chrome Extensions 자동화 프로그램 구현
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all"
                    >
                      플랫폼 확장 트랙 시작
                    </button>
                  </div>

                  {/* Track C */}
                  <div id="track-c" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track C</div>
                      <Cpu className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">고급 OS & AI 인프라 (OS & Local AI)</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">데스크톱 네이티브 어플리케이션 및 리눅스/로컬 AI 컴퓨팅 리소스를 직접 구축하고 제어합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold">윈도우 응용 프로그램 제작하기:</span> Electron 및 Tauri 데스크톱 프레임워크 빌드 및 OS 네이티브 API 연계
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold">리눅스 서버 세팅 & AI 운영하기:</span> VPS 리눅스 서버 초기 환경 구축, Nginx, Docker, 그리고 AI 서비스 인프라 구성
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold">로컬 LLM / 로컬 API 운영하기:</span> Ollama, vLLM을 활용한 온프레미스 AI 로컬 인프라 배포 및 API 연동
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all"
                    >
                      OS & AI 인프라 트랙 시작
                    </button>
                  </div>

                  {/* Track D */}
                  <div id="track-d" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-100 dark:border-amber-500/20 p-8 space-y-6 hover:border-amber-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track D</div>
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">자동화 파이프라인 (Automation Systems)</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">반복되는 비즈니스 업무 관리와 대량의 고품질 콘텐츠 생산 체계를 자동화 엔진으로 완전 통제합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-bold">운영 관리 자동화:</span> n8n, GitHub Actions, Slack/Discord 웹훅을 활용한 운영 태스크 완벽 자동화
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-bold">콘텐츠 제작 자동화:</span> OpenAI, Midjourney, TTS API를 연계한 AI 멀티미디어/글/비디오 생성 파이프라인 구축
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-500 transition-all"
                    >
                      자동화 파이프라인 트랙 시작
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/practice">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" /> 3. 실전 단계로
                  </button>
                </Link>
                <div className="text-xs font-bold text-slate-400 italic flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" /> 모든 단계를 완료하셨습니다!
                </div>
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
      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
      <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
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
        active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-[12px] whitespace-nowrap ${active ? 'text-purple-200' : 'text-slate-400'}`}>{rounds}</span>
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
          ? 'bg-purple-600/10 border-r-4 border-purple-600' 
          : 'hover:bg-slate-50 dark:hover:bg-white/5'
      } ${isSubItem ? 'pl-9 py-2.5' : ''}`}
    >
      <span className={`font-bold transition-colors ${
        isSubItem ? 'text-[12px]' : 'text-xs'
      } ${
        active ? 'text-purple-600' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {title}
      </span>
      {active && !isSubItem && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
      {active && isSubItem && <div className="w-1 h-1 rounded-full bg-purple-600/60" />}
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
          
          <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-purple-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">심화 단계 운영 패키지.zip</span>
              <button className="text-purple-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">글로벌 비즈니스 가이드.pdf</span>
              <button className="text-purple-600 font-black text-sm hover:underline">다운로드</button>
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

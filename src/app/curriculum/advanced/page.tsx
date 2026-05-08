'use client';

export const runtime = 'edge';


import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Edit3, 
  Clock, ChevronDown, ChevronRight, LayoutGrid, Timer, Crown, Share2, TrendingUp, Smartphone, Globe, Cpu, Sparkles, X, Box
} from 'lucide-react';
import Link from 'next/link';

export default function AdvancedCurriculumPage() {
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
    const sections = ['core', 'track-a', 'track-b', 'track-c', 'track-d', 'track-e'];
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
              <Crown size={14} className="animate-pulse" /> Step 04. Scale
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">커리큘럼 : 심화</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              개별 프로덕트를 넘어 지속 가능한 서비스 운영과 수익화를 다룹니다.<br />
              글로벌 시장과 모바일, 고성능 인프라까지 영역을 확장하세요.
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-purple-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> 습득 역량
              </h3>
              <div className="bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-purple-500/20">
                LEVEL 4
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Share2 size={12} />} label="운영 이해" desc="상용 서비스의 안정적인 유지보수 및 보안" />
                <OutcomeItem icon={<TrendingUp size={12} />} label="확장 관리" desc="성능 최적화 및 비즈니스 성장 전략 수립" />
                <OutcomeItem icon={<Smartphone size={12} />} label="서비스 운영" desc="모바일 및 글로벌 환경 운영 역량" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between bg-purple-600/5 dark:bg-purple-500/10 rounded-xl px-3 py-2 border border-purple-500/10">
                  <span className="text-[12px] font-bold text-purple-600/70 dark:text-purple-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">고급 기능 & 확장</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Section --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
        
        {/* Roadmap Bar */}
        <div className="bg-card rounded-xl border border-border p-2 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar transition-colors relative z-20">
          <div className="flex items-center gap-2 px-4 whitespace-nowrap group cursor-pointer">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">커리큘럼 로드맵</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-colors text-left">
              <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-1 transition-colors">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">4</span> 
                  심화 단계
                </h3>
                <p className="text-[12px] text-purple-500 font-bold">"실제 서비스 수준으로 끌어올리는 단계"</p>
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
                    active={['track-a', 'track-b', 'track-c', 'track-d', 'track-e'].includes(activeSection)}
                    onClick={() => scrollToSection('track-a')}
                  />
                  
                  <div className="bg-slate-50/50 dark:bg-white/5 py-1">
                    <SidebarItem title="트랙 A: SaaS 운영" active={activeSection === 'track-a'} onClick={() => scrollToSection('track-a')} isSubItem />
                    <SidebarItem title="트랙 B: 수익화 트랙" active={activeSection === 'track-b'} onClick={() => scrollToSection('track-b')} isSubItem />
                    <SidebarItem title="트랙 C: 모바일 확장" active={activeSection === 'track-c'} onClick={() => scrollToSection('track-c')} isSubItem />
                    <SidebarItem title="트랙 D: 글로벌 배포" active={activeSection === 'track-d'} onClick={() => scrollToSection('track-d')} isSubItem />
                    <SidebarItem title="트랙 E: 고급 AI 활용" active={activeSection === 'track-e'} onClick={() => scrollToSection('track-e')} isSubItem />
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
                  개발자를 넘어 서비스 운영자로서의 역량을 기릅니다. 시장의 반응에 대응하고 성장하는 법을 배웁니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="실제 수익 모델 구축" />
                  <BenefitItem text="글로벌 서비스 운영 지식" />
                  <BenefitItem text="고급 AI 인프라 활용" />
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
                    <span className="bg-purple-100 text-purple-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Scale & Real World</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">4. 심화: 비즈니스 스케일업</h2>
                  <p className="text-purple-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "실제 서비스 수준으로 끌어올리는 단계"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    프로덕트를 넘어 실제 사용자 가치를 창출하고 비즈니스로 연결하는 과정을 학습합니다.<br />
                    글로벌 시장 대응과 고도화된 AI 인프라 활용 능력을 완성하세요.
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div id="core" className="scroll-mt-32 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Share2 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">핵심 주제 (Common Core)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "배포 전략 (로컬 → 글로벌)", desc: "국내 에지 런타임을 넘어 글로벌 CDN과 멀티 리전 배포 전략" },
                    { title: "고급 도메인 & 메일 보안", desc: "멀티도메인 운영, HTTPS 보안 고도화 및 이메일 발송 안정화" },
                    { title: "성능 & 비용 최적화", desc: "API 호출 비용을 줄이고 사용자 경험을 개선하는 성능 튜닝" },
                    { title: "유지보수 (에이전트 자동화)", desc: "AI 에이전트를 활용한 로그 모니터링 및 자동 오류 대응" },
                    { title: "확장 구조 설계", desc: "트래픽 증가에 대응하는 마이크로 서비스 및 서버리스 아키텍처" },
                    { title: "협업/버전 관리 개념", desc: "프로페셔널한 팀 협업을 위한 Git Flow 및 CI/CD 파이프라인" },
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
                      <PlayCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">SaaS 운영 트랙</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">실제 유료 사용자가 있는 서비스를 운영하는 노하우를 배웁니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-purple-500" /> 정기 결제 및 PG 연동 실무
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-purple-500" /> 사용자 CS 및 서비스 안정성 관리
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all"
                    >
                      SaaS 트랙 마스터
                    </button>
                  </div>

                  {/* Track B */}
                  <div id="track-b" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-100 dark:border-amber-500/20 p-8 space-y-6 hover:border-amber-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track B</div>
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">수익화 트랙</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">자동화 시스템을 통해 지속 가능한 수익 모델을 설계합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> 콘텐츠 및 툴 자동 판매 구조 구축
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> 제휴 마케팅 및 광고 자동화 전략
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-500 transition-all"
                    >
                      수익화 트랙 마스터
                    </button>
                  </div>

                  {/* Track C */}
                  <div id="track-c" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-100 dark:border-blue-500/20 p-8 space-y-6 hover:border-blue-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track C</div>
                      <Smartphone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">모바일 확장</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">웹 서비스를 모바일 환경으로 이식하여 접근성을 극대화합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> 웹뷰(WebView) 기반 하이브리드 앱 제작
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> 푸시 알림 및 모바일 전용 기능 연동
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all"
                    >
                      모바일 트랙 마스터
                    </button>
                  </div>

                  {/* Track D */}
                  <div id="track-d" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-emerald-500/20 p-8 space-y-6 hover:border-emerald-500 transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track D</div>
                      <Globe className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">글로벌 배포</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">전 세계 사용자를 대상으로 하는 다국어 서비스 인프라를 구축합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 다국어(i18n) 지원 및 통화 변환 처리
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 해외 호스팅 최적화 및 레이턴시 개선
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all"
                    >
                      글로벌 트랙 마스터
                    </button>
                  </div>

                  {/* Track E */}
                  <div id="track-e" className="scroll-mt-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-white/20 p-8 space-y-6 hover:border-primary transition-all group shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Track E</div>
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">고급 AI 활용</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">자체 LLM 활용 및 고성능 AI 인프라(GPU) 활용 구조를 이해합니다.</p>
                    </div>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> 개인 서버 내 LLM 배포 및 튜닝 기초
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> NVIDIA NIM 및 가속 인프라 연결 전략
                      </li>
                    </ul>
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-4 bg-slate-900 dark:bg-white/20 text-white font-black rounded-2xl hover:bg-primary transition-all"
                    >
                      AI 마스터 트랙
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

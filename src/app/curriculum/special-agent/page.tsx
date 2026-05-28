'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Clock, LayoutGrid, Sparkles, X, Box, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom SVG components for reliability (as per AGENTS.md)
function BotIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function BrainIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}

export default function SpecialAgentPage() {
  const router = useRouter();
  const [courseType, setCourseType] = useState<'regular' | 'special'>('special');
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
    if (type === 'regular') {
      router.push('/curriculum');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors scroll-smooth">

      {/* --- Header Area --- */}
      <header className="relative bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white py-16 transition-colors border-b border-slate-200 dark:border-white/5 text-left overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold">
              <BotIcon className="w-3.5 h-3.5 animate-pulse" /> 특화과정 · Track E
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">AI 에이전트 구축 (AI Agent Building)</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              스스로 생각하고 행동하는 자율형 AI 에이전트를 구축합니다.<br />
              LangChain, LangGraph 상태 머신 및 벡터 DB(RAG)를 통해 실무 업무를 스스로 처리하는 AI 두뇌를 지배하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-violet-600/20"
              >
                <PlayCircle className="w-5 h-5" /> 특강 과정 신청하기
              </Link>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                가이드 자료 다운로드
              </button>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-violet-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" /> 습득 역량
              </h3>
              <div className="bg-violet-600/10 text-violet-600 dark:text-violet-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-violet-500/20">
                SPECIALIST
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<BotIcon className="w-3.5 h-3.5 text-violet-600" />} label="Tool Calling 에이전트" desc="LLM의 외부 도구 사용(Function Call) 매핑 설계" />
                <OutcomeItem icon={<BrainIcon className="w-3.5 h-3.5 text-violet-600" />} label="LangGraph 상태 머신" desc="멀티 에이전트 간의 워크플로우 협업 및 제어" />
                <OutcomeItem icon={<Box size={12} />} label="RAG 벡터 DB 및 챗봇" desc="pgvector/Pinecone 지식 기반 검색 및 서비스 탑재" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-violet-600/5 dark:bg-violet-500/10 rounded-xl px-3 py-2 border border-violet-500/10">
                  <span className="text-[12px] font-bold text-violet-600/70 dark:text-violet-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">독립 자율형 AI 에이전트 시스템 작동</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-violet-500" />
                    교육시간
                  </span>
                  <span className="text-[12px] font-black text-violet-600 dark:text-violet-400">6시간</span>
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
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">특화과정 로드맵</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-100 dark:bg-white/10 mx-2" />
            <RoadmapItem label="A. 수익형 빌딩" href="/curriculum/special-saas" />
            <RoadmapItem label="B. 플랫폼 확장" href="/curriculum/special-platform" />
            <RoadmapItem label="C. OS & AI 인프라" href="/curriculum/special-infra" />
            <RoadmapItem label="D. 자동화 파이프라인" href="/curriculum/special-automation" />
            <RoadmapItem label="E. AI 에이전트" href="/curriculum/special-agent" active />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-lg">👑</span> 특화과정 가이드
              </h3>
              <div className="space-y-4">
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  자율형 AI 의사결정을 실현하는 에이전틱 워크플로우 설계 능력과 LangGraph, RAG 데이터베이스를 연동하는 프리미엄 구축법을 배웁니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="LLM Tool Calling 설계 및 연동" />
                  <BenefitItem text="LangGraph 멀티 에이전트 오케스트레이션" />
                  <BenefitItem text="pgvector RAG 검색 파이프라인 탑재" />
                </div>
              </div>
            </div>

            {/* Course Distinction Card */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm transition-colors text-left">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-lg">💡</span> 과정 구분 안내
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-white/5">
                  <h4 className="text-[12px] font-bold text-violet-600 dark:text-violet-400 mb-1">정규과정</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    중복 없이 단계별로 연계되어 탄탄하게 실력을 완성해 나가는 체계적인 로드맵 교육과정입니다.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-white/5">
                  <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-350 mb-1">특화과정</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    선수 지식 없이도 누구나 참여해 특정 주제를 기초부터 결과 완성까지 단번에 마스터하는 단일 교육과정입니다.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-12 transition-colors">
              {/* Content Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-8 border-b border-border text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-violet-100 text-violet-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Autonomous AI & Agent Specialist</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">AI 에이전트 구축 (AI Agent Building)</h2>
                  <p className="text-violet-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "단순 챗봇을 넘어 스스로 추론하고 행동하는 완벽한 AI 동료(Agent) 완성하기"
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div className="space-y-6 text-left">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">실습 구성 항목</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Tool Calling 및 ReAct 구조화", desc: "LLM이 스스로 웹 검색, DB 쿼리, 이메일 등의 적절한 도구를 동적 선택 및 실행하게 설계" },
                    { title: "LangGraph 기반 멀티 에이전트 협업", desc: "분산된 역할을 수행하는 에이전트들이 상호 협력하고 피드백을 수용하는 상태 그래프 코딩" },
                    { title: "벡터 DB (Supabase / pgvector) 연동", desc: "기업 전용 비정형 지식 데이터를 임베딩(Embedding)하고 고속 코사인 유사도 검색 시스템 구현" },
                    { title: "실시간 모니터링 & 프로덕션 배포", desc: "에이전트 실행의 중간 과정(Trace)을 실시간 추적하고 최종 Slack/Discord/웹 채널에 배포" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-violet-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-violet-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Curriculum Section */}
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-500" /> 상세 커리큘럼 (총 6시간)
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      session: "세션 1 (2시간)",
                      title: "AI 에이전트 이론 및 도구 사용(Tool Calling) 아키텍처",
                      details: [
                        "LLM 에이전트의 정의와 자율 지능 추론 구조(ReAct 프레임워크) 이해",
                        "OpenAI / Anthropic API를 이용한 도구 정의 스키마 설계 및 Tool Calling 연동",
                        "안정적인 에이전트 동작을 위한 구조화된 출력(Structured Output) 및 프롬프트 제어 기법"
                      ]
                    },
                    {
                      session: "세션 2 (2시간)",
                      title: "LangGraph 프레임워크 기반 상태 머신 및 Multi-Agent 오케스트레이션",
                      details: [
                        "LangGraph를 활용하여 흐름 상태(State)가 영구 보존(Persistence)되는 의사결정 그래프 설계",
                        "기획 에이전트, 코딩 에이전트, 검증 에이전트 간의 자동화된 순환적(Cyclic) 피드백 설계",
                        "결정적 분기 처리 및 인간 관여(Human-in-the-loop) 개입 검증 시나리오 구축"
                      ]
                    },
                    {
                      session: "세션 3 (2시간)",
                      title: "pgvector RAG 지식 저장소 구축 및 실전 에이전트 서비스 통합",
                      details: [
                        "Supabase pgvector / Pinecone을 활용한 비정형 PDF/텍스트 데이터의 다차원 벡터화 적재",
                        "에이전트가 상황에 따라 벡터 DB 검색 도구를 호출하여 전문 지식을 반영하는 하이브리드 RAG 구현",
                        "자율 지능 에이전트를 Next.js 웹 앱 및 Slack/Discord 채널에 탑재하여 실시간 스트리밍 대화형 배포"
                      ]
                    }
                  ].map((curri, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-violet-500/30 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded shrink-0 self-start sm:self-auto">{curri.session}</span>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white flex-1">{curri.title}</h4>
                      </div>
                      <ul className="space-y-1.5 pl-1.5">
                        {curri.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-[12px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-violet-500 mt-1 shrink-0">•</span>
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Download Guide Material Card */}
                <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-3xl p-6 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-left space-y-1">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">특화과정 실습 가이드 패키지</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      회차별 세부 소스코드와 에이전트 템플릿 파일이 포함된 패키지를 다운로드할 수 있습니다.
                    </p>
                  </div>
                  <button
                    onClick={handleStartPractice}
                    className="px-6 py-2.5 bg-violet-600 text-white font-black rounded-xl hover:bg-violet-500 transition-all text-xs shadow-md shadow-violet-600/15 whitespace-nowrap"
                  >
                    가이드 자료 다운로드
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/special-automation">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-xs">
                    <ArrowRight className="w-4 h-4 rotate-180" /> D. 자동화 파이프라인 단계로
                  </button>
                </Link>
                <Link href="/curriculum">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-600 transition-all shadow-lg hover:shadow-violet-500/20 text-xs">
                    정규 과정 첫 단계로 <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      {isGuideOpen && <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />}

      {/* Material Modal */}
      {isMaterialOpen && <MaterialModal isOpen={isMaterialOpen} onClose={() => setIsMaterialOpen(false)} />}
    </div>
  );
}

function OutcomeItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group/item">
      <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
      <CheckCircle2 className="w-3 h-3 text-violet-500 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
      <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-tight">
        {text}
      </span>
    </li>
  );
}

function RoadmapItem({ label, href, active = false }: { label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className="block shrink-0">
      <div className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all cursor-pointer ${
        active ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
      </div>
    </Link>
  );
}

function GuideStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black">
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
            <div className="bg-violet-600/10 text-violet-600 dark:text-violet-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">자료다운로드 프로세스 안내</h3>
            <div className="space-y-6 pt-4">
              <GuideStep number="01" title="결제 및 강의 신청" desc="문의하기 또는 상담을 통해 강의를 신청하고 결제를 완료합니다." />
              <GuideStep number="02" title="로그인 정보 수령" desc="관리자로부터 강의 사이트 접속을 위한 전용 로그인 정보를 전달받습니다." />
              <GuideStep number="03" title="로그인 및 자료 확인" desc="전달받은 정보로 로그인 후, 각 커리큘럼 단계에서 실습 자료를 다운로드합니다." />
              <GuideStep number="04" title="바이브 코딩 실습" desc="제공된 자료와 AI 도구를 활용하여 실제 프로젝트 실습을 진행합니다." />
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onClose}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
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
            <button onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="w-20 h-20 bg-violet-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-violet-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">AI-에이전트-구축-패키지.zip</span>
              <button className="text-violet-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">LangGraph-에이전트-가이드.pdf</span>
              <button className="text-violet-600 font-black text-sm hover:underline">다운로드</button>
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

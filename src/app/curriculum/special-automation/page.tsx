'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Clock, LayoutGrid, Sparkles, X, Box, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SpecialAutomationPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
              <Zap size={14} className="animate-pulse" /> 단일주제과정 · Track D
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">자동화 파이프라인 (AI & Workflow Automation)</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              24시간 스스로 작동하는 업무 자동화 워크플로우를 완성합니다.<br />
              OpenAI, Midjourney, TTS API 및 n8n 스케줄러를 통합하여 완벽한 자동 생성 파이프라인을 구축하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-orange-600/20"
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
          
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-orange-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> 습득 역량
              </h3>
              <div className="bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-orange-500/20">
                SPECIALIST
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Zap size={12} />} label="n8n & Actions 자동화" desc="노드 기반 시나리오 통합 및 크론 워크플로우" />
                <OutcomeItem icon={<Sparkles size={12} />} label="AI 멀티미디어 파이프라인" desc="텍스트/이미지/오디오 자동 생성 및 결합" />
                <OutcomeItem icon={<Box size={12} />} label="스케줄 기반 스크래핑" desc="정기적 웹 데이터 크롤링 및 DB 동기화 설계" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-orange-600/5 dark:bg-orange-500/10 rounded-xl px-3 py-2 border border-orange-500/10">
                  <span className="text-[12px] font-bold text-orange-600/70 dark:text-orange-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">무인 비즈니스 생성 자동화 파이프라인 탑재</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-orange-500" />
                    단일 과정 (특강)
                  </span>
                  <span className="text-[12px] font-black text-orange-600 dark:text-orange-400">3시간 마스터</span>
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
                : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
            }`}
          >
            정규과정 (Step 1-4)
          </button>
          <button 
            onClick={() => handleCourseTypeChange('special')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              courseType === 'special' 
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-white/5' 
                : 'text-slate-700 dark:text-white'
            }`}
          >
            단일주제과정 (심화 트랙)
          </button>
        </div>

        {/* Roadmap Bar */}
        <div className="bg-card rounded-xl border border-border p-2 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar transition-colors relative z-20">
          <div className="flex items-center gap-2 px-4 whitespace-nowrap group cursor-pointer">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">단일주제 로드맵</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-100 dark:bg-white/10 mx-2" />
          <RoadmapItem label="A. 수익형 빌딩" href="/curriculum/special-saas" />
          <RoadmapArrow />
          <RoadmapItem label="B. 플랫폼 확장" href="/curriculum/special-platform" />
          <RoadmapArrow />
          <RoadmapItem label="C. OS & AI 인프라" href="/curriculum/special-infra" />
          <RoadmapArrow />
          <RoadmapItem label="D. 자동화 파이프라인" href="/curriculum/special-automation" active />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm transition-colors text-left">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-lg">👑</span> 마스터 클래스 가이드
              </h3>
              <div className="space-y-4">
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  n8n 워크플로우 엔진, OpenAI/Midjourney 등 주요 생성형 AI API 연동 가이드 및 자동 스크래핑 파이프라인 구축 기법을 배웁니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="n8n 노드 기반 워크플로우 설계" />
                  <BenefitItem text="OpenAI & 미드저니 API 자동 연계" />
                  <BenefitItem text="클라우드 스케줄러 스크래핑 제어" />
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
                    <span className="bg-orange-100 text-orange-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Automation & AI Pipeline Specialist</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">자동화 파이프라인 (AI & Workflow Automation)</h2>
                  <p className="text-orange-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "24시간 멈추지 않는 AI 에이전트와 무인 워크플로우 자동화 파이프라인 구축하기"
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div className="space-y-6 text-left">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">실습 구성 항목</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "n8n 자동화 시나리오 구축", desc: "트리거 수신 시 API를 호출하고 메일/슬랙 등으로 결과를 가공 및 전송하는 워크플로우 설계" },
                    { title: "OpenAI/TTS 생성 AI 연동", desc: "대량의 프롬프트를 AI API에 순차 전달하고 오디오 파일 및 이미지를 자동 생성/저장" },
                    { title: "크론(Cron) 스케줄링 및 수집", desc: "Cloudflare Workers Cron Trigger 및 GitHub Actions를 활용한 정기적 데이터 스크래핑 및 스토리지 보존" },
                    { title: "예외 처리 및 알림 채널 설계", desc: "파이프라인 동작 에러 발생 시 디스코드로 경보를 보내는 슬랙/디스코드 웹훅 알림 구축" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-orange-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparation Notice (Premium Card Design) */}
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Box className="w-8 h-8 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">상세 커리큘럼 준비 중</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    본 과정은 특강 신청자 분들을 위한 단일주제 집중 심화 세션입니다. 보다 상세한 회차별 진행 일자 및 상세 강의 스터디 실습 패키지는 마스터 세션 문의 및 상담을 통해 수령하실 수 있습니다.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleStartPractice}
                    className="px-8 py-3 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-500 transition-all text-sm shadow-lg shadow-orange-600/20"
                  >
                    가이드 자료 다운로드
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/special-infra">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-xs">
                    <ArrowRight className="w-4 h-4 rotate-180" /> C. OS & AI 인프라 단계로
                  </button>
                </Link>
                <Link href="/curriculum">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 text-xs">
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
      <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
      <CheckCircle2 className="w-3 h-3 text-orange-505 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
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
        active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
      }`}>
        <span className={`text-xs font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
      </div>
    </Link>
  );
}

function RoadmapArrow() {
  return <ArrowRight className="w-4 h-4 text-slate-200 shrink-0" />;
}

function GuideStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-black">
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
            <div className="bg-orange-600/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
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
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
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
          
          <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-orange-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">자동화-파이프라인 패키지.zip</span>
              <button className="text-orange-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">n8n-OpenAI-통합-가이드.pdf</span>
              <button className="text-orange-600 font-black text-sm hover:underline">다운로드</button>
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

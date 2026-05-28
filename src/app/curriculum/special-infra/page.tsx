'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Clock, LayoutGrid, Cpu, Sparkles, X, Box, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SpecialInfraPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Cpu size={14} className="animate-pulse" /> 특화과정 · Track C
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">OS & AI 인프라 (OS & Local AI)</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              데스크톱 앱 패키징 및 프라이빗 AI 인프라를 완전히 제어합니다.<br />
              인터넷 연결이 끊겨도 내 PC나 서버에서 직접 구동되는 로컬 AI 엔진을 지배하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-emerald-600/20"
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
          
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-emerald-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 습득 역량
              </h3>
              <div className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                SPECIALIST
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Cpu size={12} />} label="Tauri 데스크톱 앱" desc="Rust 기반 초경량 크로스플랫폼 앱 배포" />
                <OutcomeItem icon={<Zap size={12} />} label="Linux VPS & Docker" desc="Ubuntu 서버 가상화 및 백엔드 도커 라이징" />
                <OutcomeItem icon={<Box size={12} />} label="로컬 AI API 서버" desc="Ollama 및 vLLM 활용 프라이빗 LLM 서빙" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-emerald-600/5 dark:bg-emerald-500/10 rounded-xl px-3 py-2 border border-emerald-500/10">
                  <span className="text-[12px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">독립 인프라 & 로컬 AI 데스크톱 완성</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    교육시간
                  </span>
                  <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">6시간</span>
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
            <RoadmapItem label="C. OS & AI 인프라" href="/curriculum/special-infra" active />
            <RoadmapItem label="D. 자동화 파이프라인" href="/curriculum/special-automation" />
            <RoadmapItem label="E. AI 에이전트" href="/curriculum/special-agent" />
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
                  Tauri 데스크톱 빌드 가이드 및 Linux 가상 서버 배포와 로컬 AI 온프레미스 엔진 활용 능력을 습득합니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="Tauri 기반 초경량 데스크톱 앱 빌드" />
                  <BenefitItem text="Ubuntu VPS 서버 및 Docker 가속화" />
                  <BenefitItem text="Ollama API & 프라이빗 LLM 로드" />
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
                  <h4 className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">정규과정</h4>
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
                    <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">OS & Infrastructure Specialist</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">OS & AI 인프라 (OS & Local AI)</h2>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg leading-relaxed max-w-2xl">
                    "내 서비스만의 강력한 독립 데스크톱 패키징과 프라이빗 로컬 AI 두뇌 장착하기"
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div className="space-y-6 text-left">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">실습 구성 항목</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Tauri(Rust) 데스크톱 래핑", desc: "HTML/JS 웹 리소스를 저용량/초고속 데스크톱 바이너리(.exe, .dmg)로 패키징" },
                    { title: "Ubuntu Linux VPS & 보안 설정", desc: "해외 리눅스 가상 서버 인스턴스 생성, 방화벽 및 SSH 키 보안 셋업" },
                    { title: "Docker & Docker Compose 개발환경", desc: "여러 오픈소스 서버 엔진 및 데이터베이스를 Docker 컨테이너로 묶어 배포" },
                    { title: "Ollama & 로컬 AI 모델 API 연동", desc: "PC의 GPU 자원을 활용해 로컬 AI 모델을 가동하고 Next.js 백엔드와 스트리밍 연계" },
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

              {/* Detailed Curriculum Section */}
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" /> 상세 커리큘럼 (총 6시간)
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      session: "세션 1 (2시간)",
                      title: "Tauri 데스크톱 앱 빌드 및 OS 네이티브 제어",
                      details: [
                        "Next.js/React 웹 프로젝트 리소스를 Tauri(Rust 기반) 환경으로 포팅",
                        "OS 네이티브 바이너리 패키징 및 초경량 크로스플랫폼(.exe, .dmg) 빌드 설정",
                        "Tauri Command API를 통한 로컬 파일 시스템 탐색 및 OS 시스템 자원 제어"
                      ]
                    },
                    {
                      session: "세션 2 (2시간)",
                      title: "Ubuntu Linux VPS 구축 및 Docker 기반 서비스 배포",
                      details: [
                        "해외 클라우드 VPS(Virtual Private Server) 인스턴스 생성 및 Ubuntu 환경 셋업",
                        "서버 방화벽(UFW), SSH 키 인증 설정 및 보안 가이드라인 준수",
                        "다양한 웹 어플리케이션과 DB 서비스를 Docker 및 Docker Compose로 컨테이너화하여 일괄 가동"
                      ]
                    },
                    {
                      session: "세션 3 (2시간)",
                      title: "Ollama & 로컬 AI 모델 구축 및 API 연동",
                      details: [
                        "로컬 PC 및 서버의 GPU 자원을 가속화하는 Ollama/vLLM 엔진 설치",
                        "오픈소스 LLM(Llama, Mistral 등) 로드 및 파인튜닝 모델 독립 구동 환경 확보",
                        "로컬 AI API 서버를 Next.js 백엔드와 연결하고, 실시간 AI 답변 스트리밍(Streaming) 서비스 연동"
                      ]
                    }
                  ].map((curri, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded shrink-0 self-start sm:self-auto">{curri.session}</span>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white flex-1">{curri.title}</h4>
                      </div>
                      <ul className="space-y-1.5 pl-1.5">
                        {curri.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-[12px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1 shrink-0">•</span>
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
                      회차별 세부 소스코드와 템플릿 파일이 포함된 패키지를 다운로드할 수 있습니다.
                    </p>
                  </div>
                  <button
                    onClick={handleStartPractice}
                    className="px-6 py-2.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all text-xs shadow-md shadow-emerald-600/15 whitespace-nowrap"
                  >
                    가이드 자료 다운로드
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/special-platform">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-xs">
                    <ArrowRight className="w-4 h-4 rotate-180" /> B. 플랫폼 확장 단계로
                  </button>
                </Link>
                <Link href="/curriculum/special-automation">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 text-xs">
                    D. 자동화 파이프라인 (Automation) <ChevronRight className="w-4 h-4" />
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
      <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
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
        active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
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

function GuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Download Guide</div>
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
              className="w-full bg-emerald-650 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
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
          
          <div className="w-20 h-20 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-emerald-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">OS-AI-인프라 패키지.zip</span>
              <button className="text-emerald-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Tauri-데스크톱-가이드.pdf</span>
              <button className="text-emerald-600 font-black text-sm hover:underline">다운로드</button>
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

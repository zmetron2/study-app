'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, CheckCircle2, 
  PlayCircle, Clock, LayoutGrid, Smartphone, Sparkles, X, Box, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SpecialPlatformPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Smartphone size={14} className="animate-pulse" /> 단일주제과정 · Track B
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">플랫폼 확장 (Mobile & Extensions)</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              모바일 앱과 브라우저 확장 프로그램 생태계로 서비스를 성공적으로 확장합니다.<br />
              웹의 한계를 넘어 사용자 접점을 극대화하고 생태계의 문법을 지배하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="/contact"
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-blue-600/20"
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
          
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> 습득 역량
              </h3>
              <div className="bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-blue-500/20">
                SPECIALIST
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Smartphone size={12} />} label="하이브리드 앱 패키징" desc="Capacitor 및 React Native 환경 구축" />
                <OutcomeItem icon={<Zap size={12} />} label="크롬 확장 프로그램" desc="Chrome Extensions 백그라운드 자동화 개발" />
                <OutcomeItem icon={<Box size={12} />} label="디바이스 기능 연계" desc="푸시 알림 및 카메라/스토리지 연동" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between bg-blue-600/5 dark:bg-blue-500/10 rounded-xl px-3 py-2 border border-blue-500/10">
                  <span className="text-[12px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">하이브리드 모바일앱 & 확장프로그램 런칭</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-blue-500" />
                    교육시간
                  </span>
                  <span className="text-[12px] font-black text-blue-600 dark:text-blue-400">4시간</span>
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
            <RoadmapItem label="B. 플랫폼 확장" href="/curriculum/special-platform" active />
            <RoadmapItem label="C. OS & AI 인프라" href="/curriculum/special-infra" />
            <RoadmapItem label="D. 자동화 파이프라인" href="/curriculum/special-automation" />
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
                  모바일 환경 패키징 및 스토어 론칭 가이드와 크롬 브라우저 상의 강력한 확장 어플리케이션 제작 노하우를 습득합니다.
                </p>
                <div className="space-y-3">
                  <BenefitItem text="하이브리드 앱 스토어 패키징" />
                  <BenefitItem text="크롬 백그라운드 자동화" />
                  <BenefitItem text="스마트폰 네이티브 기능 연결" />
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
                  <h4 className="text-[12px] font-bold text-blue-600 dark:text-blue-400 mb-1">정규 심화과정</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    정규과정과 긴밀히 연계되어 있으며, 연계성을 고려해 중복되지 않는 핵심 고급 실무 커리큘럼이 특징입니다.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-white/5">
                  <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-350 mb-1">독립 특화과정</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    독립성 유지를 위해 최소한의 필수 기초 내용과 함께 구성되었으며, 특정 실무 목적을 달성하기 위한 전체 라이프사이클을 심도 있게 다룹니다.
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
                    <span className="bg-blue-100 text-blue-600 text-[12px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Mobile & Extension Specialist</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">플랫폼 확장 (Mobile & Extensions)</h2>
                  <p className="text-blue-600 font-bold text-lg leading-relaxed max-w-2xl">
                    "웹 브라우저를 넘어 전세계 스마트폰과 디스크 환경으로의 론칭"
                  </p>
                </div>
              </div>

              {/* Core Topics */}
              <div className="space-y-6 text-left">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">실습 구성 항목</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "WebView 기반 하이브리드 앱 제작", desc: "Capacitor 패키징 툴을 활용하여 기존 웹사이트를 10분 만에 앱 프로젝트로 래핑" },
                    { title: "푸시 알림(FCM) 및 모바일 네이티브 연동", desc: "Firebase Cloud Messaging과 스마트폰 OS 푸시 알림 수신 인터페이스 설계" },
                    { title: "Chrome Extension 자동화 빌드", desc: "Manifest V3 규격을 충족하는 백그라운드 스크립트 작성 및 돔 조작 크롬 확장앱 탑재" },
                    { title: "구글 플레이 & 앱스토어 심사 통과 가이드", desc: "검수 거부(Reject) 사례 분석 및 스토어 메타데이터 최적화 기법 제공" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all flex items-start gap-4 group">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparation Notice */}
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Box className="w-8 h-8 text-blue-500" />
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
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-600/20"
                  >
                    가이드 자료 다운로드
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border flex justify-between">
                <Link href="/curriculum/special-saas">
                  <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-xs">
                    <ArrowRight className="w-4 h-4 rotate-180" /> A. 수익형 빌딩 단계로
                  </button>
                </Link>
                <Link href="/curriculum/special-infra">
                  <button className="bg-slate-900 dark:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 text-xs">
                    C. OS & AI 인프라 (OS & Local AI) <ChevronRight className="w-4 h-4" />
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
      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover/item:scale-110 transition-transform">
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
      <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
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
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400'
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
              <GuideStep number="01" title="결제 및 강의 신청" desc="문의하기 또는 상담을 통해 강의를 신청하고 결제를 완료합니다." />
              <GuideStep number="02" title="로그인 정보 수령" desc="관리자로부터 강의 사이트 접속을 위한 전용 로그인 정보를 전달받습니다." />
              <GuideStep number="03" title="로그인 및 자료 확인" desc="전달받은 정보로 로그인 후, 각 커리큘럼 단계에서 실습 자료를 다운로드합니다." />
              <GuideStep number="04" title="바이브 코딩 실습" desc="제공된 자료와 AI 도구를 활용하여 실제 프로젝트 실습을 진행합니다." />
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
          
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">실습 자료 다운로드</h3>
            <p className="text-slate-500 dark:text-slate-400">강의 신청자 전용 실습 자료입니다. 아래 버튼을 눌러 다운로드 받으세요.</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">플랫폼 확장 패키지.zip</span>
              <button className="text-blue-600 font-black text-sm hover:underline">다운로드</button>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">WebView-Native 브릿지 가이드.pdf</span>
              <button className="text-blue-600 font-black text-sm hover:underline">다운로드</button>
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

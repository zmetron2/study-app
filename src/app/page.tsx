'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Rocket, 
  Leaf, Code2, Star, Lock, ListTodo, Upload, Moon, 
  FileText, Globe, Box, Image as ImageIcon, Info, Compass, Map, Terminal, BookOpen,
  ChevronLeft, ChevronRight, Zap, X, MessageSquare, Database, Crown
} from 'lucide-react';

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  const practiceHighlights = [
    {
      icon: <Lock size={20} />,
      title: '로그인 기능 만들기',
      tag: '인기',
      tagColor: 'bg-yellow-400/20 text-yellow-600',
      desc: '로그인/회원가입 기능을 구현해보세요.',
      color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
    },
    {
      icon: <ListTodo size={20} />,
      title: '게시판 CRUD',
      tag: '데이터',
      tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      desc: '게시글 목록, 작성, 수정, 삭제 기능을 구현해보세요.',
      color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
    },
    {
      icon: <Upload size={20} />,
      title: '파일 업로드',
      tag: '파일',
      tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      desc: '파일 업로드 및 미리보기 기능을 구현해보세요.',
      color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
    },
    {
      icon: <Moon size={20} />,
      title: '다크모드 구현',
      tag: 'UI/UX',
      tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      desc: '다크모드 전환 기능을 구현해보세요.',
      color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % practiceHighlights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [practiceHighlights.length]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % practiceHighlights.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + practiceHighlights.length) % practiceHighlights.length);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col font-sans relative">
      <PromotionPopup show={showPopup} onClose={() => setShowPopup(false)} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 py-20 lg:py-32 border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left">
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                엘쯔의 바이브코딩<br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                  직접 만들며 배우는 실전 학습
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl opacity-70 mb-12 leading-relaxed max-w-2xl">
                단순한 이론 공부를 넘어 실무에 바로 쓰이는 바이브코딩에 필요한 모든 지식을 공유합니다. 
                함께 성장하는 바이브 코딩 스터디 공간입니다.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/curriculum" className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5">
                  <BookOpen size={20} />
                  커리큘럼 둘러보기
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/practice" className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-border px-8 py-4 rounded-xl font-bold text-lg hover:border-primary transition-all hover:-translate-y-0.5">
                  <Terminal size={20} className="text-primary" />
                  기능 실습 보러가기
                </Link>
              </div>
            </div>

            {/* Right: Coding Widget */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none perspective-1000">
              <CodingWidget />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
        {/* 콘텐츠 영역 유지 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 커리큘럼 로드맵 */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">커리큘럼 로드맵</h2>
              <Link href="/curriculum" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                전체 커리큘럼 보기 <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-between items-start gap-4 relative py-2">
              <Link href="/curriculum" className="flex flex-col items-center text-center gap-3 flex-1 min-w-[90px] group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <div className="font-bold text-[13px] text-indigo-600 dark:text-indigo-400 mb-0.5">입문</div>
                  <div className="text-[12px] opacity-60 leading-tight">AI 바이브 잡기<br/>프롬프트 & 마인드셋</div>
                </div>
              </Link>

              <div className="hidden sm:flex items-center pt-6 opacity-20 flex-1 justify-center">
                <div className="border-t-2 border-dotted border-slate-400 w-full"></div>
              </div>

              <Link href="/curriculum/basic" className="flex flex-col items-center text-center gap-3 flex-1 min-w-[90px] group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Database size={24} />
                </div>
                <div>
                  <div className="font-bold text-[13px] text-blue-600 dark:text-blue-400 mb-0.5">기초</div>
                  <div className="text-[12px] opacity-60 leading-tight">시스템 구조 이해<br/>도메인 & DNS 설정</div>
                </div>
              </Link>

              <div className="hidden sm:flex items-center pt-6 opacity-20 flex-1 justify-center">
                <div className="border-t-2 border-dotted border-slate-400 w-full"></div>
              </div>

              <Link href="/curriculum/practice" className="flex flex-col items-center text-center gap-3 flex-1 min-w-[90px] group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Rocket size={24} />
                </div>
                <div>
                  <div className="font-bold text-[13px] text-emerald-600 dark:text-emerald-400 mb-0.5">실전</div>
                  <div className="text-[12px] opacity-60 leading-tight">프로젝트 빌딩<br/>SaaS & 자동화 실습</div>
                </div>
              </Link>

              <div className="hidden sm:flex items-center pt-6 opacity-20 flex-1 justify-center">
                <div className="border-t-2 border-dotted border-slate-400 w-full"></div>
              </div>

              <Link href="/curriculum/advanced" className="flex flex-col items-center text-center gap-3 flex-1 min-w-[90px] group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Crown size={24} />
                </div>
                <div>
                  <div className="font-bold text-[13px] text-purple-600 dark:text-purple-400 mb-0.5">심화</div>
                  <div className="text-[12px] opacity-60 leading-tight">비즈니스 스케일업<br/>수익화 & 글로벌 배포</div>
                </div>
              </Link>
            </div>
          </div>

          {/* 기능 실습 하이라이트 (슬라이더 적용) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative overflow-hidden group/slider">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">기능 실습 하이라이트</h2>
              <Link href="/practice" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                전체 실습 보기 <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="relative flex-1 flex flex-col justify-center">
              {/* 슬라이드 컨텐츠 */}
              <div className="w-full overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {practiceHighlights.map((item, idx) => (
                    <div key={idx} className="min-w-full px-1">
                      <Link href="/practice" className="group/card flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                        <div className={`w-12 h-12 shrink-0 rounded-2xl ${item.color} flex items-center justify-center group-hover/card:scale-110 transition-transform shadow-sm`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-black flex items-center gap-2 mb-1 mt-1.5">
                            <span className="truncate">{item.title}</span> 
                            <span className={`text-[12px] ${item.tagColor} px-1.5 pt-1 pb-[3px] rounded-[4px] font-bold shrink-0 leading-none`}>{item.tag}</span>
                          </div>
                          <p className="text-[12px] opacity-60 leading-tight line-clamp-1 mb-2">{item.desc}</p>
                          <div className="flex items-center text-[12px] font-bold text-primary opacity-0 group-hover/card:opacity-100 transition-opacity">
                            실습 시작하기 <ArrowRight size={12} className="ml-1" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* 내비게이션 버튼 */}
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-border flex items-center justify-center z-10 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all"
                aria-label="이전 슬라이드"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-border flex items-center justify-center z-10 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all"
                aria-label="다음 슬라이드"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* 인디케이터 */}
            <div className="flex justify-center gap-2 mt-6">
              {practiceHighlights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === idx ? 'w-6 bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label={`${idx + 1}번 슬라이드로 이동`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">최신 스터디 기록</h2>
              <Link href="/curriculum" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                전체 보기 <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="flex flex-col">
              {[
                { title: '5회차 - 상태관리 실습', tag: '기초', date: `${currentYear}.05.20` },
                { title: '4회차 - API 연결하기', tag: '기초', date: `${currentYear}.05.18` },
                { title: '3회차 - 비동기 처리 이해', tag: '기초', date: `${currentYear}.05.15` },
                { title: '2회차 - JavaScript 기본 문법', tag: '입문', date: `${currentYear}.05.12` },
                { title: '1회차 - 개발 환경 설정', tag: '입문', date: `${currentYear}.05.10` },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{item.tag}</span>
                    <span className="text-[12px] opacity-40 font-mono">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">자료실 하이라이트</h2>
              <Link href="/resources" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                전체 자료 보기 <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 shadow-sm">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">유용한 웹사이트 모음</div>
                  <div className="text-[12px] opacity-50">개발에 도움이 되는 사이트들을 모아봤어요.</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                  <Box size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">AI 개발 도구 모음</div>
                  <div className="text-[12px] opacity-50">바이브 코딩에 활용하기 좋은 AI 도구들</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                  <ImageIcon size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">디자인 리소스 모음</div>
                  <div className="text-[12px] opacity-50">프로젝트에 활용할 수 있는 디자인 리소스</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">기본 가이드</h2>
              <Link href="/guide" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                전체 가이드 보기 <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <Link href="/guide" className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">바이브 코딩이란?</div>
                  <div className="text-[12px] opacity-50">바이브 코딩의 개념과 장점을 알아보세요.</div>
                </div>
              </Link>

              <Link href="/guide" className="flex items-center gap-4 p-4 rounded-xl bg-teal-50 dark:bg-teal-500/10 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-teal-500 shadow-sm">
                  <Compass size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">어떻게 공부해야 할까?</div>
                  <div className="text-[12px] opacity-50">효과적인 학습 방법과 로드맵을 안내해드려요.</div>
                </div>
              </Link>

              <Link href="/guide" className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm">
                  <Map size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">추천 학습 순서</div>
                  <div className="text-[12px] opacity-50">초보자를 위한 단계별 학습 순서를 제안해요.</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 팝업 컴포넌트
function PromotionPopup({ show, onClose }: { show: boolean, onClose: () => void }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-[32px] overflow-hidden shadow-2xl border border-border animate-in zoom-in-95 duration-300">
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex bg-white/20 px-3 py-1 rounded-full text-[12px] font-black tracking-widest uppercase">Special Event</div>
            <h3 className="text-3xl font-black leading-tight">오프라인 특강<br />전격 오픈!</h3>
          </div>
          <Zap className="absolute bottom-[-10px] right-4 w-24 h-24 text-white/10" />
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-black text-slate-800 dark:text-white">AI를 &apos;지시하는 방법&apos;을 배우세요.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              코드 한 줄 몰라도 상상을 현실로 만드는 비결,<br />
              바이브 코딩 오프라인 특강에서 공개합니다.
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">한정 기간 혜택</p>
              <p className="text-xl font-black text-primary">특가 129,000원</p>
            </div>
            <Link 
              href="/special-lecture" 
              onClick={onClose}
              className="bg-primary text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all"
            >
              상세보기
            </Link>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            다음에 볼게요
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

// 코딩 위젯 컴포넌트
function CodingWidget() {
  const [code, setCode] = useState('');
  const fullCode = `// AI와 함께하는 바이브 코딩
function startProject() {
  const goal = "상상을 현실로";
  const tool = "AI Instruction";
  
  if (isVibeCoding(goal)) {
    return launch("🚀 " + goal);
  }
}

// 1. AI에게 지시하기
// 2. 결과물 확인하기
// 3. 바로 배포하기`;

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (index <= fullCode.length) {
        setCode(fullCode.slice(0, index));
        index++;
        timeoutId = setTimeout(type, 50);
      } else {
        // Pause at the end before restarting
        timeoutId = setTimeout(() => {
          index = 0;
          setCode('');
          type();
        }, 3000);
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
        {/* Window Header */}
        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <div className="text-[12px] font-mono text-slate-500 font-bold uppercase tracking-widest">vibe_coding.js</div>
          <div className="w-10"></div>
        </div>
        
        {/* Code Content */}
        <div className="p-6 h-[320px] font-mono text-[13px] leading-relaxed overflow-hidden">
          <pre className="text-slate-300">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-4 text-slate-600 text-right select-none">{i + 1}</span>
                <span className="flex-1 whitespace-pre-wrap break-all">
                  {line.split(/(\/\/.*|".*"|function|const|if|return|launch)/).map((part, j) => {
                    if (part.startsWith('//')) return <span key={j} className="text-slate-500 italic">{part}</span>;
                    if (part.startsWith('"')) return <span key={j} className="text-teal-400">{part}</span>;
                    if (['function', 'const', 'if', 'return'].includes(part)) return <span key={j} className="text-purple-400 font-bold">{part}</span>;
                    if (part === 'launch') return <span key={j} className="text-blue-400 font-bold">{part}</span>;
                    return <span key={j}>{part}</span>;
                  })}
                  {i === code.split('\n').length - 1 && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-800/30 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[12px] font-bold text-slate-500">
          <div className="flex gap-4">
            <span>UTF-8</span>
            <span>JavaScript</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Connected to AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

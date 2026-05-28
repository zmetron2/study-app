'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, Check, CheckCircle2, 
  Users, User, BookOpen, Calculator, Info, HelpCircle, Sparkles, TrendingUp
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  description: string;
  stagePrice: number; // Price per stage in Korean Manwon
  features: string[];
  recommendation: string;
  colorClass: string;
  bgGradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLANS: PricingPlan[] = [
  {
    id: 'general',
    name: '일반 과정',
    badge: '일반 모집',
    description: '10인 이하 정원으로 강의실을 대실하여 타 교육생들과 함께 자극과 응원을 함께 받으면 실전 AI 코딩 역량을 키웁니다.',
    stagePrice: 12,
    features: [
      '무료호스팅 계정 한 달 무료제공',
      '단계별 밀착 온라인/오프라인 피드백',
      '수강생 간 코드 리뷰 및 협업 시너지',
      '바이브코딩 전용 자료실 평생 이용권',
      '실습 성취도 관리 및 트래커 시스템 제공'
    ],
    recommendation: '비용 부담을 최소화하면서 체계적인 동료 학습 효과를 누리고 싶은 분께 적극 추천합니다.',
    colorClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5',
    bgGradient: 'from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950/10 dark:via-slate-900/40 dark:to-teal-950/10',
    icon: BookOpen
  },
  {
    id: 'group',
    name: '그룹(2~3명) 신청',
    badge: '1/N 분할 납부로 가장 저렴!',
    description: '동료, 지인, 혹은 팀원(2~3인)과 함께 신청하여 교육비용을 인원수로 나누어 내는 과정입니다. 3인이 함께 신청할 경우 인당 비용이 약 9.3만 원이 되어 일반 과정(12만 원)보다 더 저렴하게 1:1 수준의 개별 맞춤 지도를 받을 수 있으므로, 가장 저렴한 실속형 소수 정예 코스입니다.',
    stagePrice: 28,
    features: [
      '무료호스팅 계정 한 달 무료제공',
      '소수정예 2~3인 밀착 맞춤형 진도 설계',
      '비즈니스 아이디어/프로덕트 최적화 컨설팅',
      '팀원 간의 깃허브(GitHub) 협업 파이프라인 구축',
      '유연한 시간 일정 조율 및 상시 질의응답 피드백'
    ],
    recommendation: '2~3명이 수강료(단계별 28만 원)를 균등하게 나누어 내기 때문에, 인원이 많아질수록 인당 비용이 비약적으로 낮아져 3인 신청 시 인당 약 9.3만 원으로 전체 교육 과정 중 가장 저렴하게 수강하실 수 있습니다.',
    colorClass: 'text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5',
    bgGradient: 'from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950/10 dark:via-slate-900/40 dark:to-purple-950/10',
    icon: Users
  },
  {
    id: 'mentoring',
    name: '1:1 멘토링',
    badge: '프리미엄 1:1 과외',
    description: '멘토의 100% 집중 지도를 받으며 개인 역량과 목적에 맞게 초고속으로 성장하는 독보적인 학습 코스입니다.',
    stagePrice: 28,
    features: [
      '무료호스팅 계정 한 달 무료제공',
      '1:1 맞춤 수준별 최적화 커리큘럼 설계',
      '막히는 에러 및 코드 문제 즉각 원격/오프라인 트러블슈팅',
      '개인 맞춤형 포트폴리오 및 현업 최적 기술 스택 컨설팅',
      '바이브코딩 마스터의 실시간 1:1 코드 다이렉트 케어'
    ],
    recommendation: '나만의 진도로 최단 기간 내에 고성능 AI 기반 웹 서비스를 출시하거나 확실한 역량을 확보하려는 분께 강력 추천합니다.',
    colorClass: 'text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5',
    bgGradient: 'from-amber-50 via-slate-50 to-yellow-50 dark:from-amber-950/10 dark:via-slate-900/40 dark:to-yellow-950/10',
    icon: User
  }
];

const STAGES = [
  { id: 'intro', name: '입문', desc: '바이브코딩을 이해하고 내가 원하는 디자인과 웹사이트를 만들수 있게 됩니다.' },
  { id: 'practice', name: '실전', desc: '국내호스팅 환경에서 필요한 실무 웹사이트의 대부분을 기능을 만들수 있습니다.' },
  { id: 'expansion', name: '확장', desc: '해외호스팅을 활용하여 서버리스 웹서비스를 만들 수 있습니다.' },
  { id: 'advanced', name: '심화/특화', desc: '서버 인프라 구축, n8n 자동화 및 AI 에이전트 마스터' }
];

export default function PricingPage() {
  const [activePlanId, setActivePlanId] = useState<string>('general');
  const [selectedStages, setSelectedStages] = useState<string[]>(['intro', 'practice']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activePlan = PLANS.find(p => p.id === activePlanId) || PLANS[0];

  const handleStageToggle = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(s => s !== stageId) 
        : [...prev, stageId]
    );
  };

  const calculateTotalPrice = () => {
    return selectedStages.length * activePlan.stagePrice;
  };

  const getPackageDiscount = () => {
    // 4단계 모두 선택 시 패키지 특별 혜택
    if (selectedStages.length === 4) {
      if (activePlanId === 'general') return { original: 48, discounted: 39, discount: 9 };
      if (activePlanId === 'group') return { original: 112, discounted: 89, discount: 23 };
      if (activePlanId === 'mentoring') return { original: 112, discounted: 89, discount: 23 };
    }
    return null;
  };

  const packageInfo = getPackageDiscount();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Header Area --- */}
      <header className="py-20 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0b0f1a] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Pricing Plans
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            교육비용 안내
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            나에게 딱 맞는 학습 환경과 수강 형태를 찾고 <br className="hidden sm:block" />
            AI 바이브코딩 입문에서 마스터까지 합리적인 요금으로 함께해 보세요.
          </p>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        
        {/* Section 1: 3-Card Detailed Pricing Overview */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">수강 형태별 맞춤 요금 플랜</h2>
            <p className="text-sm text-slate-400 font-medium">학습 인원과 집중 케어 수준에 따른 세 가지 옵션을 제안합니다.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <div 
                  key={plan.id} 
                  className={`group bg-white dark:bg-slate-900 border ${
                    activePlanId === plan.id 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                      : 'border-slate-200 dark:border-white/5 shadow-sm'
                  } rounded-3xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col relative overflow-hidden`}
                >
                  {/* Active Badge */}
                  {activePlanId === plan.id && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                      Selected Plan
                    </div>
                  )}

                  <div className="space-y-6 flex-1">
                    {/* Header */}
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${plan.colorClass}`}>
                        {plan.badge}
                      </span>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                        <Icon className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" />
                        {plan.name}
                      </h3>
                      <p className="text-[13px] text-slate-400 leading-relaxed font-medium mt-1">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="py-6 border-y border-slate-100 dark:border-white/5 space-y-1">
                      <div className="text-slate-400 text-xs font-bold">수강료 (단계별/회당 기준)</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{plan.stagePrice}</span>
                        <span className="text-xl font-black text-indigo-600">만 원</span>
                        <span className="text-[11px] text-slate-400 font-bold ml-2">/ 1단계(코스)당</span>
                      </div>
                    </div>

                    {/* Core Features */}
                    <div className="space-y-4">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest">수강 특징</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-normal">
                            <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendation and CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                    <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">
                      💡 {plan.recommendation}
                    </p>
                    
                    <button 
                      onClick={() => setActivePlanId(plan.id)}
                      className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border ${
                        activePlanId === plan.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10 hover:bg-indigo-500'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {activePlanId === plan.id ? '선택되었습니다' : '이 플랜 상세 시뮬레이션'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Interactive Smart Calculator */}
        <section className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-white/5 rounded-3xl p-8 md:p-12 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/50 dark:border-white/5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Calculator className="w-3.5 h-3.5" /> Interactive Calculator
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">수강료 실시간 모의 계산</h3>
              <p className="text-xs md:text-sm text-slate-400 font-bold">수강 방식과 희망 학습 단계를 조합하여 나만의 최적 플랜 요금을 계산해 보세요.</p>
            </div>
            
            {/* Study Type Select Trigger */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlanId(p.id)}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${
                    activePlanId === p.id 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-white/5 hover:border-indigo-200'
                  }`}
                >
                  {p.name.split(' ')[0]} {/* Only show first word for simplicity */}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Step selection */}
            <div className="lg:col-span-7 space-y-6">
              <label className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest px-1">
                희망 수강 단계 선택 (다중 선택 가능)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STAGES.map((stage, idx) => {
                  const isChecked = selectedStages.includes(stage.id);
                  return (
                    <div 
                      key={stage.id}
                      onClick={() => handleStageToggle(stage.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none ${
                        isChecked 
                          ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md shadow-indigo-500/5' 
                          : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-white/10'
                      }`}>
                        {isChecked && <Check size={12} className="stroke-[3]" />}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">STAGE 0{idx+1}</span>
                          <h4 className="text-sm font-black text-slate-800 dark:text-white">{stage.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Package Banner Option */}
              <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-black text-slate-800 dark:text-white">마스터 올인원 패키지 혜택</p>
                    <p className="text-[11px] text-slate-400 font-bold">1~4단계 전체 동시 선택 시 역대급 패키지 할인이 즉시 자동 적용됩니다!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStages(STAGES.map(s => s.id))}
                  className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-lg transition-colors shrink-0"
                >
                  전체 선택
                </button>
              </div>
            </div>

            {/* Right: Calculated Price Summary Box */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">선택된 수강 플랜</p>
                  <h4 className="text-base font-black text-slate-800 dark:text-white">{activePlan.name}</h4>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">선택 단계 목록</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStages.length === 0 ? (
                      <span className="text-xs font-bold text-slate-400">단계를 선택해 주세요</span>
                    ) : (
                      selectedStages.map(stageId => {
                        const s = STAGES.find(stage => stage.id === stageId);
                        return (
                          <span key={stageId} className="px-2.5 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px] font-black text-slate-500 rounded-lg">
                            {s?.name}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Pricing result block */}
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                  {packageInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>정상가 (4개 단계 합산)</span>
                        <span className="line-through">{packageInfo.original}만 원</span>
                      </div>
                      
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-2xl flex items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-600">패키지 할인 혜택</span>
                        <span className="text-xs font-black text-emerald-600">-{packageInfo.discount}만 원 절약</span>
                      </div>

                      <div className="flex items-baseline justify-between pt-2">
                        <span className="text-sm font-black text-slate-800 dark:text-white">최종 패키지가</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{packageInfo.discounted}</span>
                          <span className="text-base font-black text-emerald-600">만 원</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-slate-800 dark:text-white">합계 금액</span>
                      {selectedStages.length === 0 ? (
                        <span className="text-xl font-black text-slate-300">0 만 원</span>
                      ) : (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{calculateTotalPrice()}</span>
                          <span className="text-base font-black text-indigo-600">만 원</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <Link 
                  href={{
                    pathname: '/contact',
                    query: { course: activePlan.name }
                  }}
                  className={`w-full py-4.5 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group/btn shadow-lg ${
                    selectedStages.length === 0 ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  이 조건으로 교육 신청하기 
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Core Pricing Matrix (Requested Table) */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">수강 형태 & 단계별 비용 매트릭스</h2>
            <p className="text-sm text-slate-400 font-medium">전체 비용 구성을 한눈에 보여드리는 투명한 요금표입니다.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-sm text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-slate-500">
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[11px] border-b border-slate-200/50 dark:border-white/5">수강 형태</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-[11px] border-b border-slate-200/50 dark:border-white/5">STAGE 01. 입문</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-[11px] border-b border-slate-200/50 dark:border-white/5">STAGE 02. 실전</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-[11px] border-b border-slate-200/50 dark:border-white/5">STAGE 03. 확장</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-[11px] border-b border-slate-200/50 dark:border-white/5">STAGE 04. 심화/특화</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200">
                    일반 과정
                    <span className="block text-[11px] text-slate-400 font-bold mt-1 font-sans">10인 이하 정원 강의실 대실 스터디</span>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">12만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">12만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">12만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">12만 원</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200">
                    그룹(2~3명) 신청
                    <span className="block text-[11px] text-slate-400 font-bold mt-1 font-sans">비용 1/N 분할 납부 (3인 신청 시 인당 9.3만 원으로 가장 저렴!)</span>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200">
                    1:1 멘토링
                    <span className="block text-[11px] text-slate-400 font-bold mt-1 font-sans">100% 나만의 진도 밀착 프라이빗 코치</span>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                  <td className="px-6 py-6 font-black text-slate-900 dark:text-white text-base">28만 원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex gap-3.5">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[12px] font-black text-slate-700 dark:text-slate-300">꼭 확인해 주세요!</p>
              <ul className="text-[11px] text-slate-400 font-medium space-y-1 list-disc pl-4 leading-relaxed">
                <li>과외 및 그룹 신청은 교육 정원이 모집되어 확정된 후, 상세 일정을 조율하여 시작됩니다.</li>
                <li>일반 과정은 수강 신청 후 공식 모집 정원(최대 10인)이 차면 즉시 개강 일정이 발표됩니다.</li>
                <li>결제 및 영수증 발행 방식은 수강 신청 후 멘토의 개별 연락을 통해 안내해 드립니다.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Premium QA Block */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">수강료에 대해 자주 묻는 질문</h2>
            <p className="text-sm text-slate-400 font-medium">교육 비용에 관해 가장 자주 문의하시는 내용을 정리했습니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl space-y-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-black">Q</span>
                단계별 수강을 순서대로만 신청해야 하나요?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-8">
                아닙니다! 본인의 현재 역량에 따라 필요한 단계를 선택적으로 신청할 수 있습니다. 다만, 비전공자나 초보자분의 경우 `입문` 단계부터 차례로 학습하시는 것이 교육 성과 극대화에 가장 효과적입니다.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl space-y-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-black">Q</span>
                여러 명이 동반 등록하면 어떤 혜택이 있나요?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-8">
                2~3명이 함께 '그룹 신청'을 하시면 단계별 수강료(28만 원)를 인원수로 나누어 납부(1/N)하기 때문에 가장 저렴하게 수강하실 수 있습니다. 예를 들어 3인이 함께 신청할 경우 인당 약 9.3만 원 수준이 되어, 일반 과정(12만 원)보다 더 저렴한 가격으로 1:1 과외 수준의 프리미엄 맞춤 교육을 제공받으실 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Bottom CTA */}
        <section className="bg-slate-900 dark:bg-white/5 rounded-[2.5rem] p-10 md:p-16 text-white text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
          
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              지금 바이브코딩의 <br className="sm:hidden" /> 주인공이 되어 보세요!
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              교육비용과 관련해 별도의 특수 조율(기업 맞춤형 출강, 정기 단체 위탁 교육 등)이 필요하시다면 언제든지 간편 문의를 남겨주세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-8 h-14 inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              간편 교육 신청하기
            </Link>
            <Link 
              href="/contact?tab=inquiry" 
              className="w-full sm:w-auto px-8 h-14 inline-flex items-center justify-center bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-black text-sm transition-all border border-slate-700 hover:border-slate-600"
            >
              상세 교육 문의하기
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

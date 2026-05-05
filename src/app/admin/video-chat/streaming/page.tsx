'use client';

import React from 'react';
import { Radio, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StreamingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-rose-500/30">
          <Radio size={48} className="animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white tracking-tighter">1인 라이브 스트리밍</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            스트리밍 모드는 현재 개발 중인 기능입니다.<br />
            Agora Interactive Live Streaming 기술을 적용하여<br />
            다수의 교육생에게 실시간 강의를 제공할 예정입니다.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Coming Soon</h3>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            화면 공유, 실시간 채팅, 시청자 통계 기능을 포함한<br />
            통합 온라인 강의 솔루션을 준비 중입니다.
          </p>
        </div>

        <Link 
          href="/admin"
          className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

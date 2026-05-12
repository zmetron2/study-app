'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  // Fix hydration error by using a static year or mounting check
  const [year, setYear] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="footer-brand">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4 hover:text-primary transition-colors text-foreground">
              <Logo size={22} />
              <span>엘쯔의 바이브코딩</span>
            </Link>
            <p className="text-sm opacity-60 leading-relaxed max-w-sm text-foreground">
              UX디자인, 퍼블리싱, 프런트엔드 개발 지식을 공유하고<br />
              함께 성장하는 바이브 코딩 스터디 공간입니다.
            </p>
            {mounted && process.env.NEXT_PUBLIC_BUILD_TIME && (
              <div className="mt-4 text-[11px] font-normal opacity-30 text-foreground/50 font-sans tracking-tight">
                Last updated: {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
            )}
          </div>

          <div className="flex gap-16 md:justify-end">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2 text-foreground">사이트</h4>
              <Link href="/curriculum" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">커리큘럼</Link>
              <Link href="/practice" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">기능실습</Link>
              <Link href="/resources" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">자료실</Link>
              <Link href="/guide" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">사전학습</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2 text-foreground">지원</h4>
              <Link href="/faq" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">자주하는 질문</Link>
              <Link href="/contact" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">교육신청/문의</Link>
              <Link href="/terms" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">이용약관</Link>
              <Link href="/privacy" className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all text-foreground">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs opacity-40 font-medium text-foreground">© {year} 엘쯔의 바이브코딩. All rights reserved.</p>
          <button
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-border shadow-sm flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="맨 위로"
            id="scroll-to-top"
          >
            <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}

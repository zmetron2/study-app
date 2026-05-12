'use client';

import React, { useState } from 'react';
import { 
  Code2, ArrowRight, 
  BookOpen, 
  Users, ShieldCheck,
  Mail, MessageSquare, Send,
  CheckCircle2, Clock, Phone, Smartphone, Check
} from 'lucide-react';

export default function ContactPage() {
  const [responseType, setResponseType] = useState<'sms' | 'phone' | 'email'>('sms');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ type: '교육 문의', name: '', title: '', contact: '', message: '' });

  const handleSubmit = async () => {
    if (!formData.name || !formData.title || !formData.contact || !formData.message) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        title: formData.title,
        category: formData.type,
        // 이메일 답변 선택 시에만 email 필드 전송, 아니면 null
        email: responseType === 'email' ? formData.contact : null,
        // 문자/전화 선택 시에만 phone 필드 전송
        phone: responseType !== 'email' ? formData.contact : null,
        // 답변 유형 정보를 본문 앞에 태그로 추가
        message: `[답변: ${responseType === 'sms' ? '문자' : responseType === 'phone' ? '전화' : '이메일'}]\n\n${formData.message}`
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        setShowSuccessModal(true);
        setFormData({ type: '교육 문의', name: '', title: '', contact: '', message: '' });
        setIsAgreed(false);
      } else {
        alert('접수 중 오류가 발생했습니다: ' + data.message);
      }
    } catch (e) {
      alert('접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- Header Area --- */}
      <header className="bg-slate-50 dark:bg-[#0b0f1a] text-slate-900 dark:text-white py-20 relative overflow-hidden transition-colors border-b border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="space-y-6 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
              <MessageSquare className="w-3 h-3" /> Contact Us
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              무엇이든 <span className="text-indigo-600">물어보세요</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed text-sm md:text-base font-medium">
              강의, 프로젝트 협업, 시스템 구축 등 궁금하신 점을 남겨주세요.<br />
              전문 상담사가 확인 후 빠르게 답변해 드립니다.
            </p>
          </div>
          
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 w-72 h-72 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl shadow-indigo-500/10 transition-colors">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Smartphone className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Live Inquiry</p>
                <p className="text-base font-black text-slate-800 dark:text-white">빠른 답변을<br/>약속드립니다</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Inquiry Form */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">상세 문의 내용</h2>
              <p className="text-sm text-slate-500 font-medium italic">필수 항목은 반드시 입력해 주시기 바랍니다.</p>
            </div>

            <form className="space-y-10 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5 p-8 md:p-12 shadow-xl shadow-indigo-500/5">
              {/* Type Selection */}
              <div className="space-y-6">
                <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 유형 <span className="text-indigo-600">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TypeButton icon={BookOpen} label="교육 문의" active={formData.type === '교육 문의'} onClick={() => setFormData({...formData, type: '교육 문의'})} />
                  <TypeButton icon={Code2} label="프로젝트 제안" active={formData.type === '프로젝트 제안'} onClick={() => setFormData({...formData, type: '프로젝트 제안'})} />
                  <TypeButton icon={Users} label="채용/제휴" active={formData.type === '채용/제휴'} onClick={() => setFormData({...formData, type: '채용/제휴'})} />
                  <TypeButton icon={MessageSquare} label="기타 문의" active={formData.type === '기타 문의'} onClick={() => setFormData({...formData, type: '기타 문의'})} />
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">성함/기업명 <span className="text-indigo-600">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="성함을 입력해 주세요" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 제목 <span className="text-indigo-600">*</span></label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="제목을 입력해 주세요" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
                </div>
              </div>

              {/* Response Method Selection */}
              <div className="space-y-6">
                <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">답변받으실 방법 <span className="text-indigo-600">*</span></label>
                <div className="flex flex-wrap gap-4">
                  <ResponseOption icon={Smartphone} label="문자 답변" active={responseType === 'sms'} onClick={() => {setResponseType('sms'); setFormData({...formData, contact: ''})}} />
                  <ResponseOption icon={Phone} label="전화 상담" active={responseType === 'phone'} onClick={() => {setResponseType('phone'); setFormData({...formData, contact: ''})}} />
                  <ResponseOption icon={Mail} label="이메일 답변" active={responseType === 'email'} onClick={() => {setResponseType('email'); setFormData({...formData, contact: ''})}} />
                </div>
              </div>

              {/* Conditional Input based on Response Method */}
              <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                {responseType === 'email' ? (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">이메일 주소 <span className="text-indigo-600">*</span></label>
                    <input type="email" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="example@email.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">연락처 <span className="text-indigo-600">*</span></label>
                    <input type="tel" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="010-0000-0000" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 내용 <span className="text-indigo-600">*</span></label>
                <textarea rows={8} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="내용을 상세히 입력해 주시면 더욱 정확한 답변이 가능합니다." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none"></textarea>
              </div>

              {/* Agreement */}
              <div className="flex items-center gap-3 p-5 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-white/5">
                <div onClick={() => setIsAgreed(!isAgreed)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isAgreed ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800'}`}>
                  {isAgreed && <Check className="w-4 h-4" />}
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-2">
                  <span onClick={() => setIsAgreed(!isAgreed)} className="cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors">
                    개인정보 수집 및 이용에 동의합니다 
                  </span>
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black underline decoration-indigo-200 underline-offset-4 hover:text-indigo-500 transition-colors">
                    (상세보기)
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={!isAgreed || isSubmitting}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-2xl ${isAgreed && !isSubmitting ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-indigo-600/40 active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'}`}
              >
                {isSubmitting ? '제출 중...' : isAgreed ? '상담 신청하기' : '개인정보 동의가 필요합니다'} <Send className={`w-5 h-5 ${isAgreed ? '' : 'opacity-20'}`} />
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <aside className="lg:w-80 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase border-b border-slate-100 dark:border-white/5 pb-4 px-1">Info</h3>
              <div className="space-y-8">
                <InfoItem icon={Clock} title="24시간 내 답변" desc="영업일 기준 24시간 이내에 전문 상담사가 배정됩니다." />
                <InfoItem icon={CheckCircle2} title="1:1 맞춤 상담" desc="단순 정보 전달을 넘어 최적의 해결책을 제시해 드립니다." />
                <InfoItem icon={ShieldCheck} title="개인정보 보안" desc="입력하신 정보는 상담 목적으로만 안전하게 사용됩니다." />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase border-b border-slate-100 dark:border-white/5 pb-4 px-1">Email Inquiry</h3>
              <div className="space-y-4">
                <ContactLink icon={Mail} title="직접 문의" value="zmetron@nate.com" />
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-1 pt-2">
                  서류 첨부나 대량 문의가 필요하신 경우 위 이메일로 연락 주시면 더욱 편리합니다.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-indigo-500/10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">접수 완료</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              성공적으로 문의가 접수되었습니다.<br/>
              담당자가 확인 후 빠르게 답변해 드리겠습니다.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-xl font-bold transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---
function TypeButton({ icon: Icon, label, active = false, onClick }: { icon: React.ElementType, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 cursor-pointer transition-all ${active ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-600/5' : 'border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-black tracking-tighter whitespace-nowrap">{label}</span>
    </div>
  );
}

function ResponseOption({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all ${active ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/20 text-slate-500 dark:text-slate-400'}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-black">{label}</span>
    </div>
  );
}

function InfoItem({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{title}</h4>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function ContactLink({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 group cursor-pointer hover:border-indigo-500 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{value}</p>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, ArrowRight, 
  BookOpen, 
  Users, ShieldCheck,
  Mail, MessageSquare, Send,
  CheckCircle2, Clock, Phone, Smartphone, Check, HelpCircle, ChevronDown, MapPin, X,
  Plus, Trash2, Edit, GripVertical
} from 'lucide-react';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

interface Curriculum {
  id: number;
  title: string;
  date_time: string | null;
  location: string | null;
  description: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  { category: '서비스 이용', question: '비전공자도 바이브 코딩을 배울 수 있나요?', answer: '네, 물론입니다! 바이브 코딩은 복잡한 문법보다 논리적 흐름과 AI 활용 능력을 중시하므로 비전공자분들이 더 빠르게 결과물을 만드는 경우가 많습니다.' },
  { category: '서비스 이용', question: '수강 기간에 제한이 있나요?', answer: '현재 제공되는 모든 사전 학습 및 가이드 자료는 기간 제한 없이 영구적으로 이용하실 수 있습니다.' },
  { category: '기술 지원', question: 'Cursor AI 에디터는 유료로만 사용 가능한가요?', answer: '아니요, Cursor는 무료 버전으로도 충분한 기능을 제공합니다. 학습 초기에는 무료 버전으로 시작하시는 것을 권장합니다.' },
  { category: '기술 지원', question: '코드가 동작하지 않을 때는 어떻게 하나요?', answer: '먼저 AI에게 오류 메시지를 그대로 전달하여 해결책을 물어보세요. 그래도 해결되지 않는다면 문의하기 페이지를 통해 질문을 남겨주시면 답변해 드립니다.' },
  { category: '결제/계정', question: '회원 가입 없이도 이용할 수 있나요?', answer: '기본적인 가이드와 자료실 조회는 가능하지만, 실습 성취도 저장 및 프리미엄 자료 이용을 위해서는 로그인이 필요합니다.' },
  { category: '결제/계정', question: '비밀번호를 잊어버렸어요.', answer: '로그인 페이지의 비밀번호 찾기 기능을 이용하시거나, 등록된 이메일로 문의해 주시면 재설정을 도와드립니다.' }
];

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const STUDY_TYPES = ['과외', '그룹', '일반'];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'apply' | 'inquiry' | 'faq'>('apply');
  
  // Application Form State
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [applyData, setApplyData] = useState({
    name: '',
    contact: '',
    days: [] as string[],
    studyTypes: [] as string[],
    message: ''
  });

  // Inquiry Form State
  const [responseType, setResponseType] = useState<'sms' | 'phone' | 'email'>('sms');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ type: '교육 문의', name: '', title: '', contact: '', message: '' });

  // Curriculum State
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [curriculumLoading, setCurriculumLoading] = useState(false);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  // Curriculum Management State
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [curriculumModalData, setCurriculumModalData] = useState({
    title: '',
    date_time: '',
    location: '',
    description: '',
    category: '입문',
    status: 'active'
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  // Scroll Ref
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCourse && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (activeTab === 'apply') {
      fetchCurriculums();
    }
    // 탭 변경 시 신청 모드 초기화
    if (activeTab !== 'apply') {
      setSelectedCourse(null);
    }
  }, [activeTab]);

  const fetchCurriculums = async () => {
    setCurriculumLoading(true);
    try {
      const res = await fetch('/api/curriculum');
      const data = await res.json();
      if (data.success) {
        setCurriculums(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch curriculums:', error);
    } finally {
      setCurriculumLoading(false);
    }
  };

  const handleInquirySubmit = async () => {
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
        email: responseType === 'email' ? formData.contact : null,
        phone: responseType !== 'email' ? formData.contact : null,
        message: `[답변: ${responseType === 'sms' ? '문자' : responseType === 'phone' ? '전화' : '이메일'}]\n\n${formData.message}`
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
        setFormData({ type: '교육 문의', name: '', title: '', contact: '', message: '' });
        setIsAgreed(false);
      }
    } catch (e) {
      alert('접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplySubmit = async () => {
    if (!applyData.name || !applyData.contact || applyData.days.length === 0 || applyData.studyTypes.length === 0) {
      alert('모든 필수 항목을 선택/입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: applyData.name,
        title: `[교육신청] ${selectedCourse}`,
        category: '교육 문의',
        phone: applyData.contact,
        message: `[수강 신청 상세]\n- 과정명: ${selectedCourse}\n- 가능요일: ${applyData.days.join(', ')}\n- 수강형태: ${applyData.studyTypes.join(', ')}\n\n[추가 문의]\n${applyData.message || '없음'}`
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
        setApplyData({ name: '', contact: '', days: [], studyTypes: [], message: '' });
        setSelectedCourse(null);
        setIsAgreed(false);
      }
    } catch (e) {
      alert('접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setApplyData(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const toggleType = (type: string) => {
    setApplyData(prev => ({
      ...prev,
      studyTypes: prev.studyTypes.includes(type) ? prev.studyTypes.filter(t => t !== type) : [...prev.studyTypes, type]
    }));
  };

  const handleOpenCurriculumModal = (curr?: Curriculum) => {
    if (curr) {
      setEditingCurriculum(curr);
      setCurriculumModalData({
        title: curr.title,
        date_time: curr.date_time?.replace(' ', 'T') || '',
        location: curr.location || '',
        description: curr.description || '',
        category: curr.category || '입문',
        status: curr.status
      });
    } else {
      setEditingCurriculum(null);
      setCurriculumModalData({
        title: '',
        date_time: '',
        location: '',
        description: '',
        category: '입문',
        status: 'active'
      });
    }
    setIsCurriculumModalOpen(true);
  };

  const handleCurriculumSubmit = async () => {
    try {
      const method = editingCurriculum ? 'PATCH' : 'POST';
      const payload = {
        ...curriculumModalData,
        id: editingCurriculum?.id,
        date_time: curriculumModalData.date_time.replace('T', ' ')
      };

      const res = await fetch('/api/curriculum', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsCurriculumModalOpen(false);
        fetchCurriculums();
      }
    } catch (e) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCurriculum = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/curriculum?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCurriculums();
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = curriculums.findIndex((i) => i.id === Number(active.id));
    const newIndex = curriculums.findIndex((i) => i.id === Number(over.id));
    
    const newItems = arrayMove(curriculums, oldIndex, newIndex);
    setCurriculums(newItems);
    
    // Save to DB
    try {
      const orders = newItems.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }));
      
      await fetch('/api/curriculum/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
    } catch (e) {
      console.error('Failed to save order:', e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- Header Area --- */}
      <header className="bg-slate-50 dark:bg-[#0b0f1a] text-slate-900 dark:text-white py-16 relative overflow-hidden transition-colors border-b border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            <MessageSquare className="w-3 h-3" /> Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            교육신청 <span className="text-indigo-600">및 문의</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed text-sm md:text-base font-medium">
            최적의 교육 과정을 찾고 계신가요? <br className="hidden sm:block" />
            신청부터 상세 문의까지 한곳에서 도와드립니다.
          </p>

          <div className="flex justify-center mt-12">
            <div className="inline-flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5">
              <TabButton active={activeTab === 'apply'} onClick={() => setActiveTab('apply')} icon={BookOpen} label="교육신청" />
              <TabButton active={activeTab === 'inquiry'} onClick={() => setActiveTab('inquiry')} icon={MessageSquare} label="문의하기" />
              <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={HelpCircle} label="자주하는 질문" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1">
        
        {/* 1. Education Apply Tab */}
        {activeTab === 'apply' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!selectedCourse ? (
              <div className="space-y-12">
                <div className="text-center space-y-4 relative">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">모집 중인 교육 과정</h2>
                  <p className="text-slate-500 font-medium">현업 전문가와 함께하는 실전 코딩 커리큘럼입니다.</p>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleOpenCurriculumModal()}
                      className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
                    >
                      <Plus size={16} /> 과정 추가
                    </button>
                  )}
                </div>

                {curriculumLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : curriculums.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">현재 모집 중인 과정이 없습니다. 별도 문의를 남겨주세요.</p>
                  </div>
                ) : (
                  mounted ? (
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToFirstScrollableAncestor]}
                    >
                      <SortableContext 
                        items={curriculums.map(c => c.id)}
                        strategy={rectSortingStrategy}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {curriculums.map((curr) => (
                            <SortableCurriculumCard 
                              key={curr.id} 
                              curr={curr} 
                              isAdmin={isAdmin}
                              onEdit={() => handleOpenCurriculumModal(curr)}
                              onDelete={() => handleDeleteCurriculum(curr.id)}
                              onApply={() => setSelectedCourse(curr.title)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {curriculums.map((curr) => (
                        <div key={curr.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">{curr.title}</h3>
                          <div className="flex-1 space-y-3 mb-8">
                            <p className="text-[13px] text-slate-400 italic line-clamp-3">{curr.description}</p>
                          </div>
                          <button className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm">신청하기</button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ) : (
              /* Application Form View */
              <div ref={formRef} className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                      <BookOpen size={14} /> Course Application
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">수강 신청서 작성</h2>
                  </div>
                  <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5 p-8 md:p-12 shadow-xl shadow-indigo-500/5 space-y-10">
                  {/* Selected Course Display */}
                  <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">신청 중인 과정</p>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{selectedCourse}</h3>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">성함 <span className="text-indigo-600">*</span></label>
                      <input type="text" value={applyData.name} onChange={e => setApplyData({...applyData, name: e.target.value})} placeholder="성함을 입력해 주세요" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">연락처 <span className="text-indigo-600">*</span></label>
                      <input type="tel" value={applyData.contact} onChange={e => setApplyData({...applyData, contact: e.target.value})} placeholder="010-0000-0000" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                    </div>
                  </div>

                  {/* Multi-Select: Days */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">교육 가능 요일 (다중 선택) <span className="text-indigo-600">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-12 h-12 rounded-xl border-2 font-black transition-all text-sm ${applyData.days.includes(day) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 hover:border-indigo-200'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Select: Study Types */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">수강 형태 (다중 선택) <span className="text-indigo-600">*</span></label>
                    <div className="grid grid-cols-3 gap-3">
                      {STUDY_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`py-4 rounded-xl border-2 font-black transition-all text-sm flex items-center justify-center gap-2 ${applyData.studyTypes.includes(type) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 hover:border-indigo-200'}`}
                        >
                          {applyData.studyTypes.includes(type) && <Check size={16} />}
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        <span className="text-indigo-600 dark:text-indigo-400 font-black mr-1">※</span> 
                        <span className="font-bold">과외 및 그룹</span> 신청은 교육 인원이 모집된 상태에서 시작되므로 교육 시작일을 <span className="text-slate-900 dark:text-white underline decoration-indigo-500 underline-offset-4">상담을 통해 협의하여 결정</span>합니다.<br/>
                        <span className="text-indigo-600 dark:text-indigo-400 font-black mr-1">※</span> 
                        <span className="font-bold">일반 과정</span>은 모집 정원이 충족되었을 때 공식 교육 시작일이 확정됩니다.
                      </p>
                    </div>

                    {/* Fees Table */}
                    <div className="mt-10 space-y-4">
                      <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">교육 비용 안내 (회차별/단위: 만원)</label>
                      <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-3xl">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 text-slate-400">
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">수강 형태</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">입문</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">기초</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">실전</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">심화</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                              <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200">일반 과정</td>
                              <td className="px-6 py-4 font-bold text-slate-500">12만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">17만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">29만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">39만</td>
                            </tr>
                            <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                              <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200">그룹 신청</td>
                              <td className="px-6 py-4 font-bold text-slate-500">19만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">25만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">39만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">55만</td>
                            </tr>
                            <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                              <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200">1:1 멘토링</td>
                              <td className="px-6 py-4 font-bold text-slate-500">29만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">39만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">59만</td>
                              <td className="px-6 py-4 font-bold text-slate-500">79만</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Package Pricing */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">일반 전체 패키지</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">79<span className="text-sm font-bold ml-1 text-slate-400">만</span></p>
                      </div>
                      <div className="p-5 bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">그룹 전체 패키지</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">109<span className="text-sm font-bold ml-1 text-slate-400">만</span></p>
                      </div>
                      <div className="p-5 bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">1:1 전체 패키지</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">159<span className="text-sm font-bold ml-1 text-slate-400">만</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">기타 문의 사항 (선택)</label>
                    <textarea rows={4} value={applyData.message} onChange={e => setApplyData({...applyData, message: e.target.value})} placeholder="원하시는 구체적인 상담 내용이 있다면 입력해 주세요." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none font-bold"></textarea>
                  </div>

                  {/* Agreement & Submit */}
                  <div className="space-y-8 pt-4">
                    <div className="flex items-center gap-3 p-5 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-white/5">
                      <div onClick={() => setIsAgreed(!isAgreed)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isAgreed ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800'}`}>
                        {isAgreed && <Check className="w-4 h-4" />}
                      </div>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span onClick={() => setIsAgreed(!isAgreed)} className="cursor-pointer select-none">개인정보 수집 및 이용에 동의합니다</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleApplySubmit}
                      disabled={!isAgreed || isSubmitting}
                      className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-2xl ${isAgreed && !isSubmitting ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-indigo-600/40 active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'}`}
                    >
                      {isSubmitting ? '신청 중...' : '신청서 제출하기'} <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Inquiry Tab */}
        {activeTab === 'inquiry' && (
          <div className="flex flex-col lg:flex-row gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">상세 문의 내용</h2>
                <p className="text-sm text-slate-500 font-medium italic">필수 항목은 반드시 입력해 주시기 바랍니다.</p>
              </div>

              <form className="space-y-10 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5 p-8 md:p-12 shadow-xl shadow-indigo-500/5">
                <div className="space-y-6">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 유형 <span className="text-indigo-600">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TypeButton icon={BookOpen} label="교육 문의" active={formData.type === '교육 문의'} onClick={() => setFormData({...formData, type: '교육 문의'})} />
                    <TypeButton icon={Code2} label="프로젝트 제안" active={formData.type === '프로젝트 제안'} onClick={() => setFormData({...formData, type: '프로젝트 제안'})} />
                    <TypeButton icon={Users} label="채용/제휴" active={formData.type === '채용/제휴'} onClick={() => setFormData({...formData, type: '채용/제휴'})} />
                    <TypeButton icon={MessageSquare} label="기타 문의" active={formData.type === '기타 문의'} onClick={() => setFormData({...formData, type: '기타 문의'})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">성함/기업명 <span className="text-indigo-600">*</span></label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="성함을 입력해 주세요" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 제목 <span className="text-indigo-600">*</span></label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="제목을 입력해 주세요" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">답변받으실 방법 <span className="text-indigo-600">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    <ResponseOption icon={Smartphone} label="문자 답변" active={responseType === 'sms'} onClick={() => setResponseType('sms')} />
                    <ResponseOption icon={Phone} label="전화 상담" active={responseType === 'phone'} onClick={() => setResponseType('phone')} />
                    <ResponseOption icon={Mail} label="이메일 답변" active={responseType === 'email'} onClick={() => setResponseType('email')} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">연락처/이메일 <span className="text-indigo-600">*</span></label>
                  <input type={responseType === 'email' ? 'email' : 'text'} value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder={responseType === 'email' ? 'example@email.com' : '010-0000-0000'} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest px-1">문의 내용 <span className="text-indigo-600">*</span></label>
                  <textarea rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="내용을 상세히 입력해 주시면 더욱 정확한 답변이 가능합니다." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none font-bold"></textarea>
                </div>

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

                <button 
                  type="button" 
                  onClick={handleInquirySubmit}
                  disabled={!isAgreed || isSubmitting}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-2xl ${isAgreed && !isSubmitting ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:-translate-y-1 hover:shadow-indigo-600/40 active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'}`}
                >
                  {isSubmitting ? '제출 중...' : isAgreed ? '상담 신청하기' : '개인정보 동의가 필요합니다'} <Send className={`w-5 h-5 ${isAgreed ? '' : 'opacity-20'}`} />
                </button>
              </form>
            </div>

            <aside className="lg:w-80 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase border-b border-slate-100 dark:border-white/5 pb-4 px-1">Info</h3>
                <div className="space-y-8">
                  <InfoItem icon={Clock} title="24시간 내 답변" desc="영업일 기준 24시간 이내에 전문 상담사가 배정됩니다." />
                  <InfoItem icon={CheckCircle2} title="1:1 맞춤 상담" desc="단순 정보 전달을 넘어 최적의 해결책을 제시해 드립니다." />
                  <InfoItem icon={ShieldCheck} title="개인정보 보안" desc="입력하신 정보는 상담 목적으로만 안전하게 사용됩니다." />
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* 3. FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">자주 하는 질문</h2>
              <p className="text-slate-500 font-medium">학습자들이 가장 궁금해하는 내용들을 모았습니다.</p>
            </div>
            
            <div className="space-y-4">
              {FAQ_DATA.map((item, index) => (
                <div 
                  key={index} 
                  className={`group bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'border-indigo-500 shadow-xl shadow-indigo-500/5' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${openFaqIndex === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                        {item.category}
                      </span>
                      <h3 className={`text-base font-black transition-colors ${openFaqIndex === index ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-white'}`}>
                        {item.question}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-full transition-all ${openFaqIndex === index ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rotate-180' : 'text-slate-300'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 md:px-8 pb-8">
                      <div className="h-px bg-slate-100 dark:bg-white/5 mb-6" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-center space-y-4">
              <h3 className="text-xl font-black text-white">원하는 답변을 찾지 못하셨나요?</h3>
              <button 
                onClick={() => setActiveTab('inquiry')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-sm"
              >
                1:1 문의 남기기
              </button>
            </div>
          </div>
        )}
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
              성공적으로 신청/문의가 접수되었습니다.<br/>
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

      {/* Curriculum Add/Edit Modal */}
      {isCurriculumModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCurriculumModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 dark:text-white">교육과정 {editingCurriculum ? '수정' : '등록'}</h3>
              <button onClick={() => setIsCurriculumModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">교육명</label>
                <input 
                  type="text" 
                  value={curriculumModalData.title}
                  onChange={e => setCurriculumModalData({...curriculumModalData, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" 
                  placeholder="교육명을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">교육일시</label>
                  <input 
                    type="datetime-local" 
                    value={curriculumModalData.date_time}
                    onChange={e => setCurriculumModalData({...curriculumModalData, date_time: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">카테고리</label>
                  <select 
                    value={curriculumModalData.category || '입문'}
                    onChange={e => setCurriculumModalData({...curriculumModalData, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white appearance-none"
                  >
                    <option value="입문">입문</option>
                    <option value="기초">기초</option>
                    <option value="실전">실전</option>
                    <option value="심화">심화</option>
                    <option value="디자인">디자인</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">교육장소</label>
                <input 
                  type="text" 
                  value={curriculumModalData.location}
                  onChange={e => setCurriculumModalData({...curriculumModalData, location: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" 
                  placeholder="예: 온라인 ZOOM / 강남 강의실"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">상태</label>
                <div className="flex gap-2">
                  {['active', 'upcoming', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={() => setCurriculumModalData({...curriculumModalData, status: s})}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${curriculumModalData.status === s ? 'bg-slate-900 text-white dark:bg-indigo-600' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/5 hover:border-indigo-500'}`}
                    >
                      {s === 'active' ? '모집중' : s === 'upcoming' ? '준비중' : '마감'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">상세내용</label>
                <textarea 
                  rows={4} 
                  value={curriculumModalData.description}
                  onChange={e => setCurriculumModalData({...curriculumModalData, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white resize-none" 
                  placeholder="상세 내용을 입력하세요"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5">
              <button 
                onClick={handleCurriculumSubmit}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---
function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

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

function SortableCurriculumCard({ curr, isAdmin, onEdit, onDelete, onApply }: { curr: Curriculum, isAdmin: boolean, onEdit: () => void, onDelete: () => void, onApply: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: curr.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col relative ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500/20' : 'hover:-translate-y-1'}`}
    >
      {isAdmin && (
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-8 right-8 p-1.5 text-slate-300 hover:text-indigo-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          title="드래그하여 순서 변경"
        >
          <GripVertical size={20} />
        </div>
      )}

      <div className="flex justify-between items-start mb-6 pr-8">
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-500/20">
          {curr.category || '일반'}
        </span>
        <span className={`px-3 py-1 text-[10px] font-black rounded-full ${curr.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
          {curr.status === 'active' ? '모집중' : '준비중'}
        </span>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors pr-4">{curr.title}</h3>
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2.5 text-[13px] text-slate-500 font-medium">
            <Clock size={14} className="text-slate-400" /> {curr.date_time?.replace('T', ' ') || '일정 미정'}
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-slate-500 font-medium">
            <MapPin size={14} className="text-slate-400" /> {curr.location || '온라인'}
          </div>
          <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-3 mt-4 italic">
            {curr.description}
          </p>
        </div>
      </div>
      <button 
        onClick={onApply}
        className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 group/btn shadow-lg"
      >
        신청하기 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
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

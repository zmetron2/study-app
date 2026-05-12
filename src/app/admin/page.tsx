'use client';

export const runtime = 'edge';


import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, CheckCircle2, Clock, MoreHorizontal, Plus, X, Save, Video, Monitor, Radio, ChevronDown, ChevronUp } from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  category: string | null;
  message: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

// 간단한 마크다운 → HTML 렌더러 (bold, italic, code, heading, list)
function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-black mt-3 mb-1 text-slate-800 dark:text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-black mt-4 mb-1 text-slate-800 dark:text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-black mt-4 mb-1 text-slate-800 dark:text-white">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-black text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-600 dark:text-slate-300">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-600 dark:text-slate-300">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-600 dark:text-slate-300">$2</li>')
    .replace(/\n/g, '<br />');
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  status: string;
  memo: string | null;
  joined_at: string;
}

interface AgoraUsage {
  totalMinutes: number;
  limit: number;
  percentage: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'students' | 'video-chat'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [usageData, setUsageData] = useState({ totalMinutes: 0, limit: 10000, percentage: '0.0' });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [modalData, setModalData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '프런트엔드 정규과정',
    status: 'active',
    memo: ''
  });

  const [activeSessions, setActiveSessions] = useState<{ ip_address: string; start_ts: number }[]>([]);

  useEffect(() => {
    // URL 파라미터로 탭 자동 선택
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'video-chat') {
      setActiveTab('video-chat');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    } else if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'video-chat') {
      fetchUsageData();
      fetchActiveUsers();
      
      const interval = setInterval(() => {
        fetchActiveUsers();
      }, 5000); // 5초마다 현재 접속자 목록 갱신
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  interface ActiveUser {
    ip_address: string;
    uid?: string;
    start_ts: number;
  }

  interface ActiveUsersResponse {
    ok: boolean;
    users: ActiveUser[];
  }

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('/api/agora/active-users?channel=vibe-consulting');
      if (response.ok) {
        const data = (await response.json()) as ActiveUsersResponse;
        if (data.ok) {
          const uniqueIps = Array.from(new Set(data.users.map((u) => u.ip_address))).map(ip => {
            return data.users.find((u) => u.ip_address === ip);
          });
          setActiveSessions(uniqueIps as any);
        }
      }
    } catch (error) {
      console.error('Failed to fetch active users:', error);
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/admin/agora-usage');
      if (response.ok) {
        const data = (await response.json()) as AgoraUsage;
        setUsageData(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = (await res.json()) as { success: boolean; data: Inquiry[] };
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = (await res.json()) as { success: boolean; data: Student[] };
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student: Student | null = null) => {
    if (student) {
      setEditingStudent(student);
      setModalData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        status: student.status,
        memo: student.memo || ''
      });
    } else {
      setEditingStudent(null);
      setModalData({
        name: '',
        email: '',
        phone: '',
        course: '프런트엔드 정규과정',
        status: 'active',
        memo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStudent ? 'PATCH' : 'POST';
      const body = editingStudent ? { ...modalData, id: editingStudent.id } : modalData;
      
      const res = await fetch('/api/students', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = (await res.json()) as { success: boolean; message?: string };
      if (result.success) {
        setIsModalOpen(false);
        fetchStudents();
      } else {
        alert('처리 중 오류가 발생했습니다: ' + result.message);
      }
    } catch (err) {
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchInquiries();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] pt-8 pb-20 font-sans transition-colors relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">관리자 대쉬보드</h1>
            <p className="text-slate-500 font-medium">플랫폼의 데이터를 통합 관리합니다.</p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 rounded-[4px] p-1 shadow-sm border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-[4px] text-sm font-bold transition-all ${activeTab === 'inquiries' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <MessageSquare size={16} /> 문의하기 관리
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <Users size={16} /> 교육생 관리
            </button>
            <button
              onClick={() => setActiveTab('video-chat')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'video-chat' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <Video size={16} /> 화상채팅 관리
            </button>
          </div>
        </div>

        {activeTab === 'inquiries' && (
          <div className="bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5 overflow-hidden animate-in fade-in duration-300">
            {/* 헤더 */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">접수된 문의 목록</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black">
                  대기 {inquiries.filter(i => i.status === 'pending').length}건
                </span>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black">
                  전체 {inquiries.length}건
                </span>
              </div>
            </div>

            {/* 목록 테이블 헤더 */}
            {!loading && inquiries.length > 0 && (
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 px-6 py-3 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">제목 / 문의자</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">카테고리</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">상태</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-2">관리</span>
              </div>
            )}

            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">아직 접수된 문의가 없습니다.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {inquiries.map((inq) => {
                  const isExpanded = expandedId === inq.id;
                  const createdDate = new Date(inq.created_at);
                  const completedDate = inq.completed_at ? new Date(inq.completed_at) : null;
                  const elapsedMs = completedDate ? completedDate.getTime() - createdDate.getTime() : null;
                  const elapsedStr = elapsedMs !== null ? (() => {
                    const h = Math.floor(elapsedMs / 3600000);
                    const m = Math.floor((elapsedMs % 3600000) / 60000);
                    if (h >= 24) return `${Math.floor(h/24)}일 ${h%24}시간 소요`;
                    if (h > 0) return `${h}시간 ${m}분 소요`;
                    return `${m}분 소요`;
                  })() : null;

                  return (
                    <div key={inq.id}>
                      {/* 목록 행 */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                        className="w-full grid grid-cols-[1fr_auto_auto_auto] gap-0 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                      >
                        {/* 제목 + 문의자 */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${inq.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 dark:text-white truncate">
                              {inq.category && (
                                <span className="text-[10px] font-light text-slate-400 dark:text-slate-500 mr-1.5">[{inq.category}]</span>
                              )}
                              {inq.title || inq.message.replace(/^\[.*?\]\n\n/, '').slice(0, 40) + (inq.message.length > 40 ? '...' : '')}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {inq.name}
                              {inq.email && inq.email !== 'no-email@provided.com' ? ` · ${inq.email}` : ''}
                              {inq.phone ? ` · ${inq.phone}` : ''}
                              <span className="ml-2 opacity-60">
                                {createdDate.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* 카테고리 */}
                        <div className="px-4 flex justify-center">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {inq.category || '일반문의'}
                          </span>
                        </div>

                        {/* 상태 */}
                        <div className="px-4 flex justify-center">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap ${
                            inq.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {inq.status === 'pending' ? '답변대기' : '답변완료'}
                          </span>
                        </div>

                        {/* 열기/닫기 화살표 */}
                        <div className="px-2 flex justify-center text-slate-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* 펼쳐진 상세 내용 */}
                      {isExpanded && (
                        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="border border-slate-100 dark:border-white/5 rounded-[4px] overflow-hidden">

                            {/* 메타 정보 바 - 답변유형 + 문의일시 + 연락처만 표시 */}
                            <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-white/5">
                              {/* 답변유형: 본문 첫 줄에서 추출 */}
                              {(() => {
                                const match = inq.message.match(/^\[답변: (.+?)\]/);
                                return match ? (
                                  <div className="flex items-center gap-1.5">
                                    <MessageSquare size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">답변유형</span>
                                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 ml-1">{match[1]}</span>
                                  </div>
                                ) : null;
                              })()}
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">문의일시</span>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 ml-1">
                                  {createdDate.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </div>
                              {inq.email && inq.email !== 'no-email@provided.com' && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black text-slate-400">📧</span>
                                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{inq.email}</span>
                                </div>
                              )}
                              {inq.phone && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black text-slate-400">📱</span>
                                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{inq.phone}</span>
                                </div>
                              )}
                            </div>

                            {/* 본문 (마크다운) */}
                            <div
                              className="p-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(inq.message) }}
                            />

                            {/* 완료 정보 */}
                            {inq.status === 'completed' && completedDate && (
                              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-t border-emerald-100 dark:border-emerald-500/10 flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">답변완료</span>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600/70 dark:text-emerald-400/70">
                                  {completedDate.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {elapsedStr && (
                                  <span className="text-[11px] font-bold text-emerald-600/50 dark:text-emerald-400/50">({elapsedStr})</span>
                                )}
                              </div>
                            )}

                            {/* 액션 버튼 */}
                            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 flex justify-end gap-2">
                              {inq.status === 'pending' ? (
                                <button
                                  onClick={() => updateStatus(inq.id, 'completed')}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-[4px] transition-colors flex items-center gap-2"
                                >
                                  <CheckCircle2 size={14} /> 답변완료 처리
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateStatus(inq.id, 'pending')}
                                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black rounded-[4px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                >
                                  <Clock size={14} /> 대기 상태로 변경
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black text-slate-800 dark:text-white">교육생 명단</h2>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black">총 {students.length}명</span>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[4px] text-xs font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Plus size={16} /> 교육생 등록
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">등록된 교육생이 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">교육생 정보</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">수강 코스</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">학습 진도율</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">상태</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white">{student.name}</span>
                            <span className="text-[11px] font-medium text-slate-400">{student.email}</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5">{student.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{student.course}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-40">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{student.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-600 transition-all duration-1000" 
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                            student.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' :
                            student.status === 'completed' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600' :
                            'bg-slate-100 dark:bg-white/5 text-slate-500'
                          }`}>
                            {student.status === 'active' ? '수강중' : 
                             student.status === 'completed' ? '수료' : '일시정지'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleOpenModal(student)}
                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-[4px] transition-all text-slate-400"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'video-chat' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1:1 Video Chat Option */}
              <div 
                onClick={() => window.location.href = '/admin/video-chat/one-to-one'}
                className="group relative bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 p-10 shadow-xl shadow-indigo-500/5 cursor-pointer hover:border-indigo-500 transition-all hover:shadow-indigo-500/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Monitor className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-[4px] flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                    <Monitor size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">1:1 화상 채팅</h3>
                      {activeSessions.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black">{activeSessions.length}명 접속중</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      학생과 실시간으로 마주보며<br />
                      심층적인 학습 상담을 진행합니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-widest pt-2">
                    Start Session <Plus size={16} />
                  </div>
                </div>
              </div>

              {/* 1-Person Streaming Option */}
              <div 
                onClick={() => window.location.href = '/admin/video-chat/streaming'}
                className="group relative bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 p-10 shadow-xl shadow-indigo-500/5 cursor-pointer hover:border-rose-500 transition-all hover:shadow-rose-500/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Radio className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-rose-500 rounded-[4px] flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                    <Radio size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">1인 라이브 스트리밍</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      다수의 학생들에게 화면과 음성을<br />
                      동시에 송출하는 강의용 모드입니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-rose-500 text-sm font-black uppercase tracking-widest pt-2">
                    Go Live <Radio size={16} className="animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-8 bg-indigo-50 dark:bg-indigo-500/5 rounded-[4px] border border-indigo-100 dark:border-indigo-500/10 flex items-center gap-8 shadow-inner">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[4px] flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white mb-1">Agora Infrastructure Ready</h4>
                  <p className="text-[11px] text-slate-500 font-medium">매월 10,000분 무료 통화가 제공되는 Agora SDK가 활성화되어 있습니다.</p>
                </div>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Usage</h4>
                  <span className={`text-[10px] font-black ${Number(usageData.percentage) > 80 ? 'text-rose-500' : 'text-indigo-600'}`}>
                    {usageData.percentage}% Used
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {usageData.totalMinutes.toLocaleString()} <span className="text-sm text-slate-400 font-medium">/ {usageData.limit.toLocaleString()} min</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${Number(usageData.percentage) > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'}`} 
                      style={{ width: `${usageData.percentage}%` }} 
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-2 text-[10px] font-medium text-slate-400 leading-relaxed">
                  <Clock size={12} className="shrink-0 mt-0.5" /> 
                  <div>
                    본 수치는 자체 기록 시스템 기반으로, 실제 Agora 청구량과 약간의 오차가 발생할 수 있습니다. <br />
                    <a href="https://console.agora.io/usage?feature=rtc-standard-minutes" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 underline underline-offset-2 transition-colors inline-block mt-1">
                      Agora 콘솔에서 공식 사용량 확인 →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleModalSubmit}
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          >
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-[4px] flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {editingStudent ? '교육생 정보 수정' : '새 교육생 등록'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Student Management</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">이름</label>
                  <input required value={modalData.name} onChange={e => setModalData({...modalData, name: e.target.value})} type="text" placeholder="성함 입력" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">전화번호</label>
                  <input required value={modalData.phone} onChange={e => setModalData({...modalData, phone: e.target.value})} type="tel" placeholder="010-0000-0000" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">이메일 주소</label>
                <input required value={modalData.email} onChange={e => setModalData({...modalData, email: e.target.value})} type="email" placeholder="example@email.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">교육 코스</label>
                  <select value={modalData.course} onChange={e => setModalData({...modalData, course: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold appearance-none">
                    <option value="프런트엔드 정규과정">프런트엔드 정규과정</option>
                    <option value="웹 디자인 마스터">웹 디자인 마스터</option>
                    <option value="UI/UX 입문">UI/UX 입문</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">수강 상태</label>
                  <select value={modalData.status} onChange={e => setModalData({...modalData, status: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold appearance-none">
                    <option value="active">수강중 (Active)</option>
                    <option value="completed">수료 (Completed)</option>
                    <option value="paused">일시정지 (Paused)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">관리자 메모</label>
                <textarea value={modalData.memo} onChange={e => setModalData({...modalData, memo: e.target.value})} placeholder="교육생에 대한 참고사항을 입력해 주세요." rows={3} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-bold resize-none"></textarea>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-[4px] text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                취소
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Save size={18} /> {editingStudent ? '수정사항 저장' : '교육생 등록 완료'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

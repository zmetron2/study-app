'use client';

export const runtime = 'edge';


import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, CheckCircle2, Clock, MoreHorizontal, Plus, X, Save, Video, Monitor, Radio } from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
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
    }
  }, [activeTab]);

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
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">최근 접수된 문의</h2>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black">총 {inquiries.length}건</span>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">아직 접수된 문의가 없습니다.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900 dark:text-white">{inq.name}</span>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{new Date(inq.created_at).toLocaleDateString()}</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${inq.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                            {inq.status === 'pending' ? '답변대기' : '답변완료'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 p-4 rounded-[4px] whitespace-pre-wrap">
                          {inq.message}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span>📧 {inq.email}</span>
                          {inq.phone && <span>📱 {inq.phone}</span>}
                        </div>
                      </div>
                      
                      <div className="flex lg:flex-col gap-2 shrink-0">
                        {inq.status === 'pending' ? (
                          <button onClick={() => updateStatus(inq.id, 'completed')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-[4px] transition-colors flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} /> 답변완료 처리
                          </button>
                        ) : (
                          <button onClick={() => updateStatus(inq.id, 'pending')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                            <Clock size={14} /> 대기 상태로 변경
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">1:1 화상 채팅</h3>
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

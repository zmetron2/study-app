'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Settings, Users, ShieldCheck, Plus, Monitor, LayoutGrid, Sparkles, Wifi, Clock, User } from 'lucide-react';

// Agora SDK는 클라이언트 사이드에서만 로드되어야 합니다.
let AgoraRTC: any;
if (typeof window !== 'undefined') {
  AgoraRTC = require('agora-rtc-sdk-ng');
}

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const CHANNEL = 'vibe-consulting';
const TOKEN = null; // 테스트용 (App ID 보안 설정이 'Testing'일 때 가능)

export default function OneToOneVideoChat() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('devices');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '7777') {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setPassword('');
    }
  };

  useEffect(() => {
    if (!APP_ID || !isAuthorized) return;
    
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    client.on('user-unpublished', (user) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    return () => {
      handleLeave();
    };
  }, [isAuthorized]);

  const handleJoin = async () => {
    if (!APP_ID || !clientRef.current) {
      alert('Agora App ID가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
      return;
    }

    try {
      await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);
      
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await clientRef.current.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (error) {
      console.error('Agora join error:', error);
      alert('화상채팅 연결 중 오류가 발생했습니다.');
    }
  };

  const handleLeave = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteUsers([]);
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setJoined(false);
  };

  const toggleMic = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleCamera = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!cameraOn);
      setCameraOn(!cameraOn);
    }
  };

  if (!APP_ID) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto shadow-2xl shadow-rose-500/20">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">Configuration Required</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            화상채팅 기능을 활성화하려면 Agora App ID가 필요합니다.<br />
            <code className="bg-white/5 px-2 py-1 rounded text-rose-400 font-mono text-sm">.env.local</code> 파일에 아래 항목을 추가해주세요.
          </p>
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-left font-mono text-xs text-indigo-300">
            NEXT_PUBLIC_AGORA_APP_ID=여기에_앱_아이디_입력
          </div>
          <button 
            onClick={() => window.history.back()}
            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-black transition-all"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto shadow-2xl shadow-indigo-600/20 border border-indigo-500/20">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Security Verification</h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              1:1 화상 채팅 입장을 위해<br />관리자 비밀번호를 입력해주세요.
            </p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative group">
              <input 
                type="password" 
                placeholder="••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-2xl font-black text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:tracking-normal placeholder:text-slate-600"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              Verify & Enter
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            </button>
          </form>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col font-sans transition-colors relative overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-none mb-1">1:1 학습 상담 채널</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{joined ? 'Live Session' : 'Ready to Join'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full z-10">
        {/* Remote Video (Main) */}
        <div className="flex-1 bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
          {remoteUsers.length > 0 ? (
            <div 
              id="remote-playerlist"
              className="w-full h-full"
              ref={(el) => {
                if (el && remoteUsers[0]?.videoTrack) {
                  remoteUsers[0].videoTrack.play(el);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <Users size={32} />
              </div>
              <p className="text-sm font-medium animate-pulse">상대방의 입장을 기다리고 있습니다...</p>
            </div>
          )}
          
          {/* Remote Info Badge */}
          {remoteUsers.length > 0 && (
            <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Student Active</span>
            </div>
          )}
        </div>

        {/* Local Video & Controls */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
          <div className="aspect-video lg:aspect-square bg-slate-800 rounded-3xl border border-white/5 overflow-hidden shadow-xl relative group">
            <div ref={localVideoRef} className="w-full h-full bg-black object-cover" />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <CameraOff size={32} className="text-slate-600" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md">
              <span className="text-[9px] font-black text-white uppercase tracking-tighter">You (Admin)</span>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Session Controls</h3>
            <div className="flex justify-center items-center gap-4">
              <button onClick={toggleMic} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>{micOn ? <Mic size={20} /> : <MicOff size={20} />}</button>
              <button onClick={toggleCamera} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${cameraOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>{cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}</button>
              {joined ? (
                <button onClick={handleLeave} className="w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><PhoneOff size={20} /></button>
              ) : (
                <button onClick={handleJoin} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><Plus size={24} /></button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar Tabs */}
            <aside className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/30 border-r border-slate-100 dark:border-white/5 p-8 flex flex-col gap-2 shrink-0">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 px-2">Settings</h2>
              {[
                { id: 'devices', label: '장치 설정', icon: Monitor },
                { id: 'video', label: '영상 설정', icon: Camera },
                { id: 'audio', label: '오디오 설정', icon: Mic },
                { id: 'layout', label: '화면/레이아웃', icon: LayoutGrid },
                { id: 'effects', label: '배경 및 보정', icon: Sparkles },
                { id: 'network', label: '통화 품질', icon: Wifi },
                { id: 'session', label: '세션 설정', icon: Clock },
                { id: 'general', label: '편의 기능', icon: Settings },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)} className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeSettingsTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  <tab.icon size={18} />{tab.label}
                </button>
              ))}
              <div className="mt-auto pt-6 px-2 border-t border-slate-200 dark:border-white/5">
                <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Close & Save</button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSettingsTab === 'devices' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">장치 선택</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {['Camera Source', 'Microphone Source', 'Speaker Output'].map((label, idx) => (
                        <div key={idx} className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                          <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-indigo-500">
                            <option>{idx === 0 ? 'FaceTime HD Camera' : idx === 1 ? 'Built-in Microphone' : 'Built-in Speakers'}</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black text-indigo-600 dark:text-indigo-400"><span>Microphone Test</span><span>Normal</span></div>
                    <div className="flex gap-1.5 h-6 items-center">{[...Array(20)].map((_, i) => (<div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < 8 ? 'bg-indigo-500 h-full' : 'bg-slate-200 dark:bg-white/10 h-2'}`} />))}</div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'video' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">화질 및 보정</h3><div className="grid grid-cols-3 gap-4">{['자동', '저화질', '고화질'].map((q) => (<button key={q} className={`py-4 rounded-2xl text-sm font-black border-2 ${q === '자동' ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-600 text-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400'}`}>{q}</button>))}</div></div>
                  <div className="grid grid-cols-2 gap-8">{[{l:'미러 모드', d:'좌우 반전'}, {l:'전체화면', d:'채팅창 최소화'}].map((v, i) => (<div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">{v.l}</p><p className="text-[10px] text-slate-400">{v.d}</p></div><div className={`w-12 h-6 ${i === 0 ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-white/10 justify-start'} rounded-full flex items-center px-1 cursor-pointer`}><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div></div>))}</div>
                </div>
              )}
              {activeSettingsTab === 'audio' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">오디오 상세 설정</h3><div className="space-y-4">{[{l:'마이크 기본값', d:'입장 시 상태', s:'ON'}, {l:'AI 노이즈 제거', d:'소음 억제', t:true}].map((a, i) => (<div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i===0?'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600':'bg-rose-100 dark:bg-rose-500/20 text-rose-600'}`}>{i===0?<Mic size={20}/>:<MicOff size={20}/>}</div><div><p className="text-sm font-black dark:text-white">{a.l}</p><p className="text-[10px] text-slate-400">{a.d}</p></div></div>{a.s?<span className="text-[11px] font-black text-indigo-600 uppercase">ALWAYS ON</span>:<div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>}</div>))}</div></div>
                  <div className="space-y-4"><div className="flex justify-between items-center px-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speaker Volume</span><span className="text-sm font-black text-indigo-600">85%</span></div><div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full relative"><div className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full" style={{ width: '85%' }} /><div className="absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-indigo-600 rounded-full shadow-lg" /></div></div>
                </div>
              )}
              {activeSettingsTab === 'layout' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-black dark:text-white">레이아웃 스타일</h3>
                  <div className="grid grid-cols-2 gap-6">{[{id:'t', l:'트레이너 크게', i:Monitor}, {id:'m', l:'나 크게', i:User}].map((l) => (<div key={l.id} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-6 cursor-pointer ${l.id==='t'?'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-600':'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 opacity-50'}`}><div className="w-32 h-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10 relative overflow-hidden"><div className={`absolute border ${l.id==='t'?'inset-0 bg-indigo-600/20 border-indigo-600/30':'bottom-2 right-2 w-10 h-6 bg-indigo-600/20 border-indigo-600/30 rounded-md'}`} /><div className={`absolute border ${l.id==='m'?'inset-0 bg-rose-500/20 border-rose-500/30':'bottom-2 right-2 w-10 h-6 bg-rose-500/20 border-rose-500/30 rounded-md opacity-0'}`} /></div><span className="text-sm font-black dark:text-white">{l.l}</span></div>))}</div>
                </div>
              )}
              {activeSettingsTab === 'effects' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">배경 효과 (Beta)</h3><div className="grid grid-cols-4 gap-4">{['None', 'Blur', 'Office', 'Creative'].map((bg) => (<div key={bg} className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 transition-all"><Sparkles size={20} className="text-slate-300"/><span className="text-[10px] font-black text-slate-400">{bg}</span></div>))}</div></div>
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">얼굴 보정</h3><div className="space-y-8">{['피부 보정', '밝기 보정'].map((effect) => (<div key={effect} className="space-y-3"><div className="flex justify-between items-center"><span className="text-sm font-black dark:text-slate-300">{effect}</span><span className="text-[10px] font-black text-indigo-600">Level 4</span></div><div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} /></div></div>))}</div></div>
                </div>
              )}
              {activeSettingsTab === 'network' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-8 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/10 flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><Wifi size={28}/></div><div><h4 className="text-lg font-black dark:text-white">Excellent Connection</h4><p className="text-[11px] text-slate-500 font-medium">Latency: 24ms / Jitter: 2ms</p></div></div><span className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">Good</span></div>
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">네트워크 자동 최적화</p><p className="text-[10px] text-slate-400">회선 상태에 따라 화질을 자동으로 조정합니다.</p></div><div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div></div>
                </div>
              )}
              {activeSettingsTab === 'session' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">타이머 표시</p><p className="text-[10px] text-slate-400">화면 상단에 세션 진행 시간을 표시합니다.</p></div><div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div></div>
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">자동 종료 예약</h3><div className="grid grid-cols-4 gap-4">{['30분', '50분', '80분', 'OFF'].map((time) => (<button key={time} className={`py-4 rounded-2xl text-[11px] font-black border-2 ${time === '50분' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400'}`}>{time}</button>))}</div></div>
                </div>
              )}
              {activeSettingsTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-black dark:text-white">일반 편의 기능</h3>
                  <div className="space-y-4">{[{l:'알림 사운드', d:'입장 시 알림음', a:true}, {l:'디바이스 자동 전환', d:'새 장치 자동 인식', a:true}, {l:'입장 시 카메라 OFF', d:'항상 꺼짐으로 시작', a:false}, {l:'입장 시 마이크 OFF', d:'항상 꺼짐으로 시작', a:false}].map((item, idx) => (<div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">{item.l}</p><p className="text-[10px] text-slate-400">{item.d}</p></div><div className={`w-12 h-6 ${item.a ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-white/10 justify-start'} rounded-full flex items-center px-1 cursor-pointer transition-all`}><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div></div>))}</div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] -z-10" />
    </div>
  );
}

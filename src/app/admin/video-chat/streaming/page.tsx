'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Camera, CameraOff, Mic, MicOff, Radio, Settings, Power, Users, Clock, Share2, Monitor, LayoutGrid, Sparkles, Wifi, User } from 'lucide-react';

// Agora SDK는 클라이언트 사이드에서만 로드되어야 합니다.
let AgoraRTC: any;
if (typeof window !== 'undefined') {
  AgoraRTC = require('agora-rtc-sdk-ng');
}

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const CHANNEL = 'vibe-streaming-room';
const TOKEN = null;

export default function StreamingHostPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [streamTime, setStreamTime] = useState(0);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!APP_ID) return;
    
    // 스트리밍 모드 설정
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    clientRef.current = client;

    return () => {
      stopStream();
    };
  }, []);

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        setStreamTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setStreamTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  const startStream = async () => {
    if (!APP_ID || !clientRef.current) {
      alert('Agora App ID가 설정되지 않았습니다.');
      return;
    }

    try {
      // 호스트 역할로 참여
      await clientRef.current.setClientRole('host');
      await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);
      
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: '720p_1', // HD 화질 송출
      });
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await clientRef.current.publish([audioTrack, videoTrack]);
      setIsLive(true);
    } catch (error) {
      console.error('Streaming start error:', error);
      alert('방송 송출을 시작할 수 없습니다.');
    }
  };

  const stopStream = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setIsLive(false);
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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!APP_ID) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto">
            <Radio size={40} />
          </div>
          <h1 className="text-2xl font-black text-white">App ID Required</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            스트리밍 기능을 사용하려면 .env.local 파일에 Agora App ID를 설정해야 합니다.
          </p>
          <button onClick={() => window.history.back()} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-black transition-all">
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose-600/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto shadow-2xl shadow-rose-600/20 border border-rose-500/20">
              <Radio size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Broadcast Security</h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              라이브 방송 송출 세션 시작을 위해<br />관리자 비밀번호를 입력해주세요.
            </p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative group">
              <input 
                type="password" 
                placeholder="••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-2xl font-black text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all placeholder:tracking-normal placeholder:text-slate-600"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              Verify & Go Live
              <Radio size={18} className="group-hover:scale-125 transition-transform" />
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
    <div className="min-h-screen bg-[#05070a] flex flex-col font-sans relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl relative z-20">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
            <Radio size={24} className={isLive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-none mb-1.5">라이브 스트리밍 센터</h1>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-rose-500' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'}`} />
                {isLive ? 'Live On Air' : 'Standby'}
              </span>
              {isLive && (
                <span className="text-[10px] font-black text-white/40 bg-white/5 px-2 py-0.5 rounded flex items-center gap-1.5">
                  <Clock size={10} /> {formatTime(streamTime)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2">
            <Share2 size={14} /> 링크 공유
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Broadcast Area */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Main Feed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-1 bg-black rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
            <div ref={localVideoRef} className="w-full h-full object-cover" />
            
            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-slate-500 space-y-4">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                  <CameraOff size={48} />
                </div>
                <p className="font-black text-lg">카메라가 꺼져 있습니다</p>
              </div>
            )}

            {!isLive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <p className="text-white/60 font-medium">모든 준비가 완료되었습니다.</p>
                  <button 
                    onClick={startStream}
                    className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[2rem] text-xl font-black shadow-2xl shadow-rose-600/40 transition-all active:scale-95"
                  >
                    방송 시작하기
                  </button>
                </div>
              </div>
            )}

            {/* Floating Live Badges */}
            {isLive && (
              <div className="absolute top-8 left-8 flex gap-3">
                <div className="px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-full flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" /> REC
                </div>
                <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 text-white text-xs font-black rounded-full flex items-center gap-2">
                  <Users size={14} /> 128 명 참여 중
                </div>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="h-24 bg-slate-900/80 backdrop-blur-3xl border border-white/5 rounded-[2rem] flex items-center justify-between px-10 shadow-2xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMic}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                onClick={toggleCamera}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${cameraOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {cameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {isLive ? (
                <button 
                  onClick={stopStream}
                  className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-lg shadow-rose-500/20"
                >
                  <Power size={18} /> 방송 종료
                </button>
              ) : (
                <p className="text-slate-500 text-sm font-bold">오프라인 상태입니다</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="flex-1 bg-slate-900/50 rounded-[3rem] border border-white/5 p-8 flex flex-col">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Stream Statistics</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Status</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-emerald-500">Excellent</span>
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-1 h-2 bg-emerald-500 rounded-full" />
                    <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution</p>
                <span className="text-xl font-black text-white">1280 x 720 (HD)</span>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frame Rate</p>
                <span className="text-xl font-black text-white">30 FPS</span>
              </div>
            </div>
            <div className="mt-auto p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20 text-center space-y-4">
              <Settings size={32} className="mx-auto text-indigo-400" />
              <p className="text-xs font-bold text-indigo-300 leading-relaxed">
                시청자들의 채팅 피드백은<br />조만간 업데이트 예정입니다.
              </p>
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
                <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)} className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeSettingsTab === tab.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  <tab.icon size={18} />{tab.label}
                </button>
              ))}
              <div className="mt-auto pt-6 px-2 border-t border-slate-200 dark:border-white/5">
                <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all">Close & Save</button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSettingsTab === 'devices' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">장치 선택</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {['Camera Source', 'Microphone Source', 'Speaker Output'].map((label, idx) => (
                        <div key={idx} className="space-y-3 text-left">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                          <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-rose-500">
                            <option>{idx === 0 ? 'FaceTime HD Camera' : idx === 1 ? 'Built-in Microphone' : 'Built-in Speakers'}</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black text-rose-600 dark:text-rose-400"><span>Microphone Level</span><span>Live</span></div>
                    <div className="flex gap-1.5 h-6 items-center">{[...Array(20)].map((_, i) => (<div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < 12 ? 'bg-rose-500 h-full' : 'bg-slate-200 dark:bg-white/10 h-2'}`} />))}</div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'video' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">화질 및 보정</h3><div className="grid grid-cols-3 gap-4">{['자동', '저화질', '고화질'].map((q) => (<button key={q} className={`py-4 rounded-2xl text-sm font-black border-2 ${q === '자동' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-600 text-rose-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400'}`}>{q}</button>))}</div></div>
                  <div className="grid grid-cols-2 gap-8">{[{l:'미러 모드', d:'송출 화면 좌우 반전'}, {l:'전체화면', d:'방송 제어창 숨기기'}].map((v, i) => (<div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">{v.l}</p><p className="text-[10px] text-slate-400">{v.d}</p></div><div className={`w-12 h-6 ${i === 0 ? 'bg-rose-600 justify-end' : 'bg-slate-200 dark:bg-white/10 justify-start'} rounded-full flex items-center px-1 cursor-pointer`}><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div></div>))}</div>
                </div>
              )}
              {activeSettingsTab === 'audio' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">오디오 상세 설정</h3><div className="space-y-4">{[{l:'마이크 기본값', d:'방송 시작 시 상태', s:'ON'}, {l:'AI 노이즈 제거', d:'목소리 선명도 향상', t:true}].map((a, i) => (<div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i===0?'bg-rose-100 dark:bg-rose-500/20 text-rose-600':'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600'}`}>{i===0?<Mic size={20}/>:<MicOff size={20}/>}</div><div><p className="text-sm font-black dark:text-white">{a.l}</p><p className="text-[10px] text-slate-400">{a.d}</p></div></div>{a.s?<span className="text-[11px] font-black text-rose-600 uppercase">ALWAYS ON</span>:<div className="w-12 h-6 bg-rose-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>}</div>))}</div></div>
                  <div className="space-y-4"><div className="flex justify-between items-center px-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Output Volume</span><span className="text-sm font-black text-rose-600">92%</span></div><div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full relative"><div className="absolute inset-y-0 left-0 bg-rose-600 rounded-full" style={{ width: '92%' }} /><div className="absolute top-1/2 left-[92%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-rose-600 rounded-full shadow-lg" /></div></div>
                </div>
              )}
              {activeSettingsTab === 'layout' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-xl font-black dark:text-white">방송 레이아웃</h3>
                  <div className="grid grid-cols-2 gap-6">{[{id:'t', l:'메인 크게', i:Monitor}, {id:'m', l:'채팅창 중심', i:User}].map((l) => (<div key={l.id} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-6 cursor-pointer ${l.id==='t'?'bg-rose-50 dark:bg-rose-500/10 border-rose-600':'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 opacity-50'}`}><div className="w-32 h-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10 relative overflow-hidden"><div className={`absolute border ${l.id==='t'?'inset-0 bg-rose-600/20 border-rose-600/30':'bottom-2 right-2 w-10 h-6 bg-rose-600/20 border-rose-600/30 rounded-md'}`} /></div><span className="text-sm font-black dark:text-white">{l.l}</span></div>))}</div>
                </div>
              )}
              {activeSettingsTab === 'effects' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">가상 배경</h3><div className="grid grid-cols-4 gap-4">{['None', 'Blur', 'Studio', 'Abstract'].map((bg) => (<div key={bg} className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-rose-500 transition-all"><Sparkles size={20} className="text-slate-300"/><span className="text-[10px] font-black text-slate-400">{bg}</span></div>))}</div></div>
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">뷰티 필터</h3><div className="space-y-8">{['피부 매끄럽게', '얼굴 밝게'].map((effect) => (<div key={effect} className="space-y-3"><div className="flex justify-between items-center"><span className="text-sm font-black dark:text-slate-300">{effect}</span><span className="text-[10px] font-black text-rose-600">Lv.3</span></div><div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full"><div className="h-full bg-rose-500 rounded-full" style={{ width: '60%' }} /></div></div>))}</div></div>
                </div>
              )}
              {activeSettingsTab === 'network' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="p-8 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/10 flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><Wifi size={28}/></div><div><h4 className="text-lg font-black dark:text-white">Excellent Stream</h4><p className="text-[11px] text-slate-500 font-medium">Uplink: 4.2Mbps / Downlink: 1.8Mbps</p></div></div><span className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl">Stable</span></div>
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">자동 비트레이트 조절</p><p className="text-[10px] text-slate-400">네트워크 상황에 따라 최적의 비트레이트를 유지합니다.</p></div><div className="w-12 h-6 bg-rose-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div></div>
                </div>
              )}
              {activeSettingsTab === 'session' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">실시간 타이머</p><p className="text-[10px] text-slate-400">방송 진행 시간을 시청자에게 공개합니다.</p></div><div className="w-12 h-6 bg-rose-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div></div>
                  <div className="space-y-6"><h3 className="text-xl font-black dark:text-white">방송 자동 종료</h3><div className="grid grid-cols-4 gap-4">{['50분', '100분', '150분', '제한없음'].map((time) => (<button key={time} className={`py-4 rounded-2xl text-[11px] font-black border-2 ${time === '제한없음' ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400'}`}>{time}</button>))}</div></div>
                </div>
              )}
              {activeSettingsTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-xl font-black dark:text-white">방송 편의 설정</h3>
                  <div className="space-y-4">{[{l:'시청자 입장 알림', d:'참여자 발생 시 사운드 재생', a:true}, {l:'자동 스트림 전환', d:'오류 발생 시 백업 채널로 전환', a:false}, {l:'방송 시작 시 카메라 OFF', d:'프라이버시 보호를 위해 수동 켜기', a:false}, {l:'방송 시작 시 마이크 OFF', d:'수동 켜기 후 방송 시작', a:true}].map((item, idx) => (<div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5"><div><p className="text-sm font-black dark:text-white">{item.l}</p><p className="text-[10px] text-slate-400">{item.d}</p></div><div className={`w-12 h-6 ${item.a ? 'bg-rose-600 justify-end' : 'bg-slate-200 dark:bg-white/10 justify-start'} rounded-full flex items-center px-1 cursor-pointer transition-all`}><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div></div>))}</div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
    </div>
  );
}

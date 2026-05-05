'use client';

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Camera, CameraOff, Mic, MicOff, Radio, Settings, Power, Users, Clock, Share2 } from 'lucide-react';

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const CHANNEL = 'vibe-streaming-room';
const TOKEN = null;

export default function StreamingHostPage() {
  const [isLive, setIsLive] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [streamTime, setStreamTime] = useState(0);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
          <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all">
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

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
    </div>
  );
}

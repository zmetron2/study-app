'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Settings, Users, ShieldCheck, Plus } from 'lucide-react';

// Agora SDK는 클라이언트 사이드에서만 로드되어야 합니다.
let AgoraRTC: any;
if (typeof window !== 'undefined') {
  AgoraRTC = require('agora-rtc-sdk-ng');
}

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const CHANNEL = 'vibe-consulting';
const TOKEN = null; // 테스트용 (App ID 보안 설정이 'Testing'일 때 가능)

export default function OneToOneVideoChat() {
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!APP_ID) return;
    
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
  }, []);

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
          <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
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

        {/* Local Video (Sidebar on mobile, Floating or Side on desktop) */}
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
          
          {/* Controls Card */}
          <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Session Controls</h3>
            
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={toggleMic}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button 
                onClick={toggleCamera}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${cameraOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>
              {joined ? (
                <button 
                  onClick={handleLeave}
                  className="w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-rose-500/20 active:scale-90"
                >
                  <PhoneOff size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleJoin}
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20 active:scale-90"
                >
                  <Plus size={24} />
                </button>
              )}
            </div>
            
            {!joined && (
              <p className="text-[10px] text-center text-slate-500 font-medium leading-relaxed px-2">
                플러스 버튼을 눌러 상담을 시작하세요.<br />상대방은 동일한 채널명으로 입장 가능합니다.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] -z-10" />
    </div>
  );
}

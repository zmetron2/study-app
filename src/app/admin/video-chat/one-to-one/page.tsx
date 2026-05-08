'use client';

export const runtime = 'edge';


import React, { useEffect, useRef, useState } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
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
  const sessionIdRef = useRef<string | null>(null); // D1 사용량 트래킹용

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('devices');

  // 장치 관련 상태 추가
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [selectedMicId, setSelectedMicId] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState('');
  const [micLevel, setMicLevel] = useState(0);

  // 영상 설정 상태 추가
  const [videoQuality, setVideoQuality] = useState<'auto' | 'low' | 'high'>('auto');
  const [isMirrorMode, setIsMirrorMode] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [colorCorrection, setColorCorrection] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 오디오 설정 상태 추가
  const [micDefaultOn, setMicDefaultOn] = useState(true);
  const [isNoiseReduction, setIsNoiseReduction] = useState(true);
  const [outputVolume, setOutputVolume] = useState(100);

  // 레이아웃 및 보정 상태
  const [layoutMode, setLayoutMode] = useState<'remote-large' | 'local-large'>('remote-large');
  const [selectedBg, setSelectedBg] = useState('none');
  const [beautyLevel, setBeautyLevel] = useState(60);
  const [skinSmoothing, setSkinSmoothing] = useState(50);

  // 네트워크 상태 추가
  const [networkQuality, setNetworkQuality] = useState({ uplink: 1, downlink: 1 });
  const [autoQualityAdjustment, setAutoQualityAdjustment] = useState(true);

  // 세션 및 편의 기능 상태 추가
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [sessionLimit, setSessionLimit] = useState('무제한');
  const [isEntranceNotif, setIsEntranceNotif] = useState(true);
  const [isAutoSwitch, setIsAutoSwitch] = useState(false);
  const [isStartCameraOff, setIsStartCameraOff] = useState(false);

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

    client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    client.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    // 네트워크 품질 모니터링
    client.on('network-quality', (stats: { uplinkNetworkQuality: number, downlinkNetworkQuality: number }) => {
      setNetworkQuality({
        uplink: stats.uplinkNetworkQuality,
        downlink: stats.downlinkNetworkQuality
      });
    });

    return () => {
      handleLeave();
    };
  }, [isAuthorized]);

  // 장치 목록 로드 및 볼륨 모니터링
  useEffect(() => {
    if (!isSettingsOpen) return;

    const loadDevices = async () => {
      try {
        const cams = await AgoraRTC.getCameras();
        const microphones = await AgoraRTC.getMicrophones();
        const playbacks = await AgoraRTC.getPlaybackDevices();
        setCameras(cams);
        setMics(microphones);
        setSpeakers(playbacks);

        if (localVideoTrack && !selectedCameraId) setSelectedCameraId(localVideoTrack.getTrackLabel());
        if (localAudioTrack && !selectedMicId) setSelectedMicId(localAudioTrack.getTrackLabel());
      } catch (err) {
        console.error("Device list load failed", err);
      }
    };

    loadDevices();

    let interval: NodeJS.Timeout;
    if (activeSettingsTab === 'devices' && localAudioTrack) {
      interval = setInterval(() => {
        const level = localAudioTrack.getVolumeLevel();
        setMicLevel(Math.floor(level * 100));
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSettingsOpen, activeSettingsTab, localAudioTrack, localVideoTrack]);

  // 장치 변경 핸들러
  const changeCamera = async (deviceId: string) => {
    if (localVideoTrack) {
      await localVideoTrack.setDevice(deviceId);
      setSelectedCameraId(deviceId);
    }
  };

  const changeMic = async (deviceId: string) => {
    if (localAudioTrack) {
      await localAudioTrack.setDevice(deviceId);
      setSelectedMicId(deviceId);
    }
  };

  // 영상 품질 변경
  const changeVideoQuality = async (quality: 'auto' | 'low' | 'high') => {
    if (!localVideoTrack) return;

    let config: any = '720p_1'; // default high
    if (quality === 'low') config = '240p_1';
    if (quality === 'auto') config = { width: { max: 1280, min: 640 }, height: { max: 720, min: 360 }, frameRate: { max: 30, min: 15 } };

    await localVideoTrack.setEncoderConfiguration(config);
    setVideoQuality(quality);
  };

  // 오디오 볼륨 변경
  const changeAudioVolume = (volume: number) => {
    if (localAudioTrack) {
      localAudioTrack.setVolume(volume);
      setOutputVolume(volume);
    }
  };

  // 전체화면 토글
  const toggleFullScreen = () => {
    const elem = document.getElementById('video-container');
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

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

      // D1 사용량 기록: 세션 시작
      const newSessionId = `1to1-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionIdRef.current = newSessionId;
      fetch('/api/agora/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', sessionId: newSessionId, channel: CHANNEL }),
      }).then(r => r.json()).then(d => console.log('[Agora Session] start:', d)).catch(e => console.error('[Agora Session] start error:', e));
    } catch (error) {
      console.error('Agora join error:', error);
      alert('화상채팅 연결 중 오류가 발생했습니다.');
    }
  };

  const handleLeave = async () => {
    // D1 사용량 기록: 세션 종료
    if (sessionIdRef.current) {
      fetch('/api/agora/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', sessionId: sessionIdRef.current }),
      }).then(r => r.json()).then(d => console.log('[Agora Session] end:', d)).catch(e => console.error('[Agora Session] end error:', e));
      sessionIdRef.current = null;
    }
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
          <div className="w-20 h-20 bg-rose-500/10 rounded-[4px] flex items-center justify-center text-rose-500 mx-auto shadow-2xl shadow-rose-500/20">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">Configuration Required</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            화상채팅 기능을 활성화하려면 Agora App ID가 필요합니다.<br />
            <code className="bg-white/5 px-2 py-1 rounded-[4px] text-rose-400 font-mono text-sm">.env.local</code> 파일에 아래 항목을 추가해주세요.
          </p>
          <div className="bg-black/40 border border-white/5 p-4 rounded-[4px] text-left font-mono text-xs text-indigo-300">
            NEXT_PUBLIC_AGORA_APP_ID=여기에_앱_아이디_입력
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[4px] text-sm font-black transition-all"
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
            <div className="w-20 h-20 bg-indigo-600/10 rounded-[4px] flex items-center justify-center text-indigo-500 mx-auto shadow-2xl shadow-indigo-600/20 border border-indigo-500/20">
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
                className="w-full bg-white/5 border border-white/10 p-5 rounded-[4px] text-center text-2xl font-black text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:tracking-normal placeholder:text-slate-600"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[4px] text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
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
          <div className="w-10 h-10 bg-indigo-600 rounded-[4px] flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
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
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-[4px] transition-all"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative p-6 max-w-7xl mx-auto w-full z-10 min-h-[700px] flex flex-col">
        <div className="flex-1 bg-slate-900 rounded-[4px] border border-white/5 overflow-hidden shadow-2xl relative">

          {/* 1. Main View (Full Container) */}
          <div className="w-full h-full relative group">
            {layoutMode === 'remote-large' ? (
              // 상대방 크게 모드: 원격 사용자가 메인
              remoteUsers.length > 0 ? (
                <div
                  className="w-full h-full"
                  ref={(el) => {
                    if (el && remoteUsers[0]?.videoTrack) {
                      remoteUsers[0].videoTrack.play(el);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                    <Users size={40} />
                  </div>
                  <p className="font-black">상대방의 입장을 기다리고 있습니다...</p>
                </div>
              )
            ) : (
              // 나를 크게 모드: 내 카메라가 메인
              <>
                <div
                  ref={localVideoRef}
                  className={`w-full h-full object-cover transition-all duration-300 ${isMirrorMode ? 'scaleX(-1)' : ''}`}
                  style={{
                    transform: isMirrorMode ? 'scaleX(-1)' : 'none',
                    filter: `brightness(${brightness + (beautyLevel / 5)}%) saturate(${colorCorrection}%) contrast(${100 + (skinSmoothing / 10)}%) blur(${skinSmoothing / 25}px)`
                  }}
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                      <CameraOff size={48} className="text-slate-600" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Info Badge for Main View */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${layoutMode === 'remote-large' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  {layoutMode === 'remote-large' ? 'Student View' : 'Mentor View (You)'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. PIP View (Small Floating Window) */}
          <div className="absolute bottom-8 right-8 w-48 md:w-80 aspect-video bg-black rounded-[4px] border-2 border-white/10 shadow-2xl overflow-hidden z-20 group/pip transition-all duration-500 hover:scale-105">
            {layoutMode === 'remote-large' ? (
              // 상대방 크게 모드: 내가 작게 (PIP)
              <>
                <div
                  ref={localVideoRef}
                  className={`w-full h-full object-cover ${isMirrorMode ? 'scaleX(-1)' : ''}`}
                  style={{
                    transform: isMirrorMode ? 'scaleX(-1)' : 'none',
                    filter: `brightness(${brightness + (beautyLevel / 5)}%) saturate(${colorCorrection}%) contrast(${100 + (skinSmoothing / 10)}%) blur(${skinSmoothing / 25}px)`
                  }}
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <CameraOff size={24} className="text-slate-600" />
                  </div>
                )}
              </>
            ) : (
              // 나를 크게 모드: 상대방이 작게 (PIP)
              remoteUsers.length > 0 ? (
                <div
                  className="w-full h-full"
                  ref={(el) => {
                    if (el && remoteUsers[0]?.videoTrack) {
                      remoteUsers[0].videoTrack.play(el);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Users size={24} className="text-slate-600" />
                </div>
              )
            )}

            {/* PIP Overlay Label */}
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/10">
              <span className="text-[8px] font-black text-white uppercase tracking-widest">
                {layoutMode === 'remote-large' ? 'You' : 'Student'}
              </span>
            </div>
          </div>

          {/* 3. Session Controls (Floating) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full z-30 shadow-2xl">
            <button
              onClick={toggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
            >
              {micOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${cameraOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
            >
              {cameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            {joined ? (
              <button
                onClick={handleLeave}
                className="w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all"
              >
                <PhoneOff size={24} />
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all"
              >
                <Plus size={28} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
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
                <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)} className={`flex items-center gap-4 px-5 py-4 rounded-[4px] text-sm font-black transition-all ${activeSettingsTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  <tab.icon size={18} />{tab.label}
                </button>
              ))}
              <div className="mt-auto pt-6 px-2 border-t border-slate-200 dark:border-white/5">
                <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-300 rounded-[4px] text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Close & Save</button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSettingsTab === 'devices' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">장치 선택</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Camera Source</label>
                        <select
                          value={selectedCameraId}
                          onChange={(e) => changeCamera(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-indigo-500"
                        >
                          {cameras.map(cam => <option key={cam.deviceId} value={cam.deviceId}>{cam.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Microphone Source</label>
                        <select
                          value={selectedMicId}
                          onChange={(e) => changeMic(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-indigo-500"
                        >
                          {mics.map(mic => <option key={mic.deviceId} value={mic.deviceId}>{mic.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speaker Output</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-indigo-500 opacity-50 cursor-not-allowed">
                          {speakers.map(spk => <option key={spk.deviceId} value={spk.deviceId}>{spk.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-indigo-50 dark:bg-indigo-500/5 rounded-[4px] border border-indigo-100 dark:border-indigo-500/10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black text-indigo-600 dark:text-indigo-400"><span>Microphone Test</span><span>{micLevel > 0 ? 'Normal' : 'No Input'}</span></div>
                    <div className="flex gap-1.5 h-6 items-center">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < (micLevel / 5) ? 'bg-indigo-500 h-full' : 'bg-slate-200 dark:bg-white/10 h-2'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'video' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">화질 및 보정</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {(['auto', 'low', 'high'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => changeVideoQuality(q)}
                          className={`py-4 rounded-[4px] text-sm font-black border-2 transition-all ${videoQuality === q ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-600 text-rose-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                        >
                          {q === 'auto' ? '자동' : q === 'low' ? '저화질' : '고화질'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brightness (밝기)</label>
                        <span className="text-xs font-bold text-rose-500">{brightness}%</span>
                      </div>
                      <input
                        type="range" min="50" max="150" value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saturation (색감)</label>
                        <span className="text-xs font-bold text-rose-500">{colorCorrection}%</span>
                      </div>
                      <input
                        type="range" min="50" max="150" value={colorCorrection}
                        onChange={(e) => setColorCorrection(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">미러 모드</p>
                        <p className="text-[10px] text-slate-400">송출 화면 좌우 반전</p>
                      </div>
                      <button
                        onClick={() => setIsMirrorMode(!isMirrorMode)}
                        className={`w-12 h-6 ${isMirrorMode ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isMirrorMode ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">전체화면</p>
                        <p className="text-[10px] text-slate-400">비디오 피드만 보기</p>
                      </div>
                      <button
                        onClick={toggleFullScreen}
                        className={`w-12 h-6 ${isFullScreen ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isFullScreen ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'audio' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">오디오 상세 설정</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[4px] flex items-center justify-center bg-rose-100 dark:bg-rose-500/20 text-rose-600">
                            <Mic size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">마이크 기본값</p>
                            <p className="text-[10px] text-slate-400">상담 시작 시 마이크 상태</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setMicDefaultOn(!micDefaultOn)}
                          className={`px-4 py-2 rounded-[4px] text-[10px] font-black transition-all ${micDefaultOn ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}
                        >
                          {micDefaultOn ? 'ALWAYS ON' : 'ALWAYS OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[4px] flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600">
                            <MicOff size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">노이즈 감소</p>
                            <p className="text-[10px] text-slate-400">배경 소음을 억제하고 목소리를 강조</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsNoiseReduction(!isNoiseReduction)}
                          className={`w-12 h-6 ${isNoiseReduction ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isNoiseReduction ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Gain (입력 볼륨)</span>
                      <span className="text-sm font-black text-rose-600">{outputVolume}%</span>
                    </div>
                    <input
                      type="range" min="0" max="200" value={outputVolume}
                      onChange={(e) => changeAudioVolume(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-600"
                    />
                    <p className="text-[9px] text-slate-400 italic font-medium">* 100% 이상 설정 시 음질 왜곡이 발생할 수 있습니다.</p>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'layout' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">상담 레이아웃</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      onClick={() => setLayoutMode('remote-large')}
                      className={`p-8 rounded-[4px] border-2 flex flex-col items-center gap-6 cursor-pointer transition-all ${layoutMode === 'remote-large' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-slate-300'}`}
                    >
                      <div className="w-32 h-20 bg-white dark:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-rose-600/10 border border-rose-600/20" />
                        <div className="absolute bottom-2 right-2 w-10 h-6 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-[2px]" />
                      </div>
                      <span className={`text-sm font-black ${layoutMode === 'remote-large' ? 'text-rose-600' : 'text-slate-500'}`}>상대방 크게</span>
                    </div>

                    <div
                      onClick={() => setLayoutMode('local-large')}
                      className={`p-8 rounded-[4px] border-2 flex flex-col items-center gap-6 cursor-pointer transition-all ${layoutMode === 'local-large' ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-slate-300'}`}
                    >
                      <div className="w-32 h-20 bg-white dark:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700/50" />
                        <div className="absolute bottom-2 right-2 w-10 h-6 bg-rose-600/20 border border-rose-600/30 rounded-[2px]" />
                      </div>
                      <span className={`text-sm font-black ${layoutMode === 'local-large' ? 'text-rose-600' : 'text-slate-500'}`}>나를 크게</span>
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'effects' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">가상 배경</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {['none', 'blur', 'office', 'studio'].map((bg) => (
                        <div
                          key={bg}
                          onClick={() => setSelectedBg(bg)}
                          className={`aspect-square rounded-[4px] border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${selectedBg === bg ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-600' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-slate-300'}`}
                        >
                          <Sparkles size={20} className={selectedBg === bg ? 'text-rose-600' : 'text-slate-300'} />
                          <span className={`text-[10px] font-black uppercase ${selectedBg === bg ? 'text-rose-600' : 'text-slate-400'}`}>{bg}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 italic">* 배경 블러 및 이미지 합성 기능은 Edge AI 엔진을 통해 처리됩니다.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">피부 보정 (Skin Smoothing)</label>
                        <span className="text-xs font-bold text-rose-500">{skinSmoothing}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={skinSmoothing}
                        onChange={(e) => setSkinSmoothing(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">얼굴 윤곽 및 밝기 (Beauty Level)</label>
                        <span className="text-xs font-bold text-rose-500">{beautyLevel}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={beautyLevel}
                        onChange={(e) => setBeautyLevel(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-600"
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'network' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className={`p-8 rounded-[4px] border flex items-center justify-between transition-all ${networkQuality.uplink <= 2 ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 bg-white dark:bg-slate-800 rounded-[4px] flex items-center justify-center shadow-sm ${networkQuality.uplink <= 2 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        <Wifi size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">
                          {networkQuality.uplink <= 2 ? 'Excellent Connection' : networkQuality.uplink <= 4 ? 'Good Connection' : 'Poor Connection'}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium italic">
                          Uplink Grade: {networkQuality.uplink} / Downlink Grade: {networkQuality.downlink}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 text-white text-[10px] font-black uppercase rounded-[4px] ${networkQuality.uplink <= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      {networkQuality.uplink <= 2 ? 'Stable' : 'Unstable'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">자동 화질 조절</p>
                      <p className="text-[10px] text-slate-400">네트워크 상황에 따라 최적의 화질을 실시간으로 유지합니다.</p>
                    </div>
                    <button
                      onClick={() => setAutoQualityAdjustment(!autoQualityAdjustment)}
                      className={`w-12 h-6 ${autoQualityAdjustment ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${autoQualityAdjustment ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Packet Loss (패킷 손실)</p>
                      <span className="text-xl font-black text-slate-900 dark:text-white">0.02%</span>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latency (지연 시간)</p>
                      <span className="text-xl font-black text-slate-900 dark:text-white">18ms</span>
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'session' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">상담 기록 자동 저장</p>
                      <p className="text-[10px] text-slate-400">상담 종료 후 로그파일을 관리 서버로 전송합니다.</p>
                    </div>
                    <button
                      onClick={() => setIsAutoSave(!isAutoSave)}
                      className={`w-12 h-6 ${isAutoSave ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAutoSave ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">상담 제한 시간</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {['30분', '60분', '90분', '무제한'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSessionLimit(time)}
                          className={`py-4 rounded-[4px] text-[11px] font-black border-2 transition-all ${sessionLimit === time ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">편의 기능 설정</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'entranceNotif', l: '상대방 입장 알림', d: '신규 참여자 발생 시 알림음 재생', a: isEntranceNotif, fn: () => setIsEntranceNotif(!isEntranceNotif) },
                      { id: 'autoSwitch', l: '자동 스트림 전환', d: '네트워크 불안정 시 대체 서버 연결', a: isAutoSwitch, fn: () => setIsAutoSwitch(!isAutoSwitch) },
                      { id: 'startCameraOff', l: '상담 시작 시 카메라 OFF', d: '보안을 위해 수동 켜기 후 시작', a: isStartCameraOff, fn: () => setIsStartCameraOff(!isStartCameraOff) }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{item.l}</p>
                          <p className="text-[10px] text-slate-400">{item.d}</p>
                        </div>
                        <button
                          onClick={item.fn}
                          className={`w-12 h-6 ${item.a ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.a ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
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

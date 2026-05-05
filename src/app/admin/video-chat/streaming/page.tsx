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

  // 오디오 및 보정 상태 추가
  const [micDefaultOn, setMicDefaultOn] = useState(true);
  const [isNoiseReduction, setIsNoiseReduction] = useState(true);
  const [outputVolume, setOutputVolume] = useState(100);
  const [selectedBg, setSelectedBg] = useState('none');
  const [beautyLevel, setBeautyLevel] = useState(60);
  const [skinSmoothing, setSkinSmoothing] = useState(50);

  // 네트워크 상태 추가
  const [networkQuality, setNetworkQuality] = useState({ uplink: 1, downlink: 1 });
  const [autoQualityAdjustment, setAutoQualityAdjustment] = useState(true);

  // 세션 및 편의 기능 상태 추가
  const [isAutoRecording, setIsAutoRecording] = useState(true);
  const [streamLimit, setStreamLimit] = useState('무제한');
  const [entranceAlert, setEntranceAlert] = useState(true);
  const [chatFilter, setChatFilter] = useState(true);
  const [preventCameraOff, setPreventCameraOff] = useState(false);

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

    // 네트워크 품질 모니터링
    client.on('network-quality', (stats: { uplinkNetworkQuality: number, downlinkNetworkQuality: number }) => {
      setNetworkQuality({
        uplink: stats.uplinkNetworkQuality,
        downlink: stats.downlinkNetworkQuality
      });
    });

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
    const elem = document.getElementById('streaming-container');
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

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
          <div className="w-20 h-20 bg-rose-500/10 rounded-[4px] flex items-center justify-center text-rose-500 mx-auto">
            <Radio size={40} />
          </div>
          <h1 className="text-2xl font-black text-white">App ID Required</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            스트리밍 기능을 사용하려면 .env.local 파일에 Agora App ID를 설정해야 합니다.
          </p>
          <button onClick={() => window.history.back()} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[4px] text-sm font-black transition-all">
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
            <div className="w-20 h-20 bg-rose-600/10 rounded-[4px] flex items-center justify-center text-rose-500 mx-auto shadow-2xl shadow-rose-600/20 border border-rose-500/20">
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
                className="w-full bg-white/5 border border-white/10 p-5 rounded-[4px] text-center text-2xl font-black text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all placeholder:tracking-normal placeholder:text-slate-600"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] text-sm font-black uppercase tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
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
          <div className="w-12 h-12 bg-rose-600 rounded-[4px] flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
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
                <span className="text-[10px] font-black text-white/40 bg-white/5 px-2 py-0.5 rounded-[4px] flex items-center gap-1.5">
                  <Clock size={10} /> {formatTime(streamTime)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-[4px] transition-all flex items-center gap-2">
            <Share2 size={14} /> 링크 공유
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-[4px] transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Broadcast Area */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto w-full min-h-[800px]">
        {/* Main Feed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div id="streaming-container" className="flex-1 bg-black rounded-[4px] border border-white/5 overflow-hidden shadow-2xl relative">
            <div 
              ref={localVideoRef} 
              className="w-full h-full object-cover transition-all duration-300"
              style={{ 
                transform: isMirrorMode ? 'scaleX(-1)' : 'none',
                filter: `brightness(${brightness + (beautyLevel / 5)}%) saturate(${colorCorrection}%) contrast(${100 + (skinSmoothing / 10)}%) blur(${skinSmoothing / 25}px)` 
              }} 
            />
            
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
                    className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] text-xl font-black shadow-2xl shadow-rose-600/40 transition-all active:scale-95"
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
          <div className="h-24 bg-slate-900/80 backdrop-blur-3xl border border-white/5 rounded-[4px] flex items-center justify-between px-10 shadow-2xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMic}
                className={`w-14 h-14 rounded-[4px] flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                onClick={toggleCamera}
                className={`w-14 h-14 rounded-[4px] flex items-center justify-center transition-all ${cameraOn ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
              >
                {cameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {isLive ? (
                <button 
                  onClick={stopStream}
                  className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[4px] font-black text-sm flex items-center gap-3 transition-all shadow-lg shadow-rose-500/20"
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
          <div className="flex-1 bg-slate-900/50 rounded-[4px] border border-white/5 p-8 flex flex-col">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Stream Statistics</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-[4px] border border-white/5 space-y-2">
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
              <div className="p-6 bg-white/5 rounded-[4px] border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution</p>
                <span className="text-xl font-black text-white">1280 x 720 (HD)</span>
              </div>
              <div className="p-6 bg-white/5 rounded-[4px] border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frame Rate</p>
                <span className="text-xl font-black text-white">30 FPS</span>
              </div>
            </div>
            <div className="mt-auto p-8 bg-indigo-600/10 rounded-[4px] border border-indigo-500/20 text-center space-y-4">
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
                <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)} className={`flex items-center gap-4 px-5 py-4 rounded-[4px] text-sm font-black transition-all ${activeSettingsTab === tab.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  <tab.icon size={18} />{tab.label}
                </button>
              ))}
              <div className="mt-auto pt-6 px-2 border-t border-slate-200 dark:border-white/5">
                <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-300 rounded-[4px] text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all">Close & Save</button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSettingsTab === 'devices' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">장치 선택</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Camera Source</label>
                        <select 
                          value={selectedCameraId}
                          onChange={(e) => changeCamera(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-rose-500"
                        >
                          {cameras.map(cam => <option key={cam.deviceId} value={cam.deviceId}>{cam.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Microphone Source</label>
                        <select 
                          value={selectedMicId}
                          onChange={(e) => changeMic(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-rose-500"
                        >
                          {mics.map(mic => <option key={mic.deviceId} value={mic.deviceId}>{mic.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speaker Output</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-[4px] text-sm font-bold dark:text-white outline-none focus:border-rose-500 opacity-50 cursor-not-allowed">
                          {speakers.map(spk => <option key={spk.deviceId} value={spk.deviceId}>{spk.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-rose-50 dark:bg-rose-500/5 rounded-[4px] border border-rose-100 dark:border-rose-500/10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-black text-rose-600 dark:text-rose-400"><span>Microphone Level</span><span>{micLevel > 0 ? 'Live' : 'No Input'}</span></div>
                    <div className="flex gap-1.5 h-6 items-center">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < (micLevel / 5) ? 'bg-rose-500 h-full' : 'bg-slate-200 dark:bg-white/10 h-2'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'video' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">송출 화질 및 보정</h3>
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
                        <p className="text-[10px] text-slate-400">방송 화면만 크게 보기</p>
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
                            <p className="text-[10px] text-slate-400">방송 시작 시 마이크 상태</p>
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
                  <h3 className="text-xl font-black dark:text-white">방송 레이아웃</h3>
                  <div className="grid grid-cols-2 gap-6">{[{id:'t', l:'메인 크게', i:Monitor}, {id:'m', l:'채팅창 중심', i:User}].map((l) => (<div key={l.id} className={`p-8 rounded-[4px] border-2 flex flex-col items-center gap-6 cursor-pointer ${l.id==='t'?'bg-rose-50 dark:bg-rose-500/10 border-rose-600':'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 opacity-50'}`}><div className="w-32 h-20 bg-white dark:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-white/10 relative overflow-hidden"><div className={`absolute border ${l.id==='t'?'inset-0 bg-rose-600/20 border-rose-600/30':'bottom-2 right-2 w-10 h-6 bg-rose-600/20 border-rose-600/30 rounded-[4px]'}`} /></div><span className="text-sm font-black dark:text-white">{l.l}</span></div>))}</div>
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
                          <Sparkles size={20} className={selectedBg === bg ? 'text-rose-600' : 'text-slate-300'}/>
                          <span className={`text-[10px] font-black uppercase ${selectedBg === bg ? 'text-rose-600' : 'text-slate-400'}`}>{bg}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 italic font-medium">* 가상 배경 기능은 Agora Virtual Background 확장을 통해 처리됩니다.</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">피부 매끄럽게 (Skin Smoothing)</label>
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
                        <Wifi size={28}/>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">
                          {networkQuality.uplink <= 2 ? 'Excellent Stream' : networkQuality.uplink <= 4 ? 'Good Stream' : 'Poor Stream'}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium italic">
                          Uplink: {networkQuality.uplink} / Downlink: {networkQuality.downlink} (Quality Grade)
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 text-white text-[10px] font-black uppercase rounded-[4px] ${networkQuality.uplink <= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      {networkQuality.uplink <= 2 ? 'Stable' : 'Unstable'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">자동 비트레이트 조절</p>
                      <p className="text-[10px] text-slate-400">네트워크 상황에 따라 최적의 비트레이트를 실시간으로 유지합니다.</p>
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
                      <span className="text-xl font-black text-slate-900 dark:text-white">0.05%</span>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latency (지연 시간)</p>
                      <span className="text-xl font-black text-slate-900 dark:text-white">24ms</span>
                    </div>
                  </div>
                </div>
              )}
              {activeSettingsTab === 'session' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-white/5 rounded-[4px] border border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">다시보기 자동 생성</p>
                      <p className="text-[10px] text-slate-400">방송 종료 후 자동으로 영상을 인코딩하여 저장합니다.</p>
                    </div>
                    <button 
                      onClick={() => setIsAutoRecording(!isAutoRecording)}
                      className={`w-12 h-6 ${isAutoRecording ? 'bg-rose-600' : 'bg-slate-200 dark:bg-white/10'} rounded-full flex items-center px-1 transition-all`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAutoRecording ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">방송 예약 시간</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {['60분', '120분', '180분', '무제한'].map((time) => (
                        <button 
                          key={time} 
                          onClick={() => setStreamLimit(time)}
                          className={`py-4 rounded-[4px] text-[11px] font-black border-2 transition-all ${streamLimit === time ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300'}`}
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
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">방송 편의 설정</h3>
                  <div className="space-y-4">
                    {[
                      {id: 'entrance', l:'시청자 입장 알림', d:'신규 시청자 유입 시 알림 표시', a:entranceAlert, fn: () => setEntranceAlert(!entranceAlert)},
                      {id: 'chat', l:'채팅창 욕설 필터', d:'부적절한 단어를 자동으로 가립니다', a:chatFilter, fn: () => setChatFilter(!chatFilter)},
                      {id: 'camera', l:'방송 중 카메라 OFF 금지', d:'호스트의 실수를 방지합니다', a:preventCameraOff, fn: () => setPreventCameraOff(!preventCameraOff)}
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

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
    </div>
  );
}

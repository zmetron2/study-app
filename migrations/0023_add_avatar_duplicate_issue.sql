INSERT INTO vibe_resources (title, description, url, category, tags, provider, icon_text)
VALUES (
  'WebSocket 실시간 동기화 시 아바타 중복 렌더링 해결',
  '웹소켓(WebSocket) 기반 실시간 멀티플레이어 게임을 개발할 때 흔하게 마주치는 버그 중 하나는 ''내 캐릭터(아바타)가 화면에 두 개 또는 그 이상 생성되는 현상''입니다. 서버의 브로드캐스트 패킷 설계와 클라이언트 사이드의 ID 필터링 구조가 어긋날 때 발생하는 이 중복 렌더링 이슈의 원인과 해결책을 다룹니다.

## 아바타가 복제되는 근본적인 원인
실시간 멀티플레이 환경에서는 서버와 클라이언트가 연결되었을 때 각 플레이어의 정보가 네트워크를 통해 브로드캐스트됩니다. 이때 버그가 발생하는 주된 시나리오는 다음과 같습니다.
- **자기 자신 브로드캐스트**: 서버에 세션이 연결되었을 때, 서버는 새로 들어온 플레이어의 정보를 "모든 접속자"에게 브로드캐스트합니다.
- **클라이언트 무조건 생성**: 클라이언트는 서버로부터 "플레이어 입장" 이벤트를 받으면 화면에 아바타를 생성합니다. 이때 들어오는 정보가 자기 자신의 정보인지 구분하지 않고 무조건 생성하면, 초기 화면 진입 시 로컬에서 렌더링한 캐릭터와 서버 브로드캐스트로 생성된 캐릭터가 겹쳐 아바타가 중복으로 렌더링되는 오류가 발생합니다.

## 올바른 상태 동기화 및 해결 설계
이 문제를 해결하기 위해서는 클라이언트와 서버 간의 초기 연결 흐름(Handshake)을 명확하게 정의하고 ID 기반의 필터링을 도입해야 합니다.

### 1. 고유 세션 ID 부여 및 init 이벤트 설계
서버는 클라이언트가 웹소켓에 연결되는 즉시, 연결된 소켓에 고유한 `socket.id` 혹은 사용자 고유 ID(`myId`)를 담은 초기화(`init`) 이벤트를 **오직 해당 클라이언트에게만** 단발성으로 전송해야 합니다.

### 2. 클라이언트 사이드에서의 필터링 구조
클라이언트는 서버로부터 받은 고유 `myId`를 메모리에 안전하게 캐싱해 둡니다. 이후 다른 플레이어들의 입장 정보를 브로드캐스트로 수신할 때, 수신한 플레이어 ID가 나의 `myId`와 일치하는 경우 생성을 생략(필터링)하거나 특수 처리(내 캐릭터 객체로 참조 지정)합니다.

## 실제 적용 코드 예시

### 서버 측 (Node.js / socket.io 예시)
```javascript
// server.js
const io = require(''socket.io'')(3000);
const players = {};

io.on(''connection'', (socket) => {
  console.log(`사용자 접속: ${socket.id}`);

  // 1. 접속한 클라이언트 본인에게만 고유 ID 정보와 기존 플레이어 목록 전송 (init)
  socket.emit(''init'', {
    myId: socket.id,
    existingPlayers: players
  });

  // 새 플레이어 정보 등록
  players[socket.id] = {
    id: socket.id,
    x: 100,
    y: 100,
    color: ''#'' + Math.floor(Math.random()*16777215).toString(16)
  };

  // 2. 다른 접속자들에게만 신규 접속 사실 브로드캐스트 (socket.broadcast 사용)
  // socket.broadcast.emit은 자기 자신을 제외하고 패킷을 전송합니다.
  socket.broadcast.emit(''player_joined'', players[socket.id]);

  socket.on(''disconnect'', () => {
    delete players[socket.id];
    io.emit(''player_left'', socket.id);
  });
});
```

### 클라이언트 측 (Next.js / React 예시)
```tsx
// src/components/GameCanvas.tsx
''use client'';

import React, { useEffect, useRef, useState } from ''react'';
import { io, Socket } from ''socket.io-client'';

interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
}

export default function GameCanvas() {
  const socketRef = useRef<Socket | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});

  useEffect(() => {
    // 웹소켓 연결
    const socket = io(''http://localhost:3000'');
    socketRef.current = socket;

    // 1. 내 고유 ID 수신 및 초기화
    socket.on(''init'', (data: { myId: string; existingPlayers: Record<string, Player> }) => {
      setMyId(data.myId);
      // 기존에 존재하던 다른 아바타 정보 로드 (내 ID가 아닐 경우에만 등록하는 안정 장치 추가)
      const filteredExisting = { ...data.existingPlayers };
      delete filteredExisting[data.myId];
      setPlayers(filteredExisting);
    });

    // 2. 다른 플레이어 진입 처리
    socket.on(''player_joined'', (newPlayer: Player) => {
      // 방어 코드: 수신한 캐릭터 ID가 내 고유 ID와 같다면 생성을 스킵
      if (newPlayer.id === socket.id) return;

      setPlayers((prev) => ({
        ...prev,
        [newPlayer.id]: newPlayer
      }));
    });

    // 3. 플레이어 퇴장 처리
    socket.on(''player_left'', (leftPlayerId: string) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        delete copy[leftPlayerId];
        return copy;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[800px] h-[500px] bg-slate-950 rounded-3xl overflow-hidden border border-border mx-auto flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
        My Session ID: <span className="text-emerald-400 font-bold">{myId || ''Connecting...''}</span>
      </div>
      <div className="flex gap-4">
        {/* 내 캐릭터 렌더링 영역 */}
        {myId && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-slate-800 flex items-center justify-center text-white font-black text-xs animate-bounce shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              ME
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-2 bg-emerald-500/10 px-1.5 py-0.5 rounded">Local Client</span>
          </div>
        )}
        
        {/* 원격 아바타 렌더링 영역 */}
        {Object.values(players).map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <div 
              style={{ backgroundColor: player.color }}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-900 font-black text-xs"
            >
              AVT
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-2 bg-white/5 px-1.5 py-0.5 rounded truncate max-w-[80px]">
              {player.id.substring(0, 6)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 상태 동기화 설계 핵심 팁
- **Socket.broadcast 적극 활용**: 서버에서 입장을 처리할 때 `io.emit` 대신 `socket.broadcast.emit`을 사용하면 해당 패킷이 이벤트를 일으킨 자신을 제외한 나머지 모든 사용자에게만 발송되므로 중복 생성을 원천적으로 격리하기 쉽습니다.
- **클라이언트 렌더링 우선 원칙**: 조작 피드백을 빠르게 보장하기 위해 로컬 캐릭터(ME)는 소켓 응답을 기다리지 않고 로컬에서 즉시 렌더링하며, 원격 네트워크 캐릭터들(AVT)은 오직 소켓 통신을 통한 브로드캐스트 데이터에 의해서만 생명 주기를 제어하도록 독립적인 렌더 계층으로 확실하게 구분하는 것이 이상적인 멀티플레이 게임 설계 디자인입니다.',
  '#',
  '이슈',
  'multiplayer,websocket,avatar_sync,player_duplicate,realtime_game',
  'Vibe',
  'AVT'
);

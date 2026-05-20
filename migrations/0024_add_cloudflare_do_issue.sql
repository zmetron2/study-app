INSERT INTO vibe_resources (title, description, url, category, tags, provider, icon_text)
VALUES (
  'Cloudflare Durable Objects에서 WebSocket 방송이 누락되던 이유',
  'Cloudflare Workers의 상태 관리 인프라인 Durable Objects(DO)를 활용하여 실시간 멀티플레이어 웹소켓 서버를 구현할 때, 간헐적으로 특정 소켓 클라이언트에 웹소켓 브로드캐스트 전송이 누락되거나 동기화 상태가 끊기는 현상이 발생하곤 합니다. 이 글에서는 DO 환경에서 웹소켓 동기화가 실패했던 원인과 이를 완벽히 해결하는 소켓 상태 관리 방법을 정리합니다.

## Durable Objects 웹소켓 상태가 꼬인 원인
Durable Objects는 상태를 영속적으로 보존하며 메모리에 단일 인스턴스로 존재하는 특수 서블릿(Worker)입니다. DO 내에서 웹소켓을 다룰 때 상태가 유실되거나 브로드캐스트가 누락되는 핵심 원인은 다음과 같습니다.
- **getWebSockets() API에 대한 과도한 의존**: Cloudflare DO는 인스턴스가 맺고 있는 활성 웹소켓 연결 목록을 반환하는 `state.getWebSockets()` 내장 API를 제공합니다. 그러나 가상 머신(VM) 재시작, 절전 모드 진입(Hibernation), 혹은 `ws.accept()`가 내부 스레드 루프에 완전히 바인딩되기 전 시점 차이로 인해 `getWebSockets()`가 실시간 연결을 온전히 트래킹하지 못하고 유실된 배열을 반환하는 엣지 케이스가 존재합니다.
- **Hibernation API의 예외 상황**: 클라이언트 소켓의 생명 주기가 OS 수준의 TCP 소켓 끊김이나 일시적 네트워크 순단으로 인스턴스에 올바르게 동기화되지 않을 때, 가상 메모리 해제로 인해 클라이언트와의 연결 상태 정보가 꼬이거나 누수되는 버그가 발생합니다.

## Durable Objects 기반 실시간 동기화 안정화 솔루션
이를 보완하고 실시간 동기화 신뢰성을 100% 보장하기 위한 가장 확실한 방법은, 내장 API에만 의존하지 않고 DO 클래스 내부에 고유한 웹소켓 세션 세트(`Set<WebSocket>`)를 인메모리에서 이중으로 트래킹 및 직접 관리하는 구조를 도입하는 것입니다.

### 1. Set<WebSocket> 인메모리 이중 보존 구조
웹소켓 연결이 수립될 때마다 DO 메모리에 상주하는 자바스크립트 `Set` 객체에 소켓 인스턴스를 수동으로 등록하고, 소켓이 닫히거나 에러가 발생할 때 명시적으로 `Set`에서 정리(Clean up)하는 생명 주기를 직접 정의합니다.

### 2. 브로드캐스트 에러 핸들링 루프
여러 명의 아바타 위치를 브로드캐스트 동기화할 때, 송신 실패가 발생한 소켓이나 이미 `readyState`가 비정상적인 소켓을 루프 도중에 즉시 감지하여 안전하게 컬렉션에서 제외하는 예외 복구 로직을 구현합니다.

## 실제 적용 코드 예시

Durable Objects 클래스 파일 내부에서 웹소켓을 안전하게 수락하고 상태를 동기화하는 구조의 Worker 예시 코드입니다.

### Durable Objects 서버 코드 (Cloudflare Workers TypeScript 예시)
```typescript
// src/durable_objects/GameRoom.ts
export class GameRoom implements DurableObject {
  private state: DurableObjectState;
  private env: any;
  // 내장 API 누락을 방지하기 위한 인메모리 활성 웹소켓 직접 관리 풀
  private activeSockets: Set<WebSocket>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
    this.activeSockets = new Set<WebSocket>();
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket Upgrade", { status: 426 });
    }

    // 웹소켓 쌍 생성 [Client, Server]
    const webSocketPair = new WebSocketPair();
    const [clientWebSocket, serverWebSocket] = Object.values(webSocketPair);

    // Durable Object 스레드에서 서버 측 소켓 수락 및 메모리 관리 풀에 등록
    await this.handleWebSocket(serverWebSocket);

    return new Response(null, {
      status: 101,
      webSocket: clientWebSocket,
    });
  }

  private async handleWebSocket(ws: WebSocket): Promise<void> {
    // 1. Cloudflare 런타임에 소켓 수락 선언
    ws.accept();
    
    // 2. 인메모리 세트에 등록하여 getWebSockets() 보강 및 누수 방지
    this.activeSockets.add(ws);

    // 초기 상태 동기화 패킷 송신
    ws.send(JSON.stringify({ type: "init", message: "Connected to Durable Object Game Server" }));

    // 소켓 이벤트 리스너 바인딩
    ws.addEventListener("message", async (msg) => {
      try {
        const data = JSON.parse(msg.data as string);
        
        if (data.type === "move") {
          // 수신한 이동 위치 상태를 다른 모든 플레이어에게 브로드캐스트
          this.broadcast(JSON.stringify({
            type: "update_position",
            playerId: data.playerId,
            x: data.x,
            y: data.y
          }), ws); // 본인 제외
        }
      } catch (err) {
        console.error("Message parse error:", err);
      }
    });

    // 소켓 해제 및 에러 복구 생명 주기
    const cleanUp = () => {
      this.activeSockets.delete(ws);
    };

    ws.addEventListener("close", cleanUp);
    ws.addEventListener("error", cleanUp);
  }

  // 본인을 제외한 모든 활성 플레이어에게 패킷을 전송하는 브로드캐스트 루프
  private broadcast(message: string, sender: WebSocket): void {
    // 1. 먼저 직접 관리하는 activeSockets 루프
    const targets = new Set<WebSocket>([...this.activeSockets]);

    // 2. 런타임 내장 소켓 리스트가 있다면 병합하여 누락 확률 최소화 (이중 크로스체크)
    try {
      const systemSockets = this.state.getWebSockets();
      systemSockets.forEach(s => targets.add(s));
    } catch (e) {
      // Hibernation 상태에 따라 getWebSockets가 오류를 반환할 수 있으므로 예외 처리
    }

    for (const ws of targets) {
      if (ws === sender) continue; // 송신자 제외

      try {
        // 소켓 상태 체크 후 전송
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        } else {
          // 비정상 소켓 발견 시 즉시 제거
          this.activeSockets.delete(ws);
        }
      } catch (error) {
        console.error("Broadcast transmission failed:", error);
        this.activeSockets.delete(ws);
      }
    }
  }
}
```

## 실시간 DO 웹소켓 서버 설계 팁
- **Durable Objects Hibernation(절전 모드) 활용 시 주의**: `ws.accept()`를 사용하는 대신 Cloudflare의 하이버네이션 API(`state.acceptWebSocket(ws)`)를 본격적으로 사용할 때는 리스너 핸들러가 DO 루트 수준에서 전역 메서드(`webSocketMessage`, `webSocketClose`)로 바인딩됩니다. 이때는 인스턴스가 절전 모드에 들어갔다 깰 때 상태가 재인스턴스화되므로, 세션 상태를 로컬 `Set`이 아니라 `state.storage` 영속 스토리지에 정기적으로 트래킹 및 보관해야 상태 유실을 원천적으로 막을 수 있습니다.
- **이중 크로스체크 설계**: 클라우드 엣지 컴퓨팅 환경의 독특한 가상 머신 사이클 특성상 `Set<WebSocket>`과 `state.getWebSockets()`를 결합하여 이중으로 관리하면, 어떠한 환경 조건 하에서도 브로드캐스트 누락 없이 아주 견고하고 기민한 엣지 실시간 동기화 네트워크 서버를 구현할 수 있습니다.',
  '#',
  '이슈',
  'Cloudflare_Durable_Objects,WebSocket,realtime_sync,broadcast,multiplayer_server',
  'Vibe',
  'CDO'
);

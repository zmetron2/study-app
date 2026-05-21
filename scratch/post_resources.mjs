// post_resources.mjs - UTF-8 safe resource posting via Node.js fetch
const API_URL = "https://zmetron-study.pages.dev/api/resources";

const POST_1 = {
  title: "Phaser에서 WebSocket 이벤트 안에서 this가 사라지는 이유",
  description: `Phaser Scene 내부에서 WebSocket 이벤트 콜백을 등록했는데, 콜백 함수 안에서 this.add나 this.physics 같은 Scene 메서드를 호출하면 undefined 오류가 발생하는 문제를 다룹니다. 비동기 콜백에서 Phaser 캐릭터가 움직이지 않던 근본 원인과 해결책을 공유합니다.

## this 바인딩 문제가 발생하는 구조

Phaser 3의 Scene 클래스는 JavaScript 클래스 기반으로 동작합니다. create() 또는 update() 같은 생명주기 메서드 내부에서 this는 Scene 인스턴스를 가리킵니다.

그런데 WebSocket 이벤트 리스너나 setTimeout, fetch().then() 같은 **비동기 콜백**은 별도의 실행 컨텍스트에서 호출되기 때문에, 내부의 this가 Scene 인스턴스가 아니라 undefined(strict mode) 또는 전역 객체(window)가 됩니다.

\`\`\`javascript
// 문제가 되는 코드
create() {
  this.socket = new WebSocket('ws://localhost:3000');

  this.socket.onmessage = function(event) {
    // 여기서 this는 WebSocket 객체이거나 undefined
    const data = JSON.parse(event.data);
    this.player.setPosition(data.x, data.y); // TypeError: Cannot read properties of undefined
  };
}
\`\`\`

## 원인 분석: JavaScript this 컨텍스트

JavaScript의 this는 **함수가 어떻게 호출되었느냐**에 따라 동적으로 결정됩니다.

- **일반 함수(function keyword)**: 호출 시점의 컨텍스트에 의존 → 콜백으로 전달되면 this를 잃음
- **화살표 함수(arrow function)**: 선언된 시점의 외부 스코프 this를 캡처 → 항상 안전
- **class method**: 클래스 인스턴스에 바인딩되어 있지만 콜백으로 넘기면 바인딩이 끊어짐

## 해결 방법 1: const scene = this 패턴

가장 고전적이고 확실한 방법입니다. 비동기 코드 진입 전에 scene 변수로 this 참조를 저장해 둡니다.

\`\`\`javascript
create() {
  const scene = this; // Scene 인스턴스 참조 저장

  this.socket = new WebSocket('ws://localhost:3000');

  this.socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    // scene 변수를 통해 안전하게 Scene 접근
    scene.player.setPosition(data.x, data.y);
    scene.cameras.main.shake(100, 0.01);
  };
}
\`\`\`

## 해결 방법 2: 화살표 함수 사용 (권장)

화살표 함수는 자신만의 this를 가지지 않고 외부 스코프의 this를 그대로 이어받습니다. 가장 모던하고 권장되는 방식입니다.

\`\`\`javascript
create() {
  this.socket = new WebSocket('ws://localhost:3000');

  // 화살표 함수: 외부 this(Scene)를 캡처
  this.socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    this.player.setPosition(data.x, data.y); // 정상 동작
    this.scoreText.setText('Score: ' + data.score);
  };

  // fetch 비동기에서도 동일하게 적용
  fetch('/api/map-data')
    .then((res) => res.json())
    .then((mapData) => {
      this.createMap(mapData); // 화살표 함수이므로 this가 Scene을 가리킴
    });
}
\`\`\`

## 해결 방법 3: .bind(this) 명시적 바인딩

기존 일반 함수 방식에서도 .bind()를 사용하면 this를 원하는 객체로 고정할 수 있습니다.

\`\`\`javascript
create() {
  this.socket = new WebSocket('ws://localhost:3000');
  this.socket.onmessage = this.handleMessage.bind(this);
}

handleMessage(event) {
  const data = JSON.parse(event.data);
  this.player.setPosition(data.x, data.y); // 정상 동작
}
\`\`\`

## 비동기 이벤트 처리 핵심 팁

- **WebSocket 이벤트 리스너**는 반드시 화살표 함수 또는 const scene = this 패턴을 사용합니다.
- **Phaser의 this.time.delayedCall**, **this.tweens**, **this.events.on** 등 Phaser 내장 이벤트 시스템을 이용하면 this 바인딩 문제 없이 비동기 처리가 가능합니다.
- **update() 메서드**는 Phaser가 매 프레임 자동으로 호출하므로 this가 항상 Scene 인스턴스입니다. 비동기 데이터를 인스턴스 변수에 저장하고 update()에서 읽는 패턴도 효과적입니다.
- **TypeScript를 사용하는 경우** 클래스 프로퍼티 화살표 함수 문법을 활용하면 더 깔끔하게 해결됩니다.

\`\`\`typescript
// TypeScript: 클래스 프로퍼티 화살표 함수
class GameScene extends Phaser.Scene {
  private handleSocketMessage = (event: MessageEvent) => {
    // 화살표 함수이므로 this는 항상 GameScene 인스턴스
    const data = JSON.parse(event.data as string);
    this.player.setPosition(data.x, data.y);
  };

  create() {
    this.socket = new WebSocket('ws://localhost:3000');
    this.socket.onmessage = this.handleSocketMessage;
  }
}
\`\`\``,
  url: "#",
  category: "이슈",
  tags: "Phaser,this_binding,websocket_callback,scene_reference,javascript_async",
  provider: "Vibe",
  icon_text: "PHR",
};

const POST_2 = {
  title: "Next.js에서 서버 폴더 때문에 빌드가 실패한 이유",
  description: `Next.js 프로젝트에서 src/server 폴더를 추가하거나 관련 의존성을 설치했을 때 빌드가 실패하는 원인을 분석하고, tsconfig exclude 설정과 next.config.ts 조정으로 배포 파이프라인을 복구하는 방법을 정리합니다.

## Next.js가 src/server 폴더를 읽는 이유

Next.js는 빌드 시 TypeScript 컴파일러(tsc)를 통해 타입 검사를 수행합니다. 이때 tsconfig.json의 include 범위 안에 있는 모든 .ts 파일을 분석합니다.

src/server 폴더에 Node.js 전용 코드(예: Express, socket.io, ws 패키지를 사용하는 파일)가 있으면 다음과 같은 문제가 발생합니다.

- **브라우저/엣지 환경과의 타입 충돌**: Node.js 전용 타입(Buffer, process.env, require() 등)이 Next.js의 엣지 런타임과 충돌합니다.
- **모듈 해석 오류**: Next.js 번들러(Webpack/Turbopack)가 서버 전용 모듈을 클라이언트 번들에 포함하려 시도하면 빌드가 실패합니다.
- **ESLint 린트 오류**: 서버 폴더의 코드가 Next.js ESLint 규칙 범위에 포함되어 린트 에러로 배포가 차단됩니다.

## 타입 검사 충돌 사례

\`\`\`
Type error: Module '"socket.io"' has no exported member 'Server'.
./src/server/index.ts:1:10
\`\`\`

\`\`\`
./src/server/gameRoom.ts
Module not found: Can't resolve 'ws' in '/vercel/path0/src/server'
\`\`\`

이런 오류는 Next.js가 빌드 과정에서 서버 폴더를 분석하면서 발생합니다.

## 해결 방법 1: tsconfig.json exclude 설정

가장 근본적인 해결책입니다. TypeScript 컴파일러가 서버 폴더를 아예 무시하도록 설정합니다.

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": [
    "node_modules",
    "src/server",
    "src/server/**/*"
  ]
}
\`\`\`

## 해결 방법 2: next.config.ts 빌드 복원력 설정

린트 에러나 타입 에러가 일시적으로 배포를 막지 않도록 next.config.ts에서 무시 설정을 활성화합니다. 특히 Cloudflare Pages 배포 파이프라인에서 중요합니다.

\`\`\`typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint 오류가 빌드를 막지 않도록 설정
  },
  typescript: {
    ignoreBuildErrors: true, // TS 타입 에러가 빌드를 막지 않도록 설정
  },
};

export default nextConfig;
\`\`\`

## 해결 방법 3: 서버 코드를 별도 패키지로 분리

더 체계적인 해결책은 Next.js 프로젝트와 서버 코드를 완전히 분리하는 것입니다.

\`\`\`
프로젝트 루트/
├── next-app/       (Next.js 프론트엔드)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── game-server/    (Node.js 게임 서버)
    ├── src/
    ├── package.json
    └── tsconfig.json
\`\`\`

각 폴더를 독립적인 tsconfig와 package.json으로 관리하면 타입 충돌이 원천 차단됩니다.

## 배포 파이프라인 복구 절차

1. **즉시 조치**: next.config.ts의 ignoreDuringBuilds 활성화 → 빌드 차단 해제
2. **근본 해결**: tsconfig.json exclude에 src/server 추가 → 타입 충돌 제거
3. **린트 정리**: 서버 폴더를 .eslintignore에 추가하거나 별도 ESLint 설정 적용
4. **배포 확인**: git push로 Cloudflare Pages 자동 배포 트리거 후 빌드 로그 확인

## Cloudflare Pages 특이사항

Cloudflare Pages + Next.js(Edge) 환경에서는 추가로 다음 설정이 필요합니다.

- **호환성 플래그**: 대시보드 Settings에서 nodejs_compat 플래그 추가 필수
- **Framework preset**: Next.js (Edge) 선택 필수
- **호환성 날짜**: 2024-11-18 이후 날짜로 설정 (구버전은 V8 엔진 호환성 크래시 발생)
- **빌드 출력 경로**: .vercel/output/static 이어야 배포 결과물이 올바르게 인식됨`,
  url: "#",
  category: "이슈",
  tags: "Next.js_build_error,tsconfig_exclude,lint_error,deployment,TypeScript",
  provider: "Vibe",
  icon_text: "NXT",
};

async function postResource(data, label) {
  console.log(`\n=== Posting: ${label} ===`);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(json, null, 2));
  return json;
}

(async () => {
  try {
    await postResource(POST_1, "Phaser this 바인딩 이슈");
    await postResource(POST_2, "Next.js 빌드 오류 모음");
    console.log("\n✅ 두 건 모두 등록 완료!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();

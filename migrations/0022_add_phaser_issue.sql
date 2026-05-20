INSERT INTO vibe_resources (title, description, url, category, tags, provider, icon_text)
VALUES (
  'Next.js에서 Phaser 사용 시 navigator/window 에러 해결 방법',
  'Next.js와 Phaser를 연동할 때 서버 사이드 렌더링(SSR) 환경에서 window나 navigator 객체가 존재하지 않아 발생하는 ReferenceError 해결 방안을 공유합니다. Phaser는 브라우저 전용 그래픽 엔진이므로 서버 환경에서는 빌드 및 로드가 불가능합니다.

## SSR 환경에서 Phaser가 깨지는 이유
Phaser는 HTML5 Canvas 및 WebGL을 기반으로 렌더링하는 클라이언트 사이드 게임 엔진입니다. 
- **브라우저 객체 의존성**: Phaser 내부 코드에서는 `window`, `navigator`, `document` 등 브라우저 환경에만 존재하는 글로벌 객체에 강하게 의존합니다.
- **서버 렌더링 에러**: Next.js는 기본적으로 페이지를 서버에서 미리 렌더링(SSR)하려고 시도합니다. 이 시점에 Node.js 서버 환경에는 `window`나 `navigator`가 정의되어 있지 않으므로 `ReferenceError: window is not defined` 에러가 발생하며 빌드 또는 렌더링이 실패합니다.

## dynamic import를 통한 SSR 비활성화 해결법
Next.js가 제공하는 동적 임포트(`next/dynamic`) 기능을 활용하면, Phaser를 로드하고 사용하는 컴포넌트를 서버 사이드 렌더링 대상에서 완전히 제외할 수 있습니다.
- `ssr: false` 옵션을 지정하면 해당 컴포넌트는 오직 브라우저(클라이언트) 환경에서만 로드되고 렌더링됩니다.

## 실제 적용 코드 예시

먼저 Phaser 게임이 실제로 들어갈 클라이언트 컴포넌트를 별도의 파일로 작성합니다. 해당 컴포넌트 상단에는 반드시 `''use client'';` 지시어를 지정해야 합니다.

```tsx
// src/components/GameContainer.tsx
''use client'';

import React, { useEffect, useRef } from ''react'';
import Phaser from ''phaser'';

export default function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Phaser Config 구성
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      physics: {
        default: ''arcade'',
        arcade: { gravity: { y: 200 } }
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          this.load.image(''sky'', ''https://labs.phaser.io/assets/skies/space3.png'');
        },
        create: function(this: Phaser.Scene) {
          this.add.image(400, 300, ''sky'');
        }
      }
    };

    // 브라우저 마운트 후 Phaser Game 인스턴스 생성
    const game = new Phaser.Game(config);

    // 컴포넌트 언마운트 시 리소스 해제
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="w-full max-w-[800px] h-[600px] mx-auto rounded-2xl overflow-hidden border border-border" id="phaser-game-container" />;
}
```

이제 위에서 정의한 컴포넌트를 Next.js 페이지에서 `next/dynamic`을 사용하여 `ssr: false` 옵션으로 가져옵니다.

```tsx
// src/app/game/page.tsx
import dynamic from ''next/dynamic'';

// GameContainer 컴포넌트를 SSR에서 제외하고 동적으로 임포트
const GameContainer = dynamic(
  () => import(''@/components/GameContainer''),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-900 rounded-2xl border border-border">
        <p className="text-white text-sm font-black animate-pulse uppercase tracking-wider">Loading Phaser Engine...</p>
      </div>
    )
  }
);

export default function GamePage() {
  return (
    <main className="container mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Phaser Game Integration</h1>
        <p className="text-slate-500 text-sm">Next.js App Router 환경에서 Phaser 안전하게 실행하기</p>
      </div>
      <GameContainer />
    </main>
  );
}
```

## App Router 환경 팁
- **Client Component 분리**: Phaser 인스턴스를 생성하거나 제어하는 코드는 반드시 별도의 파일로 쪼갠 뒤 `''use client'';` 지시어를 선언하여 컴포넌트로 만드세요.
- **Dynamic Import의 임포트 경로**: `dynamic(() => import(''...''))` 내의 임포트 경로는 상대 경로 혹은 절대 경로(`@/...`)를 정확하게 지정해야 Next.js 번들러가 이를 감지하고 지연 로딩 청크로 분리할 수 있습니다.
- **클라이언트 전용 라이브러리 추가 처리**: 만약 Phaser 플러그인 등 서버 환경을 지원하지 않는 서브 라이브러리가 있을 경우, 해당 모듈 역시 `useEffect` 안에서 동적 `import()` 구문을 사용하여 클라이언트 측에서만 불러와 사용해야 합니다.',
  '#',
  '이슈',
  'Next.js,Phaser,SSR,dynamic_import,Error',
  'Vibe',
  'PHA'
);

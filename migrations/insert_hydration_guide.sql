INSERT INTO vibe_resources (title, description, url, category, tags, provider, rating, icon_text, created_at) VALUES 
('하이드레이션 불일치(Hydration Mismatch) 완벽 가이드', '### 🌊 하이드레이션 불일치(Error #418) 원인과 해결법

Next.js나 React SSR 환경에서 가장 자주 발생하는 **Hydration Mismatch**는 서버에서 렌더링한 HTML과 브라우저에서 처음 렌더링한 결과가 다를 때 발생합니다.

---

#### 1. 대표적인 원인
1. **비결정적 데이터 사용**: `new Date()`, `Math.random()` 등을 컴포넌트 본문에서 직접 호출하는 경우.
2. **브라우저 전용 API 접근**: `useEffect` 밖에서 `window`, `localStorage`, `sessionStorage`를 사용하는 경우.
3. **지역별 포맷 차이**: `toLocaleString()` 처럼 서버와 클라이언트의 시간대/언어 설정에 따라 결과가 달라지는 함수 사용.
4. **잘못된 HTML 구조**: `<a>` 태그 안에 `<a>`를 넣거나, `<p>` 태그 안에 `<div>`를 넣는 등 문법 오류.

#### 2. 확실한 해결 방법

**A. `mounted` 상태 활용 (권장)**
컴포넌트가 클라이언트에 마운트된 이후에만 동적 데이터를 그리도록 제한합니다.
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

return <div>{mounted ? localStorage.getItem("data") : "Loading..."}</div>;
```

**B. `suppressHydrationWarning` 사용**
텍스트가 미세하게 다를 수밖에 없는 경우(예: 다크모드 클래스, 단순 연도 등) 속성을 통해 경고를 무시합니다.
```tsx
<html suppressHydrationWarning>
```

**C. `useEffect` 내에서 데이터 갱신**
초기 상태는 서버와 동일하게 고정값(예: 2026)으로 두고, 마운트 직후 실제 데이터로 업데이트합니다.

#### 3. 주의사항
- 하이드레이션 에러는 단순 경고가 아닙니다. 이 에러가 발생하면 React는 전체 DOM을 새로 그리게 되어 **성능 저하**와 **이벤트 바인딩 오류**를 유발할 수 있습니다.
- 모든 동적 요소는 반드시 클라이언트 사이드 마운트 이후에 결정되도록 설계하세요.', '#', '문서/가이드', 'Hydration,Next.js,React,ErrorFix', 'Vibe', 5.0, 'HYD', '2026-05-05');

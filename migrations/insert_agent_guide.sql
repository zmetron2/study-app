INSERT INTO vibe_resources (title, description, url, category, tags, provider, rating, icon_text, created_at) VALUES 
('AI 에이전트용 자료실 API 작성 표준 가이드', '본 가이드는 AI 에이전트가 `vibe_resources` API를 통해 자료를 자동 등록하거나 수정할 때 준수해야 할 데이터 구조 및 스타일 규칙을 정의합니다.

## 01. API 데이터 구조 (JSON)
에이전트는 API 호출 시 아래 필드를 정확히 구성해야 합니다.
- `title`: 자료의 명칭 (이모지 사용 금지)
- `description`: 마크다운 형식의 본문 (표준 마크다운 규칙 준수)
- `category`: `CATEGORIES` 배열에 정의된 값 중 선택
- `tags`: 검색용 키워드 (쉼표로 구분)
- `provider`: 자료 제공 기관 또는 서비스명
- `icon_text`: 3~4자의 영문 대문자 (자료 성격 반영)

## 02. 본문 마크다운 스타일 (Agent Standard)
본 자료실의 특수 렌더링 엔진을 고려하여 아래 마크다운 패턴을 사용합니다.
- **서두 요약**: 본문 최상단에 핵심 요약을 1~2줄 작성합니다. (이모지 금지)
- **소제목 계층**: `##`를 최상위 제목으로 시작합니다.
- **리스트**: 불필요한 번호 대신 순서 없는 리스트(`-`)를 사용합니다.
- **표(Table)**: 데이터 비교 시 적극 활용하며, 표준 마크다운 표 문법을 사용합니다.
- **코드 블록**: ` ```언어 ` 형식을 사용하여 다크모드와 복사 버튼이 활성화되도록 합니다.

## 03. 금지 사항 (Restrictions)
- 제목(Title)에 이모지 또는 특수기호 사용 금지.
- 서두 요약 부분에 이모지 사용 금지.
- `id` 필드는 `POST`(등록) 시에는 제외하고, `PUT`(수정) 시에만 포함합니다.

## 04. 작성 예시 (Payload Example)
```json
{
  "title": "Cloudflare D1 Database Guide",
  "category": "문서/가이드",
  "description": "클라우드플레어의 D1 데이터베이스를 Next.js 환경에서 구축하고 운영하는 통합 가이드입니다.\n\n## 개요\nD1은 SQL 기반의 서버리스 데이터베이스로...",
  "tags": "Cloudflare, D1, Database, SQL",
  "provider": "Cloudflare",
  "icon_text": "D1DB"
}
```', '#', '문서/가이드', 'Agent,API,Standard,JSON', 'Vibe', 5.0, 'AGT', CURRENT_TIMESTAMP);

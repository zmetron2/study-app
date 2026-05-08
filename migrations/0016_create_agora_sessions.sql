-- Agora 화상 통화 세션 사용량 트래킹 테이블
-- 매월 1일 UTC 기준으로 초기화 (Agora 무료 한도와 동일)
CREATE TABLE IF NOT EXISTS agora_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,   -- 클라이언트에서 생성한 고유 세션 ID
  channel TEXT NOT NULL,             -- Agora 채널명 (vibe-consulting 등)
  uid TEXT,                          -- 사용자 UID
  start_ts INTEGER NOT NULL,         -- 세션 시작 Unix timestamp (초)
  end_ts INTEGER,                    -- 세션 종료 Unix timestamp (초, NULL이면 진행 중)
  duration_seconds INTEGER DEFAULT 0, -- 통화 시간(초), end 시 계산
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_agora_sessions_start_ts ON agora_sessions(start_ts);
CREATE INDEX IF NOT EXISTS idx_agora_sessions_channel ON agora_sessions(channel);

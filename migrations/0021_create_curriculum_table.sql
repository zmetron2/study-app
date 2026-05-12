-- 교육과정 관리 테이블 생성
CREATE TABLE IF NOT EXISTS vibe_curriculum (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date_time TEXT,
  location TEXT,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 샘플 데이터 삽입
INSERT INTO vibe_curriculum (title, date_time, location, description, category, status)
VALUES 
('웹 개발 입문 특강', '2026-06-15 14:00', '온라인 라이브 스테이지', '프런트엔드 개발의 기초와 HTML/CSS 기본기를 다집니다.', '입문', 'active'),
('React 심화 워크숍', '2026-07-01 10:00', '강남역 캠퍼스 A동 302호', 'React의 고급 패턴과 성능 최적화 전략을 실습을 통해 학습합니다.', '심화', 'upcoming'),
('UI/UX 디자인 디자인 기초', '2026-06-20 13:00', '온라인', '피그마를 활용한 협업 및 디자인 시스템 구축 기초 강의입니다.', '디자인', 'active');

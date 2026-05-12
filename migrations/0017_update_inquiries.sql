-- vibe_inquiries 테이블에 제목, 카테고리, 답변완료시각 컬럼 추가
ALTER TABLE vibe_inquiries ADD COLUMN title TEXT;
ALTER TABLE vibe_inquiries ADD COLUMN category TEXT DEFAULT '일반문의';
ALTER TABLE vibe_inquiries ADD COLUMN completed_at DATETIME;

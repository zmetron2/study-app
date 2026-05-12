-- 기존 학생 데이터의 수강코스를 현재 운영 중인 목록과 동기화
UPDATE vibe_students 
SET course = '기초 정규과정' 
WHERE course = '프런트엔드 정규과정';

UPDATE vibe_students 
SET course = '실전 정규과정' 
WHERE course = '웹 디자인 마스터';

UPDATE vibe_students 
SET course = '입문 정규과정' 
WHERE course = 'UI/UX 입문';

UPDATE vibe_students 
SET course = '심화 정규과정' 
WHERE course = '백엔드 정규과정';

-- 목록에 없는 기타 코스들은 '기타'로 통합 (필요시)
-- UPDATE vibe_students SET course = '기타' WHERE course NOT IN ('입문 정규과정', '기초 정규과정', '실전 정규과정', '심화 정규과정', '기타');

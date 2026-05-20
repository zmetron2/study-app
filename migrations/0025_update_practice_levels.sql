-- Migration: Update Practice Levels to Curriculum Levels
UPDATE practice_projects SET level = '기초' WHERE level = '초급';
UPDATE practice_projects SET level = '실전' WHERE level = '중급';
UPDATE practice_projects SET level = '심화' WHERE level = '고급';

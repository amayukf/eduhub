-- Seed data for LMS
-- Note: Users must be created via Supabase Auth, so we'll insert profiles directly.

-- Insert teacher profile (first create user via Supabase Auth with email demo@teacher.com and password demo123)
-- INSERT INTO profiles (id, name, role, created_at) VALUES ('YOUR-TEACHER-USER-ID', 'Mr. Abebe', 'teacher', NOW());

-- Insert student profile (first create user via Supabase Auth with email demo@student.com and password demo123)
-- INSERT INTO profiles (id, name, role, created_at) VALUES ('YOUR-STUDENT-USER-ID', 'Dawit', 'student', NOW());

-- Sample course
-- INSERT INTO courses (teacher_id, title, subject, grade, description, published, created_at) VALUES 
-- ('YOUR-TEACHER-USER-ID', 'Grade 8 Mathematics', 'Mathematics', '8', 'Introduction to algebra, geometry, and statistics for grade 8 students.', true, NOW());

-- Sample notes
-- INSERT INTO notes (course_id, title, content_html, week, unit, published, created_at) VALUES
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Introduction to Algebra', '<h2>What is Algebra?</h2><p>Algebra is the part of mathematics that helps represent problems or situations in the form of mathematical expressions.</p><h3>Variables</h3><p>Variables are symbols (usually letters) that represent unknown values. Common variables are x, y, z.</p>', 1, 'Unit 1', true, NOW()),
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Linear Equations', '<h2>Linear Equations</h2><p>A linear equation is an equation for a straight line.</p><p>Example: y = 2x + 1</p>', 1, 'Unit 1', true, NOW()),
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Geometry Basics', '<h2>Points, Lines, and Planes</h2><p>These are the fundamental concepts in geometry.</p>', 2, 'Unit 2', true, NOW());

-- Sample worksheet
-- INSERT INTO worksheets (course_id, title, description, pdf_url, due_date, created_at) VALUES
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Algebra Practice Sheet', 'Practice problems for linear equations.', NULL, (NOW() + INTERVAL '7 days'), NOW()),
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Geometry Worksheet', 'Basic geometry problems.', NULL, (NOW() + INTERVAL '14 days'), NOW());

-- Sample quiz
-- INSERT INTO quizzes (course_id, title, time_limit_mins, passing_score, allow_retake, created_at) VALUES
-- ((SELECT id FROM courses WHERE title = 'Grade 8 Mathematics' LIMIT 1), 'Algebra Quiz 1', 30, 60, true, NOW());

-- Sample quiz questions
-- INSERT INTO questions (quiz_id, type, prompt, options_json, correct_answer, "order") VALUES
-- ((SELECT id FROM quizzes WHERE title = 'Algebra Quiz 1' LIMIT 1), 'multiple-choice', 'What is the value of x if 2x = 10?', '["3","4","5","6"]', '5', 1),
-- ((SELECT id FROM quizzes WHERE title = 'Algebra Quiz 1' LIMIT 1), 'true-false', 'The equation y = 3x - 2 is linear.', '[]', 'true', 2),
-- ((SELECT id FROM quizzes WHERE title = 'Algebra Quiz 1' LIMIT 1), 'multiple-choice', 'Which of these is a variable?', '["5","x","+","="]', 'x', 3),
-- ((SELECT id FROM quizzes WHERE title = 'Algebra Quiz 1' LIMIT 1), 'true-false', 'Algebra uses only numbers.', '[]', 'false', 4),
-- ((SELECT id FROM quizzes WHERE title = 'Algebra Quiz 1' LIMIT 1), 'short-answer', 'Solve: x + 5 = 12', '[]', '7', 5);

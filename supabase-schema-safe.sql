-- Safe schema setup - drops existing objects first (WARNING: this will delete all your data!)
-- Use only if you want to reset everything

-- Drop existing objects (in reverse order of creation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY IF EXISTS "Students can manage their own note read states." ON note_read_states;
DROP POLICY IF EXISTS "Teachers can view enrollments for their courses." ON enrollments;
DROP POLICY IF EXISTS "Students can manage their own enrollments." ON enrollments;
DROP POLICY IF EXISTS "Students can manage their own quiz attempts." ON quiz_attempts;
DROP POLICY IF EXISTS "Teachers can manage questions for their own courses' quizzes." ON questions;
DROP POLICY IF EXISTS "Students can view questions for enrolled courses' quizzes." ON questions;
DROP POLICY IF EXISTS "Teachers can manage quizzes for their own courses." ON quizzes;
DROP POLICY IF EXISTS "Students can view quizzes for enrolled courses." ON quizzes;
DROP POLICY IF EXISTS "Teachers can view and update submissions for their courses." ON submissions;
DROP POLICY IF EXISTS "Students can insert their own submissions." ON submissions;
DROP POLICY IF EXISTS "Students can view and create their own submissions." ON submissions;
DROP POLICY IF EXISTS "Teachers can manage worksheets for their own courses." ON worksheets;
DROP POLICY IF EXISTS "Students can view worksheets for enrolled courses." ON worksheets;
DROP POLICY IF EXISTS "Teachers can manage notes for their own courses." ON notes;
DROP POLICY IF EXISTS "Anyone can view published notes of published courses." ON notes;
DROP POLICY IF EXISTS "Teachers can create and manage their own courses." ON courses;
DROP POLICY IF EXISTS "Anyone can view published courses." ON courses;
DROP POLICY IF EXISTS "Users can delete their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

DROP TABLE IF EXISTS note_read_states CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS worksheets CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Now create everything fresh
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_html TEXT,
  week INTEGER NOT NULL,
  unit TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create worksheets table
CREATE TABLE worksheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  grade INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worksheet_id, student_id)
);

-- Create quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time_limit_mins INTEGER DEFAULT 30,
  passing_score INTEGER DEFAULT 60,
  allow_retake BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer')),
  prompt TEXT NOT NULL,
  options_json JSONB,
  correct_answer TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

-- Create quiz_attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers_json JSONB,
  score INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  UNIQUE(quiz_id, student_id)
);

-- Create enrollments table
CREATE TABLE enrollments (
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(student_id, course_id)
);

-- Create note_read_states table
CREATE TABLE note_read_states (
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(note_id, student_id)
);

-- Row Level Security policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_read_states ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile."
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Policies for courses
CREATE POLICY "Anyone can view published courses."
  ON courses FOR SELECT
  USING (published = true);
CREATE POLICY "Teachers can create and manage their own courses."
  ON courses FOR ALL
  USING (auth.uid() = teacher_id);

-- Policies for notes
CREATE POLICY "Anyone can view published notes of published courses."
  ON notes FOR SELECT
  USING (
    published = true AND
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = notes.course_id AND c.published = true
    )
  );
CREATE POLICY "Teachers can manage notes for their own courses."
  ON notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = notes.course_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for worksheets
CREATE POLICY "Students can view worksheets for enrolled courses."
  ON worksheets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = worksheets.course_id AND e.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = worksheets.course_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage worksheets for their own courses."
  ON worksheets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = worksheets.course_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for submissions
CREATE POLICY "Students can view and create their own submissions."
  ON submissions FOR SELECT
  USING (student_id = auth.uid());
CREATE POLICY "Students can insert their own submissions."
  ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can view and update submissions for their courses."
  ON submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM worksheets w
      JOIN courses c ON w.course_id = c.id
      WHERE w.id = submissions.worksheet_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for quizzes
CREATE POLICY "Students can view quizzes for enrolled courses."
  ON quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = quizzes.course_id AND e.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage quizzes for their own courses."
  ON quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for questions
CREATE POLICY "Students can view questions for enrolled courses' quizzes."
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN enrollments e ON q.course_id = e.course_id
      WHERE q.id = questions.quiz_id AND e.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = questions.quiz_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can manage questions for their own courses' quizzes."
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = questions.quiz_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for quiz_attempts
CREATE POLICY "Students can manage their own quiz attempts."
  ON quiz_attempts FOR ALL
  USING (student_id = auth.uid());

-- Policies for enrollments
CREATE POLICY "Students can manage their own enrollments."
  ON enrollments FOR ALL
  USING (student_id = auth.uid());
CREATE POLICY "Teachers can view enrollments for their courses."
  ON enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id AND c.teacher_id = auth.uid()
    )
  );

-- Policies for note_read_states
CREATE POLICY "Students can manage their own note read states."
  ON note_read_states FOR ALL
  USING (student_id = auth.uid());

-- Create a trigger for new users (improved version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

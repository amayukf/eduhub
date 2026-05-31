export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Still here for backwards compatibility, not used for Supabase
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  teacher_id: string; // Changed to snake_case for Supabase
  title: string;
  subject: string;
  grade: string;
  description: string;
  cover_image?: string;
  published: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  course_id: string;
  title: string;
  content_html: string;
  week: number;
  unit: string;
  published: boolean;
  created_at: string;
}

export interface Worksheet {
  id: string;
  course_id: string;
  title: string;
  description: string;
  pdf_url?: string;
  due_date: string;
  created_at: string;
}

export interface Submission {
  id: string;
  worksheet_id: string;
  student_id: string;
  file_url?: string;
  grade?: number;
  feedback?: string;
  submitted_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  time_limit_mins: number;
  passing_score: number;
  allow_retake: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  prompt: string;
  options_json?: string | any; // Can be JSON string or parsed object
  correct_answer: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  answers_json?: string | any;
  score?: number;
  started_at: string;
  submitted_at?: string;
}

export interface Enrollment {
  student_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface NoteReadState {
  note_id: string;
  student_id: string;
  read_at: string;
}

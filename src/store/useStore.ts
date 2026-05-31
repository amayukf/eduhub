import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import {
  User,
  Course,
  Note,
  Worksheet,
  Submission,
  Quiz,
  Question,
  QuizAttempt,
  Enrollment,
  NoteReadState,
  UserRole,
} from '../types';

interface Store {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  notes: Note[];
  worksheets: Worksheet[];
  submissions: Submission[];
  quizzes: Quiz[];
  questions: Question[];
  quizAttempts: QuizAttempt[];
  enrollments: Enrollment[];
  noteReadStates: NoteReadState[];
  darkMode: boolean;
  loading: boolean;

  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  toggleDarkMode: () => void;

  fetchAllData: () => Promise<void>;

  addCourse: (course: Omit<Course, 'id' | 'created_at'>) => Promise<string | null>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  addNote: (note: Omit<Note, 'id' | 'created_at'>) => Promise<string | null>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  markNoteAsRead: (noteId: string, studentId: string) => Promise<void>;

  addWorksheet: (worksheet: Omit<Worksheet, 'id' | 'created_at'>) => Promise<string | null>;
  updateWorksheet: (id: string, updates: Partial<Worksheet>) => Promise<void>;
  deleteWorksheet: (id: string) => Promise<void>;

  addSubmission: (submission: Omit<Submission, "id">) => Promise<string | null>;
  updateSubmission: (id: string, updates: Partial<Submission>) => Promise<void>;

  addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at'>) => Promise<string | null>;
  updateQuiz: (id: string, updates: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;

  addQuestion: (question: Omit<Question, 'id'>) => Promise<string | null>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;

  addQuizAttempt: (attempt: Omit<QuizAttempt, 'id'>) => Promise<string | null>;
  updateQuizAttempt: (id: string, updates: Partial<QuizAttempt>) => Promise<void>;

  enrollStudent: (studentId: string, courseId: string) => Promise<void>;
  addSampleData: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      courses: [],
      notes: [],
      worksheets: [],
      submissions: [],
      quizzes: [],
      questions: [],
      quizAttempts: [],
      enrollments: [],
      noteReadStates: [],
      darkMode: false,
      loading: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      login: async (email: string, password: string) => {
        console.log('Attempting login...');
        const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          console.error('Auth login error:', authError);
          throw new Error(authError.message);
        }
        if (!authUser) {
          console.error('No user returned from login');
          return null;
        }

        console.log('Fetching profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        if (profileError) {
          console.error('Profile error:', profileError);
          throw new Error(profileError.message);
        }

        const user: User = {
          id: profile.id,
          name: profile.name,
          email: authUser.email || '',
          passwordHash: '', // Not needed anymore
          role: profile.role,
          avatar: profile.avatar_url,
          createdAt: profile.created_at,
        };

        set({ currentUser: user });
        await get().fetchAllData();
        return user;
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        console.log('Attempting registration...');
        const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role }
          }
        });
        if (authError) {
          console.error('Auth registration error:', authError);
          throw new Error(authError.message);
        }
        if (!authUser) {
          console.error('No user returned from registration');
          return null;
        }

        console.log('User created, getting or creating profile...');
        // Wait for profile to be created via trigger, or create it ourselves
        await new Promise(resolve => setTimeout(resolve, 1000));

        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        // If profile doesn't exist yet, create it manually
        if (profileError && profileError.code === 'PGRST116') {
          console.log('Profile not found, creating manually...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: authUser.id, name, role }])
            .select('*')
            .single();
          if (insertError) {
            console.error('Profile insert error:', insertError);
            throw new Error(insertError.message);
          }
          profile = newProfile;
        } else if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error(profileError.message);
        }

        const user: User = {
          id: profile.id,
          name: profile.name,
          email: authUser.email || '',
          passwordHash: '', // Not needed anymore
          role: profile.role,
          avatar: profile.avatar_url,
          createdAt: profile.created_at,
        };

        set({ currentUser: user });
        await get().fetchAllData();
        return user;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null, courses: [], notes: [], worksheets: [], submissions: [], quizzes: [], questions: [], quizAttempts: [], enrollments: [], noteReadStates: [] });
      },

      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      fetchAllData: async () => {
        set({ loading: true });
        try {
          const { data: courses } = await supabase.from('courses').select('*');
          const { data: notes } = await supabase.from('notes').select('*');
          const { data: worksheets } = await supabase.from('worksheets').select('*');
          const { data: submissions } = await supabase.from('submissions').select('*');
          const { data: quizzes } = await supabase.from('quizzes').select('*');
          const { data: questions } = await supabase.from('questions').select('*');
          const { data: quizAttempts } = await supabase.from('quiz_attempts').select('*');
          const { data: enrollments } = await supabase.from('enrollments').select('*');
          const { data: noteReadStates } = await supabase.from('note_read_states').select('*');

          set({
            courses: courses || [],
            notes: notes || [],
            worksheets: worksheets || [],
            submissions: submissions || [],
            quizzes: quizzes || [],
            questions: questions || [],
            quizAttempts: quizAttempts || [],
            enrollments: enrollments || [],
            noteReadStates: noteReadStates || [],
            loading: false,
          });
        } catch (err) {
          console.error('Failed to fetch data:', err);
          set({ loading: false });
        }
      },

      addCourse: async (course) => {
        const { data, error } = await supabase.from('courses').insert([course]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateCourse: async (id, updates) => {
        await supabase.from('courses').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      deleteCourse: async (id) => {
        await supabase.from('courses').delete().eq('id', id);
        await get().fetchAllData();
      },

      addNote: async (note) => {
        const { data, error } = await supabase.from('notes').insert([note]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateNote: async (id, updates) => {
        await supabase.from('notes').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      deleteNote: async (id) => {
        await supabase.from('notes').delete().eq('id', id);
        await get().fetchAllData();
      },

      markNoteAsRead: async (noteId, studentId) => {
        await supabase.from('note_read_states').upsert([{ note_id: noteId, student_id: studentId }]);
        await get().fetchAllData();
      },

      addWorksheet: async (worksheet) => {
        const { data, error } = await supabase.from('worksheets').insert([worksheet]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateWorksheet: async (id, updates) => {
        await supabase.from('worksheets').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      deleteWorksheet: async (id) => {
        await supabase.from('worksheets').delete().eq('id', id);
        await get().fetchAllData();
      },

      addSubmission: async (submission) => {
        const { data, error } = await supabase.from('submissions').insert([submission]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateSubmission: async (id, updates) => {
        await supabase.from('submissions').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      addQuiz: async (quiz) => {
        const { data, error } = await supabase.from('quizzes').insert([quiz]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateQuiz: async (id, updates) => {
        await supabase.from('quizzes').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      deleteQuiz: async (id) => {
        await supabase.from('quizzes').delete().eq('id', id);
        await get().fetchAllData();
      },

      addQuestion: async (question) => {
        const { data, error } = await supabase.from('questions').insert([question]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateQuestion: async (id, updates) => {
        await supabase.from('questions').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      deleteQuestion: async (id) => {
        await supabase.from('questions').delete().eq('id', id);
        await get().fetchAllData();
      },

      addQuizAttempt: async (attempt) => {
        const { data, error } = await supabase.from('quiz_attempts').upsert([attempt]).select('id').single();
        if (error) return null;
        await get().fetchAllData();
        return data.id;
      },

      updateQuizAttempt: async (id, updates) => {
        await supabase.from('quiz_attempts').update(updates).eq('id', id);
        await get().fetchAllData();
      },

      enrollStudent: async (studentId, courseId) => {
        await supabase.from('enrollments').upsert([{ student_id: studentId, course_id: courseId }]);
        await get().fetchAllData();
      },

      addSampleData: async () => {
        const currentUser = get().currentUser;
        if (!currentUser || currentUser.role !== 'teacher') return;

        // Add sample course
        const { data: course } = await supabase.from('courses').insert([{
          teacher_id: currentUser.id,
          title: 'Mathematics 101',
          subject: 'Mathematics',
          grade: 10,
          description: 'Introduction to basic algebra and geometry',
          published: true,
        }]).select('id').single();

        if (course) {
          // Add sample note
          await supabase.from('notes').insert([{
            course_id: course.id,
            title: 'Introduction to Algebra',
            week: 1,
            unit: 'Unit 1',
            content_html: '<h1>Welcome to Algebra</h1><p>This is your first lesson on basic algebraic expressions.</p>',
            published: true,
          }]);

          // Add sample worksheet
          const { data: worksheet } = await supabase.from('worksheets').insert([{
            course_id: course.id,
            title: 'Algebra Practice Worksheet',
            description: 'Practice solving linear equations',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            file_url: null,
          }]).select('id').single();

          if (worksheet) {
            // Add sample quiz
            const { data: quiz } = await supabase.from('quizzes').insert([{
              course_id: course.id,
              title: 'Algebra Basics Quiz',
              time_limit_mins: 30,
              passing_score: 60,
              allow_retake: true,
            }]).select('id').single();

            if (quiz) {
              // Add sample questions
              await supabase.from('questions').insert([
                {
                  quiz_id: quiz.id,
                  type: 'multiple-choice',
                  prompt: 'What is 2 + 2?',
                  options_json: JSON.stringify(['3', '4', '5', '6']),
                  correct_answer: '4',
                  order: 1,
                },
                {
                  quiz_id: quiz.id,
                  type: 'true-false',
                  prompt: 'The sum of two even numbers is always even.',
                  options_json: JSON.stringify(['true', 'false']),
                  correct_answer: 'true',
                  order: 2,
                },
                {
                  quiz_id: quiz.id,
                  type: 'short-answer',
                  prompt: 'What is the square root of 16?',
                  options_json: JSON.stringify([]),
                  correct_answer: '4',
                  order: 3,
                },
              ]);
            }
          }
        }

        await get().fetchAllData();
      },
    }),
    {
      name: 'lms-storage',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);

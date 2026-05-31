import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { BookOpen, FileText, HelpCircle, CheckCircle, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const notes = useStore((state) => state.notes);
  const worksheets = useStore((state) => state.worksheets);
  const submissions = useStore((state) => state.submissions);
  const quizzes = useStore((state) => state.quizzes);
  const quizAttempts = useStore((state) => state.quizAttempts);
  const enrollments = useStore((state) => state.enrollments);
  const noteReadStates = useStore((state) => state.noteReadStates);

  const studentEnrollments = enrollments.filter((e) => e.student_id === currentUser?.id);
  const enrolledCourses = courses.filter((c) =>
    studentEnrollments.some((e) => e.course_id === c.id)
  );
  const studentSubmissions = submissions.filter((s) => s.student_id === currentUser?.id);
  const upcomingWorksheets = worksheets.filter((w) =>
    enrolledCourses.some((c) => c.id === w.course_id) &&
    !studentSubmissions.some((s) => s.worksheet_id === w.id)
  ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const gradedSubmissions = studentSubmissions.filter((s) => s.grade !== undefined);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);
  const studentQuizAttempts = quizAttempts.filter(a => 
    a.student_id === currentUser?.id && 
    a.submitted_at && 
    quizzes.some(q => q.id === a.quiz_id && enrolledCourseIds.includes(q.course_id))
  );
  const averageQuizScore = studentQuizAttempts.length > 0
    ? Math.round(studentQuizAttempts.reduce((acc, a) => acc + (a.score || 0), 0) / studentQuizAttempts.length)
    : null;

  return (
    <Sidebar role="student">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Continue your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">My Courses</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{enrolledCourses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Work</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{upcomingWorksheets.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Graded</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{gradedSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Quiz Score</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">
                  {averageQuizScore !== null ? `${averageQuizScore}%` : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingWorksheets.slice(0, 5).map((ws) => (
                <div key={ws.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{ws.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Due: {new Date(ws.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white mb-4">My Courses</h2>
            <div className="space-y-4">
              {enrolledCourses.map((course) => {
                const courseNotes = notes.filter((n) => n.course_id === course.id);
                const readNotes = courseNotes.filter((n) =>
                  noteReadStates.some((s) => s.note_id === n.id && s.student_id === currentUser?.id)
                );
                const progress = courseNotes.length > 0 ? Math.round((readNotes.length / courseNotes.length) * 100) : 0;

                return (
                  <div key={course.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Progress</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default StudentDashboard;

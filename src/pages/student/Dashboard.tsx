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
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-cream-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-850 dark:text-white">
            Welcome back, {currentUser?.name}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg">
            Continue your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">My Courses</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{enrolledCourses.length}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending Work</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{upcomingWorksheets.length}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Graded</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{gradedSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Average Quiz Score</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">
                  {averageQuizScore !== null ? `${averageQuizScore}%` : '-'}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-slate-850 dark:text-white mb-5">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {upcomingWorksheets.slice(0, 5).map((ws) => (
                <div key={ws.id} className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-cream-50 dark:from-slate-700 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                  <Clock className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{ws.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Due: {new Date(ws.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingWorksheets.length === 0 && (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-lg">No upcoming deadlines!</p>
                  <p className="text-sm mt-1">Great job staying on top of your work!</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-slate-850 dark:text-white mb-5">My Courses</h2>
            <div className="space-y-4">
              {enrolledCourses.map((course) => {
                const courseNotes = notes.filter((n) => n.course_id === course.id);
                const readNotes = courseNotes.filter((n) =>
                  noteReadStates.some((s) => s.note_id === n.id && s.student_id === currentUser?.id)
                );
                const progress = courseNotes.length > 0 ? Math.round((readNotes.length / courseNotes.length) * 100) : 0;

                return (
                  <div key={course.id} className="p-5 bg-gradient-to-br from-slate-50 to-cream-50 dark:from-slate-700 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3">{course.title}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Progress</span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {enrolledCourses.length === 0 && (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-lg">No courses enrolled yet!</p>
                  <p className="text-sm mt-1">Go to Courses to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default StudentDashboard;

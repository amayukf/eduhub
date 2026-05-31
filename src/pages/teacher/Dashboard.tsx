import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { Users, BookOpen, FileText, TrendingUp, Activity, Plus, RefreshCw } from 'lucide-react';

const TeacherDashboard = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const submissions = useStore((state) => state.submissions);
  const worksheets = useStore((state) => state.worksheets);
  const enrollments = useStore((state) => state.enrollments);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const addSampleData = useStore((state) => state.addSampleData);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingSample, setIsAddingSample] = useState(false);

  const teacherCourses = courses.filter((c) => c.teacher_id === currentUser?.id);
  const teacherCourseIds = teacherCourses.map((c) => c.id);
  const totalStudents = new Set(
    enrollments.filter((e) => teacherCourseIds.includes(e.course_id)).map((e) => e.student_id)
  ).size;
  const pendingSubmissions = submissions.filter((s) => 
    s.grade === undefined && teacherCourseIds.includes(
      worksheets.find(w => w.id === s.worksheet_id)?.course_id || ''
    )
  ).length;
  const gradedSubmissions = submissions.filter((s) => s.grade !== undefined);
  const averageScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedSubmissions.length)
    : null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
  };

  const handleAddSampleData = async () => {
    setIsAddingSample(true);
    await addSampleData();
    setIsAddingSample(false);
  };

  return (
    <Sidebar role="teacher">
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-cream-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-64px)]">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-850 dark:text-white">
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg">
              Here's what's happening in your classes today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {teacherCourses.length === 0 && (
              <button
                onClick={handleAddSampleData}
                disabled={isAddingSample}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                {isAddingSample ? 'Adding...' : 'Add Sample Data'}
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-[1.02]"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Students</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Active Courses</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{teacherCourses.length}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending Submissions</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">{pendingSubmissions}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Average Score</p>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-850 dark:text-white mt-2">
                  {averageScore !== null ? `${averageScore}%` : '-'}
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-slate-850 dark:text-white mb-5">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mt-1">
                  <Activity className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">Get started by creating a course!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Go to Courses to add your first class</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-slate-850 dark:text-white mb-5">Your Courses</h2>
            <div className="space-y-3">
              {teacherCourses.map((course) => (
                <div key={course.id} className="p-5 bg-gradient-to-br from-slate-50 to-cream-50 dark:from-slate-700 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{course.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{course.subject} • Grade {course.grade}</p>
                </div>
              ))}
              {teacherCourses.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No courses yet</p>
                  <p className="text-sm">Create your first course to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default TeacherDashboard;

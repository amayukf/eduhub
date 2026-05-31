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
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-850 dark:text-white">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Here's what's happening in your classes today.
            </p>
          </div>
          <div className="flex gap-2">
            {teacherCourses.length === 0 && (
              <button
                onClick={handleAddSampleData}
                disabled={isAddingSample}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                {isAddingSample ? 'Adding...' : 'Add Sample Data'}
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Courses</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{teacherCourses.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Submissions</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">{pendingSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Score</p>
                <p className="text-3xl font-bold text-slate-850 dark:text-white mt-1">
                  {averageScore !== null ? `${averageScore}%` : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mt-1">
                  <Activity className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200">Get started by creating a course!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Go to Courses to add your first class</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white mb-4">Your Courses</h2>
            <div className="space-y-3">
              {teacherCourses.map((course) => (
                <div key={course.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{course.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{course.subject} • Grade {course.grade}</p>
                </div>
              ))}
              {teacherCourses.length === 0 && (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No courses yet</p>
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

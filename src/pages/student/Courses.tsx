import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { BookOpen, CheckCircle } from 'lucide-react';

const StudentCourses = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const enrollments = useStore((state) => state.enrollments);
  const enrollStudent = useStore((state) => state.enrollStudent);

  const publishedCourses = courses.filter((c) => c.published);
  const studentEnrollments = enrollments.filter((e) => e.student_id === currentUser?.id);
  const enrolledCourseIds = studentEnrollments.map((e) => e.course_id);

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const handleEnroll = async (courseId: string) => {
    if (currentUser?.id && !isEnrolled(courseId)) {
      await enrollStudent(currentUser.id, courseId);
    }
  };

  return (
    <Sidebar role="student">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Courses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Browse and enroll in courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-850 dark:text-white">{course.title}</h3>
                    {enrolled && (
                      <span className="text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    {course.subject} • Grade {course.grade}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{course.description}</p>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolled}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      enrolled
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {enrolled ? 'Enrolled' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
};

export default StudentCourses;

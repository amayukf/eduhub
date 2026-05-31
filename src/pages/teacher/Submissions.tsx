import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const TeacherSubmissions = () => {
  const currentUser = useStore((state) => state.currentUser);
  const users = useStore((state) => state.users);
  const courses = useStore((state) => state.courses);
  const worksheets = useStore((state) => state.worksheets);
  const submissions = useStore((state) => state.submissions);
  const updateSubmission = useStore((state) => state.updateSubmission);

  const teacherCourses = courses.filter((c) => c.teacher_id === currentUser?.id);
  const teacherWorksheets = worksheets.filter((w) =>
    teacherCourses.some((c) => c.id === w.course_id)
  );
  const allSubmissions = submissions.filter((s) =>
    teacherWorksheets.some((w) => w.id === s.worksheet_id)
  );

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [grade, setGrade] = useState<number | undefined>(undefined);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const getStudentName = (studentId: string) =>
    users.find((u) => u.id === studentId)?.name || 'Unknown Student';

  const getWorksheetTitle = (worksheetId: string) =>
    worksheets.find((w) => w.id === worksheetId)?.title || 'Unknown Worksheet';

  const handleGrade = (submission: any) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade);
    setFeedback(submission.feedback || '');
  };

  const saveGrade = async () => {
    if (selectedSubmission) {
      setLoading(true);
      await updateSubmission(selectedSubmission.id, { grade, feedback });
      setSelectedSubmission(null);
      setLoading(false);
    }
  };

  return (
    <Sidebar role="teacher">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Submissions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Grade student submissions</p>
        </div>

        <div className="space-y-4">
          {allSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-850 dark:text-white">{getStudentName(submission.student_id)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {getWorksheetTitle(submission.worksheet_id)} • Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {submission.grade !== undefined ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">{submission.grade}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Pending</span>
                  </div>
                )}
                  <button
                    onClick={() => handleGrade(submission)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {submission.grade !== undefined ? 'Edit Grade' : 'Grade'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-850 dark:text-white">Grade Submission</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {getStudentName(selectedSubmission.student_id)} • {getWorksheetTitle(selectedSubmission.worksheet_id)}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Grade (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none resize-none"
                    placeholder="Enter feedback for the student"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveGrade}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Save Grade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TeacherSubmissions;

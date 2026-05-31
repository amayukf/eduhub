import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { FileText, UploadCloud, CheckCircle, Clock } from 'lucide-react';

const StudentWorksheets = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const worksheets = useStore((state) => state.worksheets);
  const submissions = useStore((state) => state.submissions);
  const enrollments = useStore((state) => state.enrollments);
  const addSubmission = useStore((state) => state.addSubmission);

  const studentEnrollments = enrollments.filter((e) => e.student_id === currentUser?.id);
  const enrolledCourseIds = studentEnrollments.map((e) => e.course_id);
  const availableWorksheets = worksheets.filter((w) =>
    enrolledCourseIds.includes(w.course_id)
  );
  const studentSubmissions = submissions.filter((s) => s.student_id === currentUser?.id);

  const [selectedWorksheet, setSelectedWorksheet] = useState<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStudentSubmission = (worksheetId: string) =>
    studentSubmissions.find((s) => s.worksheet_id === worksheetId);

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  const getStatus = (worksheetId: string) => {
    const submission = getStudentSubmission(worksheetId);
    if (!submission) return 'not-submitted';
    if (submission.grade !== undefined) return 'graded';
    return 'submitted';
  };

  const handleSubmit = async () => {
    if (selectedWorksheet) {
      setLoading(true);
      await addSubmission({
        worksheet_id: selectedWorksheet.id,
        student_id: currentUser?.id || '',
        submitted_at: new Date().toISOString(),
      });
      setShowSubmitModal(false);
      setSelectedWorksheet(null);
      setLoading(false);
    }
  };

  return (
    <Sidebar role="student">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Worksheets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">View and submit your assignments</p>
        </div>

        <div className="space-y-4">
          {availableWorksheets.map((ws) => {
            const status = getStatus(ws.id);
            const submission = getStudentSubmission(ws.id);
            return (
              <div
                key={ws.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-850 dark:text-white">{ws.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {getCourseName(ws.course_id)} • Due: {new Date(ws.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{ws.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {status === 'graded' && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">{submission?.grade}%</span>
                        </div>
                      )}
                      {status === 'submitted' && (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">Submitted</span>
                        </div>
                      )}
                      {status === 'not-submitted' && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">Not Submitted</span>
                        </div>
                      )}
                    </div>
                    {status === 'not-submitted' && (
                      <button
                        onClick={() => {
                          setSelectedWorksheet(ws);
                          setShowSubmitModal(true);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Submit
                      </button>
                    )}
                    {status === 'graded' && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg max-w-xs">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Feedback:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {submission?.feedback || 'No feedback provided'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showSubmitModal && selectedWorksheet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-850 dark:text-white">Submit Worksheet</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedWorksheet.title}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  <UploadCloud className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to upload your PDF</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedWorksheet(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Submit (Demo)
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

export default StudentWorksheets;

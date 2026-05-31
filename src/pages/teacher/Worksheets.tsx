import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { Plus, Edit, Trash2, FileText, UploadCloud } from 'lucide-react';

const TeacherWorksheets = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const worksheets = useStore((state) => state.worksheets);
  const addWorksheet = useStore((state) => state.addWorksheet);
  const updateWorksheet = useStore((state) => state.updateWorksheet);
  const deleteWorksheet = useStore((state) => state.deleteWorksheet);

  const teacherCourses = courses.filter((c) => c.teacher_id === currentUser?.id);
  const courseWorksheets = worksheets.filter((w) =>
    teacherCourses.some((c) => c.id === w.course_id)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorksheet, setEditingWorksheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    pdf_url: '',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingWorksheet) {
      await updateWorksheet(editingWorksheet.id, { ...formData, due_date: new Date(formData.due_date).toISOString() });
    } else {
      await addWorksheet({ ...formData, due_date: new Date(formData.due_date).toISOString() });
    }
    setIsModalOpen(false);
    setEditingWorksheet(null);
    setFormData({
      course_id: '',
      title: '',
      description: '',
      pdf_url: '',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setLoading(false);
  };

  const handleEdit = (worksheet: any) => {
    setEditingWorksheet(worksheet);
    setFormData({
      ...worksheet,
      due_date: new Date(worksheet.due_date).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  return (
    <Sidebar role="teacher">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Worksheets</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your PDF worksheets</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Worksheet
          </button>
        </div>

        <div className="space-y-4">
          {courseWorksheets.map((worksheet) => (
            <div
              key={worksheet.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-600 dark:text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-850 dark:text-white">{worksheet.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                      {getCourseName(worksheet.course_id)} • Due: {new Date(worksheet.due_date).toLocaleDateString()}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{worksheet.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(worksheet)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWorksheet(worksheet.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-850 dark:text-white">
                  {editingWorksheet ? 'Edit Worksheet' : 'Add New Worksheet'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Course
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="">Select a course</option>
                    {teacherCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Upload PDF (optional for demo)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                    <UploadCloud className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">Max 10MB</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingWorksheet(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {editingWorksheet ? 'Save Changes' : 'Create Worksheet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TeacherWorksheets;

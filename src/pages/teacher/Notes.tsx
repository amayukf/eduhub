import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TeacherNotes = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const notes = useStore((state) => state.notes);
  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);

  const teacherCourses = courses.filter((c) => c.teacher_id === currentUser?.id);
  const courseNotes = notes.filter((n) =>
    teacherCourses.some((c) => c.id === n.course_id)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    content_html: '',
    week: 1,
    unit: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content_html,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content_html: editor.getHTML() });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingNote) {
      await updateNote(editingNote.id, formData);
    } else {
      await addNote(formData);
    }
    setIsModalOpen(false);
    setEditingNote(null);
    setFormData({
      course_id: '',
      title: '',
      content_html: '',
      week: 1,
      unit: '',
      published: true,
    });
    editor?.commands.setContent('');
    setLoading(false);
  };

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setFormData({
      course_id: note.course_id,
      title: note.title,
      content_html: note.content_html,
      week: note.week,
      unit: note.unit,
      published: note.published,
    });
    setIsModalOpen(true);
    setTimeout(() => editor?.commands.setContent(note.content_html), 0);
  };

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  return (
    <Sidebar role="teacher">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Notes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Create and manage lecture notes</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Note
          </button>
        </div>

        <div className="space-y-4">
          {courseNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-850 dark:text-white">{note.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      note.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {note.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                    {getCourseName(note.course_id)} • Week {note.week} • {note.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setFormData({
                        course_id: note.course_id,
                        title: note.title,
                        content_html: note.content_html,
                        week: note.week,
                        unit: note.unit,
                        published: note.published,
                      });
                      setShowPreview(true);
                    }}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(isModalOpen || showPreview) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-850 dark:text-white">
                  {showPreview ? 'Preview Note' : editingNote ? 'Edit Note' : 'Add New Note'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowPreview(false);
                    setEditingNote(null);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              {showPreview ? (
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <h2 className="text-2xl font-bold mb-4 text-slate-850 dark:text-white">{formData.title}</h2>
                  <div
                    className="prose dark:prose-invert max-w-none font-serif"
                    dangerouslySetInnerHTML={{ __html: formData.content_html }}
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Week
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.week}
                        onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Unit
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="e.g., Unit 1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content
                    </label>
                    <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                      <div className="flex gap-1 p-2 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-amber-100 dark:bg-amber-900/30' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                          <strong>B</strong>
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-amber-100 dark:bg-amber-900/30' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                          <em>I</em>
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-amber-100 dark:bg-amber-900/30' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={`p-2 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-amber-100 dark:bg-amber-900/30' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                          H2
                        </button>
                      </div>
                      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published-note"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="published-note" className="text-sm text-slate-700 dark:text-slate-300">
                      Publish note
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingNote(null);
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
                      {editingNote ? 'Save Changes' : 'Create Note'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TeacherNotes;

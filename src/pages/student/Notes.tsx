import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { BookOpen, CheckCircle } from 'lucide-react';

const StudentNotes = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const notes = useStore((state) => state.notes);
  const enrollments = useStore((state) => state.enrollments);
  const noteReadStates = useStore((state) => state.noteReadStates);
  const markNoteAsRead = useStore((state) => state.markNoteAsRead);

  const studentEnrollments = enrollments.filter((e) => e.student_id === currentUser?.id);
  const enrolledCourseIds = studentEnrollments.map((e) => e.course_id);
  const availableNotes = notes.filter((n) =>
    n.published && enrolledCourseIds.includes(n.course_id)
  );

  const [selectedNote, setSelectedNote] = useState<any>(null);

  const isRead = (noteId: string) =>
    noteReadStates.some((s) => s.note_id === noteId && s.student_id === currentUser?.id);

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  const handleViewNote = async (note: any) => {
    setSelectedNote(note);
    if (!isRead(note.id)) {
      await markNoteAsRead(note.id, currentUser?.id || '');
    }
  };

  const groupNotesByCourse = () => {
    const grouped: { [key: string]: any[] } = {};
    availableNotes.forEach((note) => {
      if (!grouped[note.course_id]) grouped[note.course_id] = [];
      grouped[note.course_id].push(note);
    });
    return grouped;
  };

  const groupedNotes = groupNotesByCourse();

  return (
    <Sidebar role="student">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Lecture Notes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Read your course materials</p>
        </div>

        <div className="space-y-8">
          {Object.keys(groupedNotes).map((courseId) => (
            <div key={courseId}>
              <h2 className="text-xl font-bold text-slate-850 dark:text-white mb-4">{getCourseName(courseId)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedNotes[courseId].map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleViewNote(note)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                      </div>
                      {isRead(note.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-850 dark:text-white mb-1">{note.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Week {note.week} • {note.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedNote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-slate-850 dark:text-white">{selectedNote.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {getCourseName(selectedNote.course_id)} • Week {selectedNote.week} • {selectedNote.unit}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  ×
                </button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div
                  className="prose dark:prose-invert max-w-none font-serif leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedNote.content_html }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default StudentNotes;

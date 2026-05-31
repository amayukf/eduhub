import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { Plus, Edit, Trash2, HelpCircle, GripVertical } from 'lucide-react';

const TeacherQuizzes = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const quizzes = useStore((state) => state.quizzes);
  const questions = useStore((state) => state.questions);
  const addQuiz = useStore((state) => state.addQuiz);
  const updateQuiz = useStore((state) => state.updateQuiz);
  const deleteQuiz = useStore((state) => state.deleteQuiz);
  const addQuestion = useStore((state) => state.addQuestion);
  const updateQuestion = useStore((state) => state.updateQuestion);

  const teacherCourses = courses.filter((c) => c.teacher_id === currentUser?.id);
  const courseQuizzes = quizzes.filter((q) =>
    teacherCourses.some((c) => c.id === q.course_id)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quizFormData, setQuizFormData] = useState({
    course_id: '',
    title: '',
    time_limit_mins: 30,
    passing_score: 60,
    allow_retake: true,
  });
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let quizId;
    if (editingQuiz) {
      await updateQuiz(editingQuiz.id, quizFormData);
      quizId = editingQuiz.id;
    } else {
      quizId = await addQuiz(quizFormData);
    }
    for (const [index, q] of quizQuestions.entries()) {
      if (q.id) {
        await updateQuestion(q.id, { ...q, order: index + 1 });
      } else if (quizId) {
        await addQuestion({ ...q, quiz_id: quizId, order: index + 1 });
      }
    }
    setIsModalOpen(false);
    setEditingQuiz(null);
    setQuizFormData({
      course_id: '',
      title: '',
      time_limit_mins: 30,
      passing_score: 60,
      allow_retake: true,
    });
    setQuizQuestions([]);
    setLoading(false);
  };

  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setQuizFormData(quiz);
    setQuizQuestions(questions.filter((q) => q.quiz_id === quiz.id));
    setIsModalOpen(true);
  };

  const addQuestionForm = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        type: 'multiple-choice',
        prompt: '',
        options_json: JSON.stringify(['', '', '', '']),
        correct_answer: '',
      },
    ]);
  };

  const updateQuestionForm = (index: number, updates: any) => {
    const newQuestions = [...quizQuestions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuizQuestions(newQuestions);
  };

  const removeQuestionForm = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  return (
    <Sidebar role="teacher">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Quizzes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Create and manage quizzes</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Quiz
          </button>
        </div>

        <div className="space-y-4">
          {courseQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-850 dark:text-white">{quiz.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                      {getCourseName(quiz.course_id)} • {quiz.time_limit_mins} mins • Passing: {quiz.passing_score}%
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {questions.filter((q) => q.quiz_id === quiz.id).length} questions
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(quiz)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl my-8">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                <h2 className="text-2xl font-bold text-slate-850 dark:text-white">
                  {editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}
                </h2>
              </div>
              <form onSubmit={handleQuizSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Course
                    </label>
                    <select
                      required
                      value={quizFormData.course_id}
                      onChange={(e) => setQuizFormData({ ...quizFormData, course_id: e.target.value })}
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
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      required
                      value={quizFormData.title}
                      onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Time Limit (mins)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quizFormData.time_limit_mins}
                      onChange={(e) => setQuizFormData({ ...quizFormData, time_limit_mins: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={quizFormData.passing_score}
                      onChange={(e) => setQuizFormData({ ...quizFormData, passing_score: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={quizFormData.allow_retake}
                        onChange={(e) => setQuizFormData({ ...quizFormData, allow_retake: e.target.checked })}
                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Allow Retakes</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-850 dark:text-white">Questions</h3>
                    <button
                      type="button"
                      onClick={addQuestionForm}
                      className="flex items-center gap-2 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {quizQuestions.map((q, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-5 h-5 text-slate-400" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Question {index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestionForm(index)}
                            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestionForm(index, { type: e.target.value })}
                            className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Prompt
                          </label>
                          <input
                            type="text"
                            value={q.prompt}
                            onChange={(e) => updateQuestionForm(index, { prompt: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none"
                            placeholder="Enter your question"
                          />
                        </div>

                        {q.type === 'multiple-choice' && (
                          <>
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Options (one per line)
                              </label>
                              <textarea
                                value={JSON.parse(q.options_json || '[]').join('\n')}
                                onChange={(e) =>
                                  updateQuestionForm(index, {
                                    options_json: JSON.stringify(e.target.value.split('\n')),
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Correct Answer
                              </label>
                              <input
                                type="text"
                                value={q.correct_answer}
                                onChange={(e) => updateQuestionForm(index, { correct_answer: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none"
                                placeholder="Enter the exact correct option"
                              />
                            </div>
                          </>
                        )}

                        {q.type === 'true-false' && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Correct Answer
                            </label>
                            <select
                              value={q.correct_answer}
                              onChange={(e) => updateQuestionForm(index, { correct_answer: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none"
                            >
                              <option value="">Select</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        )}

                        {q.type === 'short-answer' && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Correct Answer
                            </label>
                            <input
                              type="text"
                              value={q.correct_answer}
                              onChange={(e) => updateQuestionForm(index, { correct_answer: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg outline-none"
                              placeholder="Enter the correct answer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingQuiz(null);
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
                    {editingQuiz ? 'Save Changes' : 'Create Quiz'}
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

export default TeacherQuizzes;

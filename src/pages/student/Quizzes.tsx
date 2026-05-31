import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import Sidebar from '../../components/Sidebar';
import { HelpCircle, Clock, CheckCircle } from 'lucide-react';

const StudentQuizzes = () => {
  const currentUser = useStore((state) => state.currentUser);
  const courses = useStore((state) => state.courses);
  const quizzes = useStore((state) => state.quizzes);
  const questions = useStore((state) => state.questions);
  const quizAttempts = useStore((state) => state.quizAttempts);
  const enrollments = useStore((state) => state.enrollments);
  const addQuizAttempt = useStore((state) => state.addQuizAttempt);
  const updateQuizAttempt = useStore((state) => state.updateQuizAttempt);

  const studentEnrollments = enrollments.filter((e) => e.student_id === currentUser?.id);
  const enrolledCourseIds = studentEnrollments.map((e) => e.course_id);
  const availableQuizzes = quizzes.filter((q) => enrolledCourseIds.includes(q.course_id));
  const studentQuizAttempts = quizAttempts.filter((a) => a.student_id === currentUser?.id);

  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Unknown Course';

  const getAttempt = (quizId: string) =>
    studentQuizAttempts.find((a) => a.quiz_id === quizId);

  const startQuiz = async (quiz: any) => {
    setLoading(true);
    const quizQuestions = questions
      .filter((q) => q.quiz_id === quiz.id)
      .sort((a, b) => a.order - b.order);
    setActiveQuiz(quiz);
    setActiveQuizQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quiz.time_limit_mins * 60);
    setShowResults(false);
    const newId = await addQuizAttempt({
      quiz_id: quiz.id,
      student_id: currentUser?.id || '',
      answers_json: JSON.stringify({}),
      started_at: new Date().toISOString(),
    });
    setAttemptId(newId);
    setLoading(false);
  };

  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && activeQuiz && !showResults) {
      submitQuiz();
    }
  }, [timeLeft, activeQuiz, showResults]);

  const selectAnswer = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setLoading(true);
    let correctCount = 0;
    activeQuizQuestions.forEach((q, index) => {
      if (answers[index]?.toLowerCase() === q.correct_answer?.toLowerCase()) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / activeQuizQuestions.length) * 100);
    if (attemptId) {
      await updateQuizAttempt(attemptId, {
        answers_json: JSON.stringify(answers),
        score,
        submitted_at: new Date().toISOString(),
      });
    }
    setShowResults(true);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeQuiz) {
    return (
      <div className="flex min-h-screen bg-cream-50 dark:bg-slate-900">
        <div className="flex-1 max-w-4xl mx-auto p-8">
          {showResults ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Quiz Complete!</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{activeQuiz.title}</p>
              </div>
              <div className="text-center mb-8">
                <p className="text-6xl font-bold text-amber-500">
                  {Object.values(answers).filter((a, i) => a?.toLowerCase() === activeQuizQuestions[i]?.correct_answer?.toLowerCase()).length}
                  <span className="text-2xl text-slate-400">/{activeQuizQuestions.length}</span>
                </p>
                <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">
                  {Math.round(
                    (Object.values(answers).filter(
                      (a, i) => a?.toLowerCase() === activeQuizQuestions[i]?.correct_answer?.toLowerCase()
                    ).length /
                      activeQuizQuestions.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="space-y-4 mb-8">
                {activeQuizQuestions.map((q, index) => {
                  const isCorrect =
                    answers[index]?.toLowerCase() === q.correct_answer?.toLowerCase();
                  return (
                    <div key={index} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{index + 1}. {q.prompt}</p>
                      <p className={`text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Your answer: {answers[index] || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">Correct answer: {q.correct_answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setShowResults(false);
                }}
                className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold"
              >
                Back to Quizzes
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-850 dark:text-white">{activeQuiz.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{getCourseName(activeQuiz.course_id)}</p>
                </div>
                <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200">
                  <Clock className="w-8 h-8" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-850 dark:text-white mb-6">
                    {activeQuizQuestions[currentQuestionIndex]?.prompt}
                  </h2>

                  {activeQuizQuestions[currentQuestionIndex]?.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      {JSON.parse(activeQuizQuestions[currentQuestionIndex]?.options_json || '[]').map((option: string, optIndex: number) => (
                        <button
                          key={optIndex}
                          onClick={() => selectAnswer(currentQuestionIndex, option)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                            answers[currentQuestionIndex] === option
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeQuizQuestions[currentQuestionIndex]?.type === 'true-false' && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => selectAnswer(currentQuestionIndex, 'true')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                          answers[currentQuestionIndex] === 'true'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => selectAnswer(currentQuestionIndex, 'false')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                          answers[currentQuestionIndex] === 'false'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        False
                      </button>
                    </div>
                  )}

                  {activeQuizQuestions[currentQuestionIndex]?.type === 'short-answer' && (
                    <textarea
                      value={answers[currentQuestionIndex] || ''}
                      onChange={(e) => selectAnswer(currentQuestionIndex, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-500 dark:bg-slate-700"
                      rows={4}
                    />
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0 || loading}
                    className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {currentQuestionIndex === activeQuizQuestions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      disabled={loading}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={loading}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Sidebar role="student">
      <div className="flex-1 p-8 bg-cream-50 dark:bg-slate-900 min-h-[calc(100vh-64px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-850 dark:text-white">Quizzes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Take your quizzes and see results</p>
        </div>

        <div className="space-y-4">
          {availableQuizzes.map((quiz) => {
            const attempt = getAttempt(quiz.id);
            return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-850 dark:text-white">{quiz.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {getCourseName(quiz.course_id)} • {quiz.time_limit_mins} mins • {questions.filter((q) => q.quiz_id === quiz.id).length} questions
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Passing score: {quiz.passing_score}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {attempt?.submitted_at && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-500">{attempt.score ?? 0}%</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {(attempt.score ?? 0) >= quiz.passing_score ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    )}
                    {(!attempt?.submitted_at || quiz.allow_retake) && (
                      <button
                        onClick={() => startQuiz(quiz)}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {attempt?.submitted_at ? 'Retake' : 'Start Quiz'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
};

export default StudentQuizzes;

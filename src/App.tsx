import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import TeacherNotes from './pages/teacher/Notes';
import TeacherWorksheets from './pages/teacher/Worksheets';
import TeacherQuizzes from './pages/teacher/Quizzes';
import TeacherSubmissions from './pages/teacher/Submissions';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentNotes from './pages/student/Notes';
import StudentWorksheets from './pages/student/Worksheets';
import StudentQuizzes from './pages/student/Quizzes';
import Navbar from './components/Navbar';
import { useEffect } from 'react';

const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: 'teacher' | 'student';
}) => {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <>
            <Navbar />
            <LoginPage />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <RegisterPage />
          </>
        } />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute role="teacher">
              <TeacherCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/notes"
          element={
            <ProtectedRoute role="teacher">
              <TeacherNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/worksheets"
          element={
            <ProtectedRoute role="teacher">
              <TeacherWorksheets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quizzes"
          element={
            <ProtectedRoute role="teacher">
              <TeacherQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/submissions"
          element={
            <ProtectedRoute role="teacher">
              <TeacherSubmissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute role="student">
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notes"
          element={
            <ProtectedRoute role="student">
              <StudentNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/worksheets"
          element={
            <ProtectedRoute role="student">
              <StudentWorksheets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quizzes"
          element={
            <ProtectedRoute role="student">
              <StudentQuizzes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

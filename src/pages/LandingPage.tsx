import { Link } from 'react-router-dom';
import { BookOpen, FileText, TrendingUp, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-850 dark:text-white mb-6">
            Empower Your <span className="text-amber-600 dark:text-amber-500">Learning Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            A modern, all-in-one platform for teachers and students to create, share, and excel together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Get Started as Student
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-slate-800 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Log In as Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-850 dark:text-white mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-cream-50 dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Rich Course Materials
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Create engaging notes with our rich text editor, organized by courses and units.
              </p>
            </div>
            <div className="p-6 bg-cream-50 dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                PDF Worksheets
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Upload, assign, and grade PDF worksheets with ease.
              </p>
            </div>
            <div className="p-6 bg-cream-50 dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Interactive Quizzes
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Build quizzes with multiple question types and auto-grading.
              </p>
            </div>
            <div className="p-6 bg-cream-50 dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Easy Collaboration
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Streamlined communication and feedback between teachers and students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Join thousands of teachers and students already using EduHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">EduHub</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EduHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

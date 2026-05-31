import { Link } from 'react-router-dom';
import { BookOpen, FileText, TrendingUp, Users, CheckCircle2, Zap, Award, GraduationCap } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-amber-700 dark:text-amber-400 font-medium text-sm">New Features Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-850 dark:text-white mb-6 leading-tight">
            Empower Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500">
              Learning Journey
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
            A beautiful, modern, all-in-one platform for teachers and students to create, share, and excel together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started as Student
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/login"
              className="group bg-white dark:bg-slate-800 text-slate-850 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-lg"
            >
              Log In as Teacher
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Instant Setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-850 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools designed to make teaching and learning seamless and enjoyable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                color: 'blue',
                title: 'Rich Course Materials',
                description: 'Create engaging notes with our rich text editor, perfectly organized by courses and units.',
              },
              {
                icon: FileText,
                color: 'purple',
                title: 'PDF Worksheets',
                description: 'Upload, assign, and grade PDF worksheets with ease and provide valuable feedback.',
              },
              {
                icon: TrendingUp,
                color: 'green',
                title: 'Interactive Quizzes',
                description: 'Build quizzes with multiple question types and enjoy automatic grading.',
              },
              {
                icon: Users,
                color: 'amber',
                title: 'Easy Collaboration',
                description: 'Streamlined communication and feedback between teachers and students.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-gradient-to-br from-white to-cream-50 dark:from-slate-700 dark:to-slate-800 rounded-3xl border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-500`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Courses Created' },
              { number: '200K+', label: 'Quizzes Taken' },
              { number: '99%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-extrabold text-amber-600 dark:text-amber-500 mb-2">
                  {stat.number}
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)', backgroundSize: '50px 50px' }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <Award className="w-16 h-16 text-yellow-300" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-amber-100 text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of happy teachers and students already using EduHub to transform their education experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="group bg-white text-amber-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-amber-50 transition-all hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6" />
                    Sign Up Free
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                EduHub
              </span>
            </div>
            <div className="flex gap-8">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors font-medium">
                Log In
              </Link>
              <Link to="/register" className="text-slate-400 hover:text-white transition-colors font-medium">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} EduHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

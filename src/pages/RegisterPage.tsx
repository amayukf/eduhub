import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import { BookOpen, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(name, email, password, 'student');
      if (user) {
        navigate('/student');
      } else {
        setError('Failed to create account');
      }
    } catch (err: any) {
      console.error('Error in register form:', err);
      setError(err.message || 'Failed to create account');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center pt-20 pb-8 px-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl mb-4 shadow-lg">
              <BookOpen className="w-10 h-10 text-amber-600 dark:text-amber-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white">Join EduHub</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create your student account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-amber-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-amber-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-500"
                placeholder="you@school.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-amber-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-500"
                placeholder="••••••••"
              />
            </div>

            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Creating an account as a <span className="font-bold">Student</span>.
                <br />
                <span className="text-xs mt-1 block text-slate-600 dark:text-slate-400">
                  Teachers: Please contact the administrator to create your account.
                </span>
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-3 rounded-xl border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

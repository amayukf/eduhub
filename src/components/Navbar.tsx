import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BookOpen, LogOut, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={currentUser ? (currentUser.role === 'teacher' ? '/teacher' : '/student') : '/'}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              EduHub
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            
            {currentUser ? (
              <div className="flex items-center gap-4 pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

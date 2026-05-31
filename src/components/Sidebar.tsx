import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import Navbar from './Navbar';

interface SidebarProps {
  role: 'teacher' | 'student';
  children: React.ReactNode;
}

const Sidebar = ({ role, children }: SidebarProps) => {
  const location = useLocation();
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const darkMode = useStore((state) => state.darkMode);

  const teacherLinks = [
    { path: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teacher/courses', label: 'Courses', icon: BookOpen },
    { path: '/teacher/notes', label: 'Notes', icon: FileText },
    { path: '/teacher/worksheets', label: 'Worksheets', icon: ClipboardList },
    { path: '/teacher/quizzes', label: 'Quizzes', icon: HelpCircle },
    { path: '/teacher/submissions', label: 'Submissions', icon: ClipboardList },
  ];

  const studentLinks = [
    { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/courses', label: 'Courses', icon: BookOpen },
    { path: '/student/notes', label: 'Notes', icon: FileText },
    { path: '/student/worksheets', label: 'Worksheets', icon: ClipboardList },
    { path: '/student/quizzes', label: 'Quizzes', icon: HelpCircle },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-64 bg-white dark:bg-slate-800 min-h-[calc(100vh-64px)] border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-850 dark:text-white">EduHub</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Sidebar;

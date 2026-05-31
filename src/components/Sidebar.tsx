import { useState } from 'react';
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
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-white to-cream-50 dark:from-slate-800 dark:to-slate-900
          border-r border-slate-200 dark:border-slate-700
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-0 lg:pt-0
        `} style={{ marginTop: '64px', top: 0, height: 'calc(100vh - 64px)' }}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between lg:justify-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">EduHub</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 lg:hidden"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:translate-x-1'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="font-semibold">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-[1.02]"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="bg-gradient-to-r from-slate-50 to-cream-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-[1.02] font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          {/* Mobile Toggle Button */}
          <div className="lg:hidden sticky top-0 z-30 p-4 bg-cream-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
              <span className="font-semibold">Menu</span>
            </button>
          </div>
          {children}
        </main>
      </div>
    </>
  );
};

export default Sidebar;

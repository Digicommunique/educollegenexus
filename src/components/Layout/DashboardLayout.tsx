import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  GraduationCap,
  Library,
  UserCheck,
  ClipboardList,
  BarChart3,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT', 'PRINCIPAL', 'ACCOUNTANT', 'LIBRARIAN', 'STAFF'] },
  { title: 'Colleges', icon: GraduationCap, path: '/colleges', roles: ['SUPER_ADMIN'] },
  { title: 'Admissions', icon: UserPlus, path: '/admissions', roles: ['COLLEGE_ADMIN', 'PRINCIPAL'] },
  { title: 'Students', icon: Users, path: '/students', roles: ['COLLEGE_ADMIN', 'FACULTY', 'PRINCIPAL'] },
  { title: 'Faculty', icon: UserCheck, path: '/faculty', roles: ['COLLEGE_ADMIN', 'PRINCIPAL'] },
  { title: 'Courses', icon: BookOpen, path: '/courses', roles: ['COLLEGE_ADMIN', 'FACULTY', 'STUDENT', 'PRINCIPAL'] },
  { title: 'Attendance', icon: ClipboardList, path: '/attendance', roles: ['FACULTY', 'STUDENT', 'COLLEGE_ADMIN'] },
  { title: 'Exams', icon: FileText, path: '/exams', roles: ['FACULTY', 'STUDENT', 'COLLEGE_ADMIN'] },
  { title: 'Paper Setter', icon: FileText, path: '/paper-setter', roles: ['FACULTY', 'COLLEGE_ADMIN'] },
  { title: 'Fees', icon: CreditCard, path: '/fees', roles: ['ACCOUNTANT', 'STUDENT', 'COLLEGE_ADMIN'] },
  { title: 'Library', icon: Library, path: '/library', roles: ['LIBRARIAN', 'STUDENT', 'FACULTY'] },
  { title: 'Reports', icon: BarChart3, path: '/reports', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'PRINCIPAL'] },
  { title: 'Settings', icon: Settings, path: '/settings', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'] },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [settings] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_nexus_general_settings');
      return saved ? JSON.parse(saved) : { collegeName: 'EduNexus', logo: '' };
    } catch (e) {
      console.error('Error parsing settings from localStorage', e);
      return { collegeName: 'EduNexus', logo: '' };
    }
  });

  if (!user) return null;

  const filteredItems = SIDEBAR_ITEMS.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "bg-white border-r border-primary/10 transition-all duration-300 flex flex-col hidden lg:flex h-full",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <GraduationCap className="text-white w-6 h-6" />
            )}
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl text-primary truncate tracking-tight">
              {settings.collegeName.split(' ')[0]}
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-4">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                location.pathname === item.path 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-primary")} />
              {isSidebarOpen && <span className="font-bold text-sm">{item.title}</span>}
              {location.pathname === item.path && isSidebarOpen && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all w-full group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-primary/10 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-primary/5 rounded-xl transition-colors hidden lg:block text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 hover:bg-primary/5 rounded-xl transition-colors lg:hidden text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-11 pr-4 py-2.5 bg-background border-none rounded-xl text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 hover:bg-primary/5 rounded-xl transition-colors relative text-slate-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <GraduationCap className="text-white w-6 h-6" />
                    )}
                  </div>
                  <span className="font-bold text-xl text-primary tracking-tight">
                    {settings.collegeName.split(' ')[0]}
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                      location.pathname === item.path 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 hover:bg-primary/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "text-slate-400")} />
                    <span className="font-bold text-sm">{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

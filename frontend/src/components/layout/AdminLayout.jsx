import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Users2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  UserCheck,
  UserPlus,
  Sliders,
  FileCode2,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  School,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, currentInstitute, currentBranch, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
        { name: 'Institutes & Campuses', path: '/institutes', icon: Building2 },
        { name: 'Academic Years', path: '/academics', icon: CalendarDays },
      ],
    },
    {
      title: 'ACADEMIC STRUCTURE',
      items: [
        { name: 'Classes & Sections', path: '/classes', icon: GraduationCap },
        { name: 'Subjects Catalog', path: '/subjects', icon: BookOpen },
      ],
    },
    {
      title: 'HUMAN CAPITAL',
      items: [
        { name: 'Staff & Employees', path: '/staff', icon: UserCheck },
        { name: 'Students & Admissions', path: '/students', icon: UserPlus },
        { name: 'Admission Inquiries', path: '/inquiries', icon: Sparkles },
      ],
    },
    {
      title: 'ACCESS & CONFIG',
      items: [
        { name: 'User Management', path: '/users', icon: Users2 },
        { name: 'Roles & Permissions', path: '/roles', icon: ShieldCheck },
        { name: 'System Settings', path: '/settings', icon: Sliders },
        { name: 'API Documentation', path: '/api-docs', icon: FileCode2 },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 z-30 select-none`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <School className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Apex Cloud ERP
                </span>
                <span className="text-[11px] text-indigo-400 font-medium">Phase 1 Foundation</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Campus Badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {currentBranch?.name || 'North Main Campus'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentInstitute?.name || 'Apex International'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      } ${!sidebarOpen && 'justify-center px-0'}`
                    }
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-indigo-400 capitalize truncate">{user?.user_type || 'Super Admin'}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden sm:inline text-slate-500">School ERP</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-medium text-slate-200 capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Session Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session: 2025-2026 (Active)</span>
            </div>

            {/* Swagger Documentation Button */}
            <NavLink
              to="/api-docs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 text-xs font-semibold transition"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">APIs & Swagger</span>
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

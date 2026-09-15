import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Avatar } from '../common/Avatar';
import {
  Sun,
  Moon,
  Search,
  ChevronDown,
  Plus,
  Briefcase,
  Menu,
  Check,
  User,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleMobileSidebar, onOpenCreateTaskModal }) => {
  const { user, logout } = useAuth();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 flex items-center justify-between gap-4">
      {/* Left side: Logo & Mobile Toggle & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {activeWorkspace ? activeWorkspace.name[0].toUpperCase() : 'W'}
            </div>
            <span className="max-w-[140px] truncate font-display">
              {activeWorkspace ? activeWorkspace.name : 'Select Workspace'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 animate-fade-in"
              onClick={() => setWorkspaceMenuOpen(false)}
            >
              <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Workspaces ({workspaces.length})
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {workspaces.map(w => (
                  <button
                    key={w._id}
                    onClick={() => switchWorkspace(w._id)}
                    className="w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate font-medium">{w.name}</span>
                    </div>
                    {activeWorkspace && activeWorkspace._id === w._id && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-1 mt-1 px-2">
                <Link
                  to="/workspaces"
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Manage / Create Workspace
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full relative">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search tasks, projects, tags... (Press Enter)"
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
      </form>

      {/* Right side Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Create Task */}
        {onOpenCreateTaskModal && (
          <button
            onClick={onOpenCreateTaskModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Center Dropdown */}
        <NotificationDropdown />

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
          </button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 animate-fade-in"
              onClick={() => setProfileMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">
                  System Role: {user?.role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  KanbanSquare,
  Calendar,
  BarChart3,
  Users,
  Shield,
  Settings,
  X,
  Layers
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const { workspaceRole } = useWorkspace();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Workspaces', to: '/workspaces', icon: Layers },
    { name: 'Projects', to: '/projects', icon: FolderKanban },
    { name: 'Tasks List', to: '/tasks', icon: CheckSquare },
    { name: 'Kanban Board', to: '/kanban', icon: KanbanSquare },
    { name: 'Calendar', to: '/calendar', icon: Calendar },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 }
  ];

  if (user?.role === 'Admin') {
    navigation.push({ name: 'Admin Panel', to: '/admin', icon: Shield });
  }

  const content = (
    <div className="h-full flex flex-col justify-between py-4">
      {/* Top Branding & Main Navigation */}
      <div className="space-y-6 px-3">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-3">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black font-display text-lg shadow-md shadow-blue-500/30">
              TS
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight font-display text-slate-900 dark:text-slate-100">
                TaskSphere
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 -mt-1">
                SaaS Enterprise
              </span>
            </div>
          </NavLink>
          {isMobileOpen && (
            <button onClick={onCloseMobile} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Workspace Role Indicator */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Workspace Role:</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
            {workspaceRole}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Quick Settings */}
      <div className="px-3 border-t border-slate-200 dark:border-slate-800 pt-4">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Profile & Settings</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 bg-white dark:bg-slate-900 h-full shadow-2xl z-10 animate-fade-in">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

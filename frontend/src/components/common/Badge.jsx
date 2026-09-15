import React from 'react';

export const Badge = ({ children, type = 'status', value = '', className = '' }) => {
  const getBadgeStyle = () => {
    const val = (value || children || '').toString().toLowerCase();

    if (type === 'priority') {
      switch (val) {
        case 'urgent': return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
        case 'high': return 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
        case 'medium': return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        case 'low': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        default: return 'bg-slate-100 text-slate-700';
      }
    }

    if (type === 'role') {
      switch (val) {
        case 'admin': return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
        case 'manager': return 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
        default: return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      }
    }

    // Status styling
    switch (val) {
      case 'completed':
      case 'active': return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'in progress': return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'review': return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'todo': return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'backlog':
      case 'on hold':
      case 'planning': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case 'archived': return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()} ${className}`}>
      {children || value}
    </span>
  );
};

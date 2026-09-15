import React from 'react';

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-sm transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

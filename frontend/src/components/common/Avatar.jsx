import React from 'react';

export const Avatar = ({ name = '', src = '', size = 'md', className = '' }) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-slate-800 ${sizes[size]} ${className}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-xs ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export const AvatarGroup = ({ users = [], max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visible.map((u, idx) => (
        <Avatar
          key={u._id || idx}
          name={u.name}
          src={u.avatar}
          size={size}
          className="border-2 border-white dark:border-slate-900"
        />
      ))}
      {extra > 0 && (
        <div
          className={`rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 ${size === 'xs' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8'}`}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

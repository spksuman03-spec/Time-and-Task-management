import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CalendarView = ({ tasks = [], onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  // Generate days based on current view mode
  const getDaysToRender = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else if (viewMode === 'week') {
      const startDate = startOfWeek(currentDate);
      const endDate = endOfWeek(startDate);
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      return [currentDate];
    }
  };

  const days = getDaysToRender();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[600px]">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            {format(currentDate, viewMode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={handlePrev} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleToday} className="px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
              Today
            </button>
            <button onClick={handleNext} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {['month', 'week', 'day'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                viewMode === mode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday Headers */}
      {viewMode !== 'day' && (
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-center py-2 text-xs font-semibold text-slate-400 uppercase">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      )}

      {/* Calendar Grid */}
      <div className={`grid flex-1 ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'} divide-x divide-y divide-slate-200 dark:divide-slate-800`}>
        {days.map((day, idx) => {
          const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={idx}
              className={`p-2 min-h-[100px] sm:min-h-[120px] flex flex-col ${
                !isCurrentMonth && viewMode === 'month' ? 'bg-slate-50/40 dark:bg-slate-950/40 opacity-50' : 'bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Day Tasks List */}
              <div className="space-y-1.5 overflow-y-auto flex-1 max-h-32">
                {dayTasks.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => onTaskClick(t)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] hover:shadow-sm cursor-pointer transition-all truncate"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {t.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>{t.taskId}</span>
                      <Badge type="priority" value={t.priority} className="text-[9px] px-1 py-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

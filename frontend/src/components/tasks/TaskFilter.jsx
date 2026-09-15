import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const TaskFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  projectFilter,
  onProjectChange,
  projects = [],
  sortBy,
  onSortChange
}) => {
  const statuses = ['All', 'Backlog', 'Todo', 'In Progress', 'Review', 'Completed'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xs">
      {/* Search & Select Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by task title, key ID, tag, or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.key})
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
        >
          <option value="">All Priorities</option>
          {priorities.filter(p => p !== 'All').map(p => (
            <option key={p} value={p}>{p} Priority</option>
          ))}
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent focus:outline-none"
          >
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
        <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Status:
        </span>
        {statuses.map(s => {
          const isSelected = (s === 'All' && !statusFilter) || statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s === 'All' ? '' : s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
};

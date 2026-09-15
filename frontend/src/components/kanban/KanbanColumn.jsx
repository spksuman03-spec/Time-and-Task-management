import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanColumn = ({ column, tasks = [], onTaskClick, onQuickAddTask }) => {
  const columnColors = {
    Backlog: 'bg-slate-400',
    Todo: 'bg-blue-500',
    'In Progress': 'bg-amber-500',
    Review: 'bg-purple-500',
    Completed: 'bg-emerald-500'
  };

  return (
    <div className="flex flex-col w-72 sm:w-80 shrink-0 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-full">
      {/* Column Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${columnColors[column.id] || 'bg-slate-400'}`} />
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 font-display">
            {column.title}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
            {tasks.length}
          </span>
        </div>

        {onQuickAddTask && (
          <button
            onClick={() => onQuickAddTask(column.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Droppable Task Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto min-h-[350px] transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
            }`}
          >
            {tasks.map((task, idx) => (
              <TaskCard
                key={task._id}
                task={task}
                index={idx}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

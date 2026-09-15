import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Calendar, CheckSquare, AlertCircle, Clock } from 'lucide-react';

export const TaskCard = ({ task, index, onClick }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const completedChecklistCount = (task.checklist || []).filter(c => c.completed).length;
  const totalChecklistCount = (task.checklist || []).length;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs mb-3 transition-all cursor-pointer select-none hover:shadow-md hover:border-blue-400/60 ${
            snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-blue-500 scale-105' : ''
          }`}
        >
          {/* Top row: Task Key ID & Priority */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 tracking-wider">
              {task.taskId}
            </span>
            <Badge type="priority" value={task.priority} />
          </div>

          {/* Title */}
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 font-sans leading-snug">
            {task.title}
          </h4>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row: Checklist progress, Due Date, Est. Hours, Assignee Avatar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              {totalChecklistCount > 0 && (
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-blue-500" />
                  {completedChecklistCount}/{totalChecklistCount}
                </span>
              )}

              {task.estimatedHours > 0 && (
                <span className="flex items-center gap-0.5 font-medium text-slate-400">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {task.estimatedHours}h
                </span>
              )}

              {task.dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-bold' : ''}`}>
                  {isOverdue ? <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" /> : <Calendar className="w-3 h-3" />}
                  {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            <Avatar name={task.assignee?.name} src={task.assignee?.avatar} size="xs" />
          </div>
        </div>
      )}
    </Draggable>
  );
};

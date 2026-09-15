import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AvatarGroup } from '../common/Avatar';
import { Calendar, CheckSquare, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ project, onEdit, onDelete, canManage }) => {
  return (
    <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all group">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: project.color || '#3b82f6' }}
            />
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
              {project.key}
            </span>
            <Badge type="status" value={project.status} />
          </div>

          {canManage && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <Link to={`/projects/${project._id}`}>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
        </Link>

        {project.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
            Task Completion
          </span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Footer Metadata & Members */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {project.dueDate ? new Date(project.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No due date'}
        </span>

        <AvatarGroup users={project.members || []} max={3} size="xs" />
      </div>
    </Card>
  );
};

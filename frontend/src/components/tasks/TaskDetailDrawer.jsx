import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { TaskComments } from './TaskComments';
import { taskService } from '../../services/taskService';
import { workspaceService } from '../../services/workspaceService';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import {
  Calendar,
  CheckSquare,
  Paperclip,
  Tag,
  Clock,
  User,
  FolderKanban,
  Edit2,
  Play,
  Send,
  CheckCircle,
  RotateCcw,
  UserPlus
} from 'lucide-react';

export const TaskDetailDrawer = ({ isOpen, onClose, taskId, onTaskUpdated, onOpenEditModal }) => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await taskService.getTaskById(taskId);
      setTask(res.data);

      if (activeWorkspace) {
        const wsRes = await workspaceService.getWorkspaceById(activeWorkspace._id);
        const team = (wsRes.data.members || []).map(m => m.user);
        setMembers(team);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      loadTask();
    }
  }, [isOpen, taskId]);

  const handleToggleChecklist = async (index) => {
    if (!task) return;
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      setTask({ ...task, checklist: updatedChecklist });
      await taskService.updateTask(task._id, { checklist: updatedChecklist });
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      addToast('Failed to update checklist item', 'error');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setTask({ ...task, status: newStatus });
      await taskService.updateTaskStatus(task._id, { status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    try {
      const selectedUser = members.find(m => m._id === newAssigneeId);
      setTask({ ...task, assignee: selectedUser || null });
      await taskService.updateTask(task._id, { assignee: newAssigneeId || null });
      addToast(newAssigneeId ? 'Assignee updated successfully' : 'Task unassigned', 'success');
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      addToast('Failed to update assignee', 'error');
    }
  };

  const handleClaimTask = async () => {
    if (!user) return;
    await handleAssigneeChange(user._id);
  };

  if (!isOpen) return null;

  const isAssignee = task && task.assignee && user && (task.assignee._id === user._id || task.assignee === user._id);
  const isCreatorOrAdmin = task && user && (task.createdBy?._id === user._id || task.createdBy === user._id || user.role === 'Admin');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? `${task.taskId}: ${task.title}` : 'Task Details'} maxWidth="max-w-3xl">
      {loading || !task ? (
        <div className="py-12 text-center text-slate-400">Loading task details...</div>
      ) : (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge type="status" value={task.status} />
              <Badge type="priority" value={task.priority} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Member Quick Workflow Action Buttons */}
              {!task.assignee && user && (
                <button
                  onClick={handleClaimTask}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Claim Task
                </button>
              )}

              {isAssignee && (task.status === 'Todo' || task.status === 'Backlog') && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Working
                </button>
              )}

              {isAssignee && task.status === 'In Progress' && (
                <button
                  onClick={() => handleStatusChange('Review')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Submit for Review
                </button>
              )}

              {/* Manager Quick Workflow Action Buttons */}
              {isCreatorOrAdmin && task.status === 'Review' && (
                <>
                  <button
                    onClick={() => handleStatusChange('Completed')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Complete
                  </button>

                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Request Revision
                  </button>
                </>
              )}

              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>

              {onOpenEditModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenEditModal(task);
                  }}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <FolderKanban className="w-3.5 h-3.5" /> Project
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {task.project?.name || 'Workspace'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" /> Assignee
              </span>
              <select
                value={task.assignee?._id || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Unassigned --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> Created
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {task.tags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                Sub-tasks Checklist ({task.checklist.filter(c => c.completed).length}/{task.checklist.length})
              </h4>

              <div className="space-y-1.5">
                {task.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(idx)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Comment Thread */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <TaskComments taskId={task._id} workspaceMembers={members} />
          </div>
        </div>
      )}
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import {
  CheckSquare,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  UserPlus,
  Layers
} from 'lucide-react';

export const TasksPage = () => {
  const { activeWorkspace, workspaceRole } = useWorkspace();
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const canCreateTask = user?.role === 'Admin' || user?.role === 'Manager' || workspaceRole === 'Admin' || workspaceRole === 'Manager';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Role Tabs: 'all' | 'my_tasks' | 'created_by_me'
  const [activeTab, setActiveTab] = useState('all');

  // Query params
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const taskIdParam = params.get('taskId');
    if (searchParam) setSearch(searchParam);
    if (taskIdParam) setSelectedTaskId(taskIdParam);
  }, [location]);

  const loadData = async () => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const queryParams = {
        search,
        status: statusFilter,
        priority: priorityFilter,
        project: projectFilter,
        sortBy,
        page,
        limit: 20
      };

      if (activeTab === 'my_tasks' && user) {
        queryParams.assignee = user._id;
      } else if (activeTab === 'created_by_me' && user) {
        queryParams.createdBy = user._id;
      }

      const [taskRes, prjRes] = await Promise.all([
        taskService.getTasks(queryParams),
        projectService.getProjects()
      ]);

      setTasks(taskRes.data || []);
      setTotalPages(taskRes.pages || 1);
      setProjects(prjRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWorkspace, search, statusFilter, priorityFilter, projectFilter, sortBy, page, activeTab]);

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(deletingTask._id);
      addToast('Task deleted', 'info');
      setDeletingTask(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-blue-500" />
            Task Repository
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, assign, and organize all workspace tasks.
          </p>
        </div>

        {canCreateTask && (
          <Button onClick={() => { setEditingTask(null); setCreateModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Create Task
          </Button>
        )}
      </div>

      {!canCreateTask && (
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Member Access:</strong> Task creation is managed by Workspace Admins & Managers. As a Member, you can view, update status, and complete checklist items for your assigned tasks.
          </span>
        </div>
      )}

      {/* Role-based Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => { setActiveTab('all'); setPage(1); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> All Tasks
        </button>

        <button
          onClick={() => { setActiveTab('my_tasks'); setPage(1); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'my_tasks'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> My Assigned Tasks
        </button>

        <button
          onClick={() => { setActiveTab('created_by_me'); setPage(1); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'created_by_me'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Created by Me
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <TaskFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        projectFilter={projectFilter}
        onProjectChange={setProjectFilter}
        projects={projects}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Task List Table */}
      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Tasks Matching Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or status filter to locate tasks.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-3.5">Task Key & Title</th>
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => setSelectedTaskId(t._id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400 text-[11px] shrink-0">{t.taskId}</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">{t.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                      {t.project?.name || 'Workspace'}
                    </td>
                    <td className="p-3.5">
                      <Badge type="status" value={t.status} />
                    </td>
                    <td className="p-3.5">
                      <Badge type="priority" value={t.priority} />
                    </td>
                    <td className="p-3.5">
                      {t.assignee ? (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Avatar name={t.assignee.name} src={t.assignee.avatar} size="xs" />
                          <span className="truncate">{t.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {t.dueDate ? (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 text-slate-400" />
                          {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingTask(t); setCreateModalOpen(true); }}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTask(t)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal & Drawer */}
      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        taskToEdit={editingTask}
        onTaskSaved={loadData}
      />

      <TaskDetailDrawer
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onTaskUpdated={loadData}
        onOpenEditModal={(t) => { setEditingTask(t); setCreateModalOpen(true); }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deletingTask?.title}" (${deletingTask?.taskId})?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { KanbanSquare, Plus, UserCheck, Layers } from 'lucide-react';

export const KanbanPage = () => {
  const { activeWorkspace, workspaceRole } = useWorkspace();
  const { user } = useAuth();

  const canCreateTask = user?.role === 'Admin' || user?.role === 'Manager' || workspaceRole === 'Admin' || workspaceRole === 'Manager';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMyTasks, setFilterMyTasks] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadTasks = async () => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const queryParams = { limit: 200 };
      if (filterMyTasks && user) {
        queryParams.assignee = user._id;
      }
      const res = await taskService.getTasks(queryParams);
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [activeWorkspace, filterMyTasks]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <KanbanSquare className="w-8 h-8 text-blue-500" />
            Interactive Kanban Board
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag cards between columns to update task execution status in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilterMyTasks(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                !filterMyTasks ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> All
            </button>
            <button
              onClick={() => setFilterMyTasks(true)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                filterMyTasks ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> My Tasks
            </button>
          </div>

          {canCreateTask && (
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4" /> New Task
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4">
          <Skeleton className="h-96 w-80" count={4} />
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          setTasks={setTasks}
          onTaskClick={(t) => setSelectedTaskId(t._id)}
          onQuickAddTask={canCreateTask ? () => setCreateModalOpen(true) : null}
        />
      )}

      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTaskSaved={loadTasks}
      />

      <TaskDetailDrawer
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onTaskUpdated={loadTasks}
      />
    </div>
  );
};

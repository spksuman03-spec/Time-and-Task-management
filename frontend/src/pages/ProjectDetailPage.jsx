import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { analyticsService } from '../services/analyticsService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AvatarGroup } from '../components/common/Avatar';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { Skeleton } from '../components/common/Skeleton';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  CheckSquare,
  KanbanSquare,
  Activity,
  Plus,
  Calendar,
  ArrowLeft,
  Clock
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const { workspaceRole } = useWorkspace();
  const { user } = useAuth();

  const canCreateTask = user?.role === 'Admin' || user?.role === 'Manager' || workspaceRole === 'Admin' || workspaceRole === 'Manager';

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tasks' | 'kanban' | 'activity'

  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [prjRes, taskRes, actRes] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks({ project: id }),
        analyticsService.getActivities({ project: id, limit: 20 })
      ]);

      setProject(prjRes.data);
      setTasks(taskRes.data || []);
      setActivities(actRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  if (loading || !project) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link & Top Header */}
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-white text-xl shadow-md shrink-0"
              style={{ backgroundColor: project.color || '#3b82f6' }}
            >
              {project.key}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge type="status" value={project.status} />
                <Badge type="priority" value={project.priority} />
              </div>
              <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AvatarGroup users={project.members || []} max={4} size="md" />
            {canCreateTask && (
              <Button onClick={() => setCreateTaskModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', name: 'Overview', icon: FolderKanban },
          { id: 'tasks', name: `Tasks (${tasks.length})`, icon: CheckSquare },
          { id: 'kanban', name: 'Kanban Board', icon: KanbanSquare },
          { id: 'activity', name: 'Activity Timeline', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 md:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Project Description & Scope
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {project.description || 'No detailed description provided.'}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Project Key</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">{project.key}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Created Date</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Due Date</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Task Execution Metrics
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">Overall Progress</span>
                  <span className="text-blue-600 font-bold">{project.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Total Tasks:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{project.totalTasks || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Completed Tasks:</span>
                  <span className="font-bold text-emerald-600">{project.completedTasks || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pending Tasks:</span>
                  <span className="font-bold text-amber-600">{project.pendingTasks || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <Card className="p-5">
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No tasks found for this project.</p>
            ) : (
              tasks.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTaskId(t._id)}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{t.taskId}</span>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{t.title}</h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge type="priority" value={t.priority} />
                    <Badge type="status" value={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {activeTab === 'kanban' && (
        <KanbanBoard
          tasks={tasks}
          setTasks={setTasks}
          onTaskClick={(t) => setSelectedTaskId(t._id)}
          onQuickAddTask={() => setCreateTaskModalOpen(true)}
        />
      )}

      {activeTab === 'activity' && (
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
            Project Audit Activity Log
          </h3>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No activity history for this project.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {act.user?.name ? act.user.name[0] : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200">
                      <span className="font-semibold">{act.user?.name}</span> {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {new Date(act.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Task Modal & Drawer */}
      <TaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onTaskSaved={loadProjectData}
      />

      <TaskDetailDrawer
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onTaskUpdated={loadProjectData}
      />
    </div>
  );
};

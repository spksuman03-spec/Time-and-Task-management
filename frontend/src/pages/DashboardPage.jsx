import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { taskService } from '../services/taskService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertCircle,
  Users,
  CheckCircle2,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

const DEFAULT_ANALYTICS = {
  summary: {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    teamMembersCount: 1,
    completionRate: 0
  },
  statusDistribution: [
    { name: 'Backlog', count: 0, color: '#64748b' },
    { name: 'Todo', count: 0, color: '#3b82f6' },
    { name: 'In Progress', count: 0, color: '#eab308' },
    { name: 'Review', count: 0, color: '#a855f7' },
    { name: 'Completed', count: 0, color: '#22c55e' }
  ],
  priorityDistribution: [
    { name: 'Low', count: 0, color: '#94a3b8' },
    { name: 'Medium', count: 0, color: '#3b82f6' },
    { name: 'High', count: 0, color: '#f97316' },
    { name: 'Urgent', count: 0, color: '#ef4444' }
  ],
  weeklyProductivity: [
    { day: 'Mon', completed: 0 },
    { day: 'Tue', completed: 0 },
    { day: 'Wed', completed: 0 },
    { day: 'Thu', completed: 0 },
    { day: 'Fri', completed: 0 },
    { day: 'Sat', completed: 0 },
    { day: 'Sun', completed: 0 }
  ],
  teamProductivity: []
};

export const DashboardPage = () => {
  const { activeWorkspace, loading: wsLoading } = useWorkspace();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const fetchDashboardData = async () => {
    if (!activeWorkspace) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [anRes, taskRes, actRes] = await Promise.allSettled([
        analyticsService.getDashboardAnalytics(),
        taskService.getTasks({ assignee: user?._id, limit: 5 }),
        analyticsService.getActivities({ limit: 10 })
      ]);

      if (anRes.status === 'fulfilled' && anRes.value?.data) {
        setAnalytics(anRes.value.data);
      } else {
        setAnalytics(DEFAULT_ANALYTICS);
      }

      if (taskRes.status === 'fulfilled') {
        setAssignedTasks(taskRes.value?.data || []);
      }

      if (actRes.status === 'fulfilled') {
        setActivities(actRes.value?.data || []);
      }
    } catch (err) {
      console.error('[Dashboard Load Error]', err);
      setAnalytics(DEFAULT_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeWorkspace) {
      fetchDashboardData();
    } else if (!wsLoading) {
      setLoading(false);
    }
  }, [activeWorkspace, wsLoading, user]);

  if (loading || wsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" count={4} />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const { summary, statusDistribution, priorityDistribution, weeklyProductivity } = analytics || DEFAULT_ANALYTICS;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl shadow-blue-600/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Workspace: {activeWorkspace?.name || 'My Workspace'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Here's what is happening across your projects today. You have{' '}
            <span className="font-bold underline">{summary.pendingTasks} pending tasks</span> and{' '}
            <span className="font-bold underline">{summary.overdueTasks} overdue</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center px-3 border-r border-white/20">
            <span className="block text-2xl font-bold font-display">{summary.completionRate}%</span>
            <span className="text-[10px] text-blue-100 font-semibold uppercase">Completion Rate</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-2xl font-bold font-display">{summary.completedTasks}</span>
            <span className="text-[10px] text-blue-100 font-semibold uppercase">Done Tasks</span>
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.totalProjects}</h3>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{summary.activeProjects} Active</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-2xl">
            <FolderKanban className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress Tasks</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.inProgressTasks}</h3>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{summary.pendingTasks} Total Pending</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.completedTasks}</h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{summary.completionRate}% Target</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Tasks</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.overdueTasks}</h3>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">Requires Attention</span>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Velocity Chart */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Weekly Task Productivity Velocity
              </h3>
              <p className="text-xs text-slate-400">Tasks completed over the last 7 days</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Task Status Distribution */}
        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Status Breakdown
            </h3>
            <p className="text-xs text-slate-400">Tasks grouped by execution state</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {statusDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Two Column Section: Assigned Tasks & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Assigned Tasks */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              My Assigned Tasks ({assignedTasks.length})
            </h3>
          </div>

          <div className="space-y-2">
            {assignedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No assigned tasks found.</p>
            ) : (
              assignedTasks.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTaskId(t._id)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{t.taskId}</span>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{t.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge type="priority" value={t.priority} />
                    <Badge type="status" value={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Workspace Activity Stream */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Recent Workspace Activity
            </h3>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activity recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-xs border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
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
      </div>

      {/* Task Details Drawer Modal */}
      <TaskDetailDrawer
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onTaskUpdated={fetchDashboardData}
      />
    </div>
  );
};

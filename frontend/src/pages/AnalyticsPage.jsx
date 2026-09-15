import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { analyticsService } from '../services/analyticsService';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle
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
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsPage = () => {
  const { activeWorkspace } = useWorkspace();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const res = await analyticsService.getDashboardAnalytics();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [activeWorkspace]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const { summary, statusDistribution, priorityDistribution, weeklyProductivity, teamProductivity } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          Workspace Analytics & Performance
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics, velocity tracking, and member productivity distribution.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Tasks</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.totalTasks}</h3>
          <span className="text-[11px] text-blue-600 font-medium">{summary.pendingTasks} Pending</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-400 font-semibold uppercase">Completed Tasks</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.completedTasks}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">{summary.completionRate}% Rate</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-400 font-semibold uppercase">In Progress</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.inProgressTasks}</h3>
          <span className="text-[11px] text-amber-600 font-medium">Active Execution</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <span className="text-xs text-slate-400 font-semibold uppercase">Overdue Tasks</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">{summary.overdueTasks}</h3>
          <span className="text-[11px] text-red-600 font-medium">Action Required</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Velocity */}
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            7-Day Task Completion Velocity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-500" />
            Task Priority Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Team Productivity per Member */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            Team Member Productivity Comparison (Assigned vs Completed)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamProductivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="assigned" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Assigned" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { taskService } from '../services/taskService';
import { CalendarView } from '../components/calendar/CalendarView';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { Skeleton } from '../components/common/Skeleton';
import { Calendar as CalendarIcon } from 'lucide-react';

export const CalendarPage = () => {
  const { activeWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadTasks = async () => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const res = await taskService.getTasks({ limit: 200 });
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [activeWorkspace]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-500" />
          Project & Task Calendar
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          View upcoming task deadlines and project milestones across Month, Week, and Day schedules.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <CalendarView
          tasks={tasks}
          onTaskClick={(t) => setSelectedTaskId(t._id)}
        />
      )}

      <TaskDetailDrawer
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onTaskUpdated={loadTasks}
      />
    </div>
  );
};

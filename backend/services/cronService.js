import cron from 'node-cron';
import Task from '../models/Task.js';
import { createNotification } from './notificationService.js';

export const startCronJobs = () => {
  // Run every hour to check upcoming & overdue deadlines
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron Job] Checking for approaching and overdue task deadlines...');
    await checkTaskDeadlines();
  });

  // Also run initial check on server startup (delayed by 10s)
  setTimeout(() => {
    checkTaskDeadlines();
  }, 10000);
};

const checkTaskDeadlines = async () => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

    // 1. Overdue tasks (dueDate < startOfDay and status != Completed)
    const overdueTasks = await Task.find({
      dueDate: { $lt: startOfDay },
      status: { $ne: 'Completed' },
      assignee: { $ne: null }
    }).populate('project');

    for (const task of overdueTasks) {
      await createNotification({
        recipient: task.assignee,
        type: 'TASK_OVERDUE',
        title: 'Task Overdue!',
        message: `Task "${task.title}" in project "${task.project ? task.project.name : 'Workspace'}" is overdue.`,
        link: `/tasks?taskId=${task._id}`,
        workspace: task.workspace
      });
    }

    // 2. Approaching deadlines (dueDate between now and endOfTomorrow and status != Completed)
    const approachingTasks = await Task.find({
      dueDate: { $gte: startOfDay, $lte: endOfTomorrow },
      status: { $ne: 'Completed' },
      assignee: { $ne: null }
    }).populate('project');

    for (const task of approachingTasks) {
      await createNotification({
        recipient: task.assignee,
        type: 'TASK_DEADLINE_APPROACHING',
        title: 'Deadline Approaching',
        message: `Task "${task.title}" is due soon (${task.dueDate.toLocaleDateString()}).`,
        link: `/tasks?taskId=${task._id}`,
        workspace: task.workspace
      });
    }
  } catch (error) {
    console.error('[Cron Job Error]', error);
  }
};

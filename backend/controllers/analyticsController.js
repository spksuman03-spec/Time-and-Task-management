import Project from '../models/Project.js';
import Task from '../models/Task.js';
import WorkspaceMember from '../models/WorkspaceMember.js';

// @desc    Get dashboard analytics metrics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const workspaceId = req.headers['x-workspace-id'] || req.query.workspace;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID required' });
    }

    const now = new Date();

    // Project metrics
    const totalProjects = await Project.countDocuments({ workspace: workspaceId });
    const activeProjects = await Project.countDocuments({ workspace: workspaceId, status: 'Active' });
    const completedProjects = await Project.countDocuments({ workspace: workspaceId, status: 'Completed' });

    // Task metrics
    const totalTasks = await Task.countDocuments({ workspace: workspaceId });
    const backlogTasks = await Task.countDocuments({ workspace: workspaceId, status: 'Backlog' });
    const todoTasks = await Task.countDocuments({ workspace: workspaceId, status: 'Todo' });
    const inProgressTasks = await Task.countDocuments({ workspace: workspaceId, status: 'In Progress' });
    const reviewTasks = await Task.countDocuments({ workspace: workspaceId, status: 'Review' });
    const completedTasks = await Task.countDocuments({ workspace: workspaceId, status: 'Completed' });

    const overdueTasks = await Task.countDocuments({
      workspace: workspaceId,
      dueDate: { $lt: now },
      status: { $ne: 'Completed' }
    });

    const pendingTasks = totalTasks - completedTasks;

    // Team members count
    const teamMembersCount = await WorkspaceMember.countDocuments({ workspace: workspaceId });

    // Task Priority distribution
    const lowPriority = await Task.countDocuments({ workspace: workspaceId, priority: 'Low' });
    const mediumPriority = await Task.countDocuments({ workspace: workspaceId, priority: 'Medium' });
    const highPriority = await Task.countDocuments({ workspace: workspaceId, priority: 'High' });
    const urgentPriority = await Task.countDocuments({ workspace: workspaceId, priority: 'Urgent' });

    // Status breakdown chart data
    const statusDistribution = [
      { name: 'Backlog', count: backlogTasks, color: '#64748b' },
      { name: 'Todo', count: todoTasks, color: '#3b82f6' },
      { name: 'In Progress', count: inProgressTasks, color: '#eab308' },
      { name: 'Review', count: reviewTasks, color: '#a855f7' },
      { name: 'Completed', count: completedTasks, color: '#22c55e' }
    ];

    // Priority breakdown chart data
    const priorityDistribution = [
      { name: 'Low', count: lowPriority, color: '#94a3b8' },
      { name: 'Medium', count: mediumPriority, color: '#3b82f6' },
      { name: 'High', count: highPriority, color: '#f97316' },
      { name: 'Urgent', count: urgentPriority, color: '#ef4444' }
    ];

    // Weekly Productivity Trend (Last 7 days completed tasks count)
    const weeklyProductivity = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const count = await Task.countDocuments({
        workspace: workspaceId,
        completedAt: { $gte: startOfDay, $lte: endOfDay }
      });

      const dayName = daysOfWeek[d.getDay()];
      weeklyProductivity.push({
        day: dayName,
        completed: count,
        date: `${d.getMonth() + 1}/${d.getDate()}`
      });
    }

    // Team Productivity (Tasks per member)
    const members = await WorkspaceMember.find({ workspace: workspaceId }).populate('user', 'name avatar');
    const teamProductivity = await Promise.all(members.map(async (m) => {
      if (!m.user) return null;
      const assigned = await Task.countDocuments({ workspace: workspaceId, assignee: m.user._id });
      const completed = await Task.countDocuments({ workspace: workspaceId, assignee: m.user._id, status: 'Completed' });
      return {
        name: m.user.name,
        assigned,
        completed,
        rate: assigned > 0 ? Math.round((completed / assigned) * 100) : 0
      };
    }));

    // Filter out any nulls
    const validTeamProductivity = teamProductivity.filter(Boolean);

    // Calculate Completion Rate & Avg Completion Time
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
          teamMembersCount,
          completionRate
        },
        statusDistribution,
        priorityDistribution,
        weeklyProductivity,
        teamProductivity: validTeamProductivity
      }
    });
  } catch (error) {
    next(error);
  }
};

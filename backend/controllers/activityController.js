import Activity from '../models/Activity.js';

// @desc    Get activity logs for a workspace/project/task
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const workspaceId = req.headers['x-workspace-id'] || req.query.workspace;
    const { project, task, limit = 50 } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID required' });
    }

    let query = { workspace: workspaceId };

    if (project) query.project = project;
    if (task) query.task = task;

    const activities = await Activity.find(query)
      .populate('user', 'name email avatar role')
      .populate('project', 'name key')
      .populate('task', 'title taskId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

import Activity from '../models/Activity.js';
import { emitToWorkspace } from './socketService.js';

export const logActivity = async ({ workspace, project = null, task = null, user, action, details }) => {
  try {
    const activity = await Activity.create({
      workspace,
      project,
      task,
      user,
      action,
      details
    });

    const populated = await Activity.findById(activity._id)
      .populate('user', 'name email avatar role');

    emitToWorkspace(workspace, 'activity_logged', populated);
    return populated;
  } catch (error) {
    console.error('[Activity Logging Error]', error);
  }
};

import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { createNotification } from '../services/notificationService.js';
import { logActivity } from '../services/activityService.js';
import { emitToWorkspace } from '../services/socketService.js';

// @desc    Get all comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
export const getTaskComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name email avatar role')
      .populate('mentions', 'name email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a task
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { taskId, content, parentComment } = req.body;

    if (!taskId || !content) {
      return res.status(400).json({ success: false, message: 'Task ID and comment content are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Parse @mentions in comment string (e.g. "@John Doe" or "@email@domain.com")
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_]+)/g;
    const matches = content.match(mentionRegex) || [];
    const mentionedUserIds = [];

    for (const match of matches) {
      const queryStr = match.substring(1);
      const user = await User.findOne({
        $or: [
          { email: queryStr },
          { name: { $regex: new RegExp(`^${queryStr}$`, 'i') } }
        ]
      });
      if (user) {
        mentionedUserIds.push(user._id);
      }
    }

    const comment = await Comment.create({
      task: task._id,
      user: req.user._id,
      content,
      mentions: mentionedUserIds,
      parentComment: parentComment || null
    });

    const populated = await Comment.findById(comment._id)
      .populate('user', 'name email avatar role')
      .populate('mentions', 'name email');

    // Notify task assignee if someone else comments
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: task.assignee,
        sender: req.user._id,
        type: 'COMMENT_ADDED',
        title: 'New Comment on Your Task',
        message: `${req.user.name} commented on "${task.title}"`,
        link: `/tasks?taskId=${task._id}`,
        workspace: task.workspace
      });
    }

    // Notify mentioned users
    for (const userId of mentionedUserIds) {
      await createNotification({
        recipient: userId,
        sender: req.user._id,
        type: 'USER_MENTIONED',
        title: 'You were mentioned in a comment',
        message: `${req.user.name} mentioned you in task "${task.title}"`,
        link: `/tasks?taskId=${task._id}`,
        workspace: task.workspace
      });
    }

    emitToWorkspace(task.workspace, 'comment_added', populated);

    await logActivity({
      workspace: task.workspace,
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: 'COMMENT_ADDED',
      details: `Added a comment on task "${task.title}"`
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership or Admin role
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: comment._id });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

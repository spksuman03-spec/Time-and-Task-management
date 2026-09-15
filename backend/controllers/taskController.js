import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Attachment from '../models/Attachment.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';
import { emitToWorkspace } from '../services/socketService.js';

// @desc    Get all tasks for a workspace with debounced search, filters & pagination
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const workspaceId = req.headers['x-workspace-id'] || req.query.workspace;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID required' });
    }

    const {
      project,
      status,
      priority,
      assignee,
      createdBy,
      search,
      tags,
      sortBy,
      order = 'desc',
      page = 1,
      limit = 100
    } = req.query;

    let query = { workspace: workspaceId };

    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;
    if (createdBy) query.createdBy = createdBy;

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagList };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { taskId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    if (sortBy === 'priority') {
      sortOptions.priority = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'dueDate') {
      sortOptions.dueDate = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sortOptions.title = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = order === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('project', 'name key color')
      .populate('assignee', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task details with attachments
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name key color members')
      .populate('assignee', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const attachments = await Attachment.find({ task: task._id }).populate('uploadedBy', 'name email avatar');

    res.json({
      success: true,
      data: {
        ...task.toObject(),
        attachments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task (Restricted to Admin & Manager)
// @route   POST /api/tasks
// @access  Private (Admin & Manager)
export const createTask = async (req, res, next) => {
  try {
    const isGlobalAdminOrManager = req.user && (req.user.role === 'Admin' || req.user.role === 'Manager');
    const isWorkspaceAdminOrManager = req.workspaceRole === 'Admin' || req.workspaceRole === 'Manager';

    if (!isGlobalAdminOrManager && !isWorkspaceAdminOrManager) {
      return res.status(403).json({
        success: false,
        message: 'Task creation is restricted to Admin and Manager roles only.'
      });
    }

    const { title, description, project, assignee, priority, status, startDate, dueDate, tags, checklist, estimatedHours } = req.body;
    const workspaceId = req.headers['x-workspace-id'] || req.body.workspace;

    if (!title || !project || !workspaceId) {
      return res.status(400).json({ success: false, message: 'Title, project, and workspace are required' });
    }

    const prj = await Project.findById(project);
    if (!prj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Auto-generate Task ID (e.g. PRJ-101)
    const taskCountInProject = await Task.countDocuments({ project: prj._id });
    const taskId = `${prj.key}-${taskCountInProject + 101}`;

    const task = await Task.create({
      taskId,
      title,
      description: description || '',
      project: prj._id,
      workspace: workspaceId,
      assignee: assignee || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'Todo',
      startDate: startDate || Date.now(),
      dueDate: dueDate || null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : 0,
      tags: Array.isArray(tags) ? tags : [],
      checklist: Array.isArray(checklist) ? checklist : []
    });

    const populated = await Task.findById(task._id)
      .populate('project', 'name key color')
      .populate('assignee', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    // Socket emit real-time event
    emitToWorkspace(workspaceId, 'task_created', populated);

    // Notification to assignee
    if (assignee) {
      await createNotification({
        recipient: assignee,
        sender: req.user._id,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}" (${task.taskId})`,
        link: `/tasks?taskId=${task._id}`,
        workspace: workspaceId
      });
    }

    await logActivity({
      workspace: workspaceId,
      project: prj._id,
      task: task._id,
      user: req.user._id,
      action: 'TASK_CREATED',
      details: `Created task "${task.title}" (${task.taskId})`
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details (General edit)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignee, priority, status, startDate, dueDate, tags, checklist, estimatedHours } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldAssignee = task.assignee ? task.assignee.toString() : null;
    const oldStatus = task.status;
    const oldPriority = task.priority;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (startDate) task.startDate = startDate;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = Number(estimatedHours) || 0;
    if (tags) task.tags = tags;
    if (checklist) task.checklist = checklist;
    if (assignee !== undefined) task.assignee = assignee || null;

    if (status) {
      task.status = status;
      if (status === 'Completed' && oldStatus !== 'Completed') {
        task.completedAt = new Date();
      } else if (status !== 'Completed') {
        task.completedAt = null;
      }
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('project', 'name key color')
      .populate('assignee', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    // Real-time broadcast
    emitToWorkspace(task.workspace, 'task_updated', populated);

    // Track activity & notifications for reassignment or status changes
    if (assignee && assignee.toString() !== oldAssignee) {
      await createNotification({
        recipient: assignee,
        sender: req.user._id,
        type: oldAssignee ? 'TASK_REASSIGNED' : 'TASK_ASSIGNED',
        title: oldAssignee ? 'Task Reassigned' : 'Task Assigned',
        message: `Task "${task.title}" was ${oldAssignee ? 'reassigned' : 'assigned'} to you`,
        link: `/tasks?taskId=${task._id}`,
        workspace: task.workspace
      });

      await logActivity({
        workspace: task.workspace,
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: 'TASK_REASSIGNED',
        details: `Assigned task "${task.title}" (${task.taskId})`
      });
    }

    if (status && status !== oldStatus) {
      await logActivity({
        workspace: task.workspace,
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: 'TASK_STATUS_CHANGED',
        details: `Moved "${task.title}" from ${oldStatus} to ${status}`
      });

      // Role-aware status notifications
      if (status === 'Review' && task.createdBy && task.createdBy.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.createdBy,
          sender: req.user._id,
          type: 'TASK_UPDATED',
          title: 'Task Submitted for Review',
          message: `Task "${task.title}" (${task.taskId}) was submitted for review`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      } else if (status === 'Completed' && oldStatus === 'Review' && task.assignee && task.assignee.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.assignee,
          sender: req.user._id,
          type: 'TASK_COMPLETED',
          title: 'Task Approved & Completed',
          message: `Task "${task.title}" (${task.taskId}) was approved by manager`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      } else if (status === 'In Progress' && oldStatus === 'Review' && task.assignee && task.assignee.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.assignee,
          sender: req.user._id,
          type: 'TASK_UPDATED',
          title: 'Revision Requested',
          message: `Manager requested revision on task "${task.title}" (${task.taskId})`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      }
    }

    if (priority && priority !== oldPriority) {
      await logActivity({
        workspace: task.workspace,
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: 'TASK_PRIORITY_CHANGED',
        details: `Changed priority of "${task.title}" to ${priority}`
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status & position (For Kanban Drag-and-Drop)
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, orderPosition } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = status;
    if (orderPosition !== undefined) {
      task.orderPosition = orderPosition;
    }

    if (status === 'Completed' && oldStatus !== 'Completed') {
      task.completedAt = new Date();
    } else if (status !== 'Completed') {
      task.completedAt = null;
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('project', 'name key color')
      .populate('assignee', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    emitToWorkspace(task.workspace, 'task_status_changed', populated);

    if (oldStatus !== status) {
      await logActivity({
        workspace: task.workspace,
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: 'TASK_STATUS_CHANGED',
        details: `Moved task "${task.title}" from ${oldStatus} to ${status}`
      });

      if (status === 'Review' && task.createdBy && task.createdBy.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.createdBy,
          sender: req.user._id,
          type: 'TASK_UPDATED',
          title: 'Task Submitted for Review',
          message: `Task "${task.title}" (${task.taskId}) was submitted for review`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      } else if (status === 'Completed' && oldStatus === 'Review' && task.assignee && task.assignee.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.assignee,
          sender: req.user._id,
          type: 'TASK_COMPLETED',
          title: 'Task Approved & Completed',
          message: `Task "${task.title}" (${task.taskId}) was approved by manager`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      } else if (status === 'In Progress' && oldStatus === 'Review' && task.assignee && task.assignee.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.assignee,
          sender: req.user._id,
          type: 'TASK_UPDATED',
          title: 'Revision Requested',
          message: `Manager requested revision on task "${task.title}" (${task.taskId})`,
          link: `/tasks?taskId=${task._id}`,
          workspace: task.workspace
        });
      }
    }

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const workspaceId = task.workspace;
    const taskId = task.taskId;
    const taskTitle = task.title;

    await Attachment.deleteMany({ task: task._id });
    await Task.deleteOne({ _id: task._id });

    emitToWorkspace(workspaceId, 'task_deleted', { id: task._id });

    await logActivity({
      workspace: workspaceId,
      project: task.project,
      user: req.user._id,
      action: 'TASK_DELETED',
      details: `Deleted task "${taskTitle}" (${taskId})`
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

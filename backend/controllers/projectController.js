import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

// @desc    Get all projects for a workspace
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const workspaceId = req.headers['x-workspace-id'] || req.query.workspace;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID required' });
    }

    const { status, priority, search } = req.query;
    let query = { workspace: workspaceId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role')
      .sort({ createdAt: -1 });

    // Compute live progress percentage based on completed tasks count for each project
    const projectsWithMetrics = await Promise.all(projects.map(async (prj) => {
      const totalTasks = await Task.countDocuments({ project: prj._id });
      const completedTasks = await Task.countDocuments({ project: prj._id, status: 'Completed' });
      const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : prj.progress;

      return {
        ...prj.toObject(),
        totalTasks,
        completedTasks,
        progress: calculatedProgress
      };
    }));

    res.json({
      success: true,
      count: projectsWithMetrics.length,
      data: projectsWithMetrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details with task overview
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({ project: project._id, status: 'Completed' });
    const pendingTasks = totalTasks - completedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        pendingTasks,
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin / Manager)
export const createProject = async (req, res, next) => {
  try {
    const { name, key, description, priority, status, startDate, dueDate, members, color } = req.body;
    const workspaceId = req.headers['x-workspace-id'] || req.body.workspace;

    if (!name || !key || !workspaceId) {
      return res.status(400).json({ success: false, message: 'Project name, key, and workspace are required' });
    }

    const formattedKey = key.toUpperCase().trim();
    const existingKey = await Project.findOne({ workspace: workspaceId, key: formattedKey });
    if (existingKey) {
      return res.status(400).json({ success: false, message: `Project key "${formattedKey}" already exists in this workspace` });
    }

    const projectMembers = Array.isArray(members) ? members : [req.user._id];
    if (!projectMembers.includes(req.user._id.toString())) {
      projectMembers.push(req.user._id);
    }

    const project = await Project.create({
      name,
      key: formattedKey,
      description: description || '',
      workspace: workspaceId,
      owner: req.user._id,
      members: projectMembers,
      priority: priority || 'Medium',
      status: status || 'Active',
      startDate: startDate || Date.now(),
      dueDate: dueDate || null,
      color: color || '#3b82f6'
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    // Notify project members
    for (const memberId of projectMembers) {
      await createNotification({
        recipient: memberId,
        sender: req.user._id,
        type: 'PROJECT_ADDED',
        title: 'New Project Created',
        message: `You were added to new project "${project.name}" (${project.key})`,
        link: `/projects/${project._id}`,
        workspace: workspaceId
      });
    }

    await logActivity({
      workspace: workspaceId,
      project: project._id,
      user: req.user._id,
      action: 'PROJECT_CREATED',
      details: `Created project "${project.name}" [${project.key}]`
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private (Admin / Manager)
export const updateProject = async (req, res, next) => {
  try {
    const { name, description, priority, status, startDate, dueDate, members, color } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (priority) project.priority = priority;
    if (color) project.color = color;
    if (startDate) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (members) project.members = members;

    const oldStatus = project.status;
    if (status && status !== oldStatus) {
      project.status = status;
      await logActivity({
        workspace: project.workspace,
        project: project._id,
        user: req.user._id,
        action: 'PROJECT_STATUS_CHANGED',
        details: `Project status changed from ${oldStatus} to ${status}`
      });
    }

    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or Archive Project
// @route   DELETE /api/projects/:id
// @access  Private (Admin / Manager)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated tasks and activities
    await Task.deleteMany({ project: project._id });
    await Project.deleteOne({ _id: project._id });

    await logActivity({
      workspace: project.workspace,
      user: req.user._id,
      action: 'PROJECT_DELETED',
      details: `Deleted project "${project.name}" [${project.key}] and all related tasks`
    });

    res.json({
      success: true,
      message: 'Project and associated tasks deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

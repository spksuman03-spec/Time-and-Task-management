import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import User from '../models/User.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

// @desc    Get all workspaces accessible by current user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (req, res, next) => {
  try {
    let memberships;
    if (req.user.role === 'Admin') {
      // Platform Admins have visibility into all workspaces
      const allWorkspaces = await Workspace.find().populate('owner', 'name email avatar');
      return res.json({
        success: true,
        data: allWorkspaces.map(w => ({
          workspace: w,
          role: 'Admin'
        }))
      });
    }

    memberships = await WorkspaceMember.find({ user: req.user._id })
      .populate({
        path: 'workspace',
        populate: { path: 'owner', select: 'name email avatar' }
      });

    res.json({
      success: true,
      data: memberships.map(m => ({
        workspace: m.workspace,
        role: m.role,
        joinedAt: m.joinedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private (Admin / Manager)
export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Workspace name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    const workspace = await Workspace.create({
      name,
      slug,
      description: description || '',
      icon: icon || 'briefcase',
      owner: req.user._id
    });

    await WorkspaceMember.create({
      workspace: workspace._id,
      user: req.user._id,
      role: 'Admin'
    });

    await logActivity({
      workspace: workspace._id,
      user: req.user._id,
      action: 'WORKSPACE_CREATED',
      details: `Created workspace "${workspace.name}"`
    });

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: workspace
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workspace details with member list
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('owner', 'name email avatar');
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const members = await WorkspaceMember.find({ workspace: workspace._id })
      .populate('user', 'name email avatar role isActive');

    res.json({
      success: true,
      data: {
        ...workspace.toObject(),
        members
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite / Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private (Workspace Admin / Manager)
export const inviteMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.id;

    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ success: false, message: `No user found with email: ${email}` });
    }

    const existingMember = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: userToInvite._id
    });

    if (existingMember) {
      return res.status(400).json({ success: false, message: 'User is already a member of this workspace' });
    }

    const memberRole = role && ['Admin', 'Manager', 'Member'].includes(role) ? role : 'Member';

    const member = await WorkspaceMember.create({
      workspace: workspaceId,
      user: userToInvite._id,
      role: memberRole
    });

    const populated = await WorkspaceMember.findById(member._id).populate('user', 'name email avatar role');

    const workspace = await Workspace.findById(workspaceId);

    await createNotification({
      recipient: userToInvite._id,
      sender: req.user._id,
      type: 'WORKSPACE_INVITE',
      title: 'Added to Workspace',
      message: `You were added to workspace "${workspace.name}" as ${memberRole}`,
      link: `/workspaces`,
      workspace: workspaceId
    });

    await logActivity({
      workspace: workspaceId,
      user: req.user._id,
      action: 'MEMBER_ADDED',
      details: `Added ${userToInvite.name} (${email}) as ${memberRole}`
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workspace member role
// @route   PUT /api/workspaces/:id/members/:memberId/role
// @access  Private (Workspace Admin)
export const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id: workspaceId, memberId } = req.params;

    if (!['Admin', 'Manager', 'Member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid workspace role' });
    }

    const member = await WorkspaceMember.findOne({ workspace: workspaceId, _id: memberId });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Workspace member record not found' });
    }

    member.role = role;
    await member.save();

    const populated = await WorkspaceMember.findById(member._id).populate('user', 'name email avatar role');

    await logActivity({
      workspace: workspaceId,
      user: req.user._id,
      action: 'MEMBER_ROLE_UPDATED',
      details: `Updated role for ${populated.user.name} to ${role}`
    });

    res.json({
      success: true,
      message: `Member role updated to ${role}`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:memberId
// @access  Private (Workspace Admin)
export const removeMember = async (req, res, next) => {
  try {
    const { id: workspaceId, memberId } = req.params;

    const member = await WorkspaceMember.findOne({ workspace: workspaceId, _id: memberId }).populate('user');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (workspace.owner.toString() === member.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove the owner of the workspace' });
    }

    await WorkspaceMember.deleteOne({ _id: member._id });

    await logActivity({
      workspace: workspaceId,
      user: req.user._id,
      action: 'MEMBER_REMOVED',
      details: `Removed member ${member.user.name} from workspace`
    });

    res.json({
      success: true,
      message: 'Member removed from workspace successfully'
    });
  } catch (error) {
    next(error);
  }
};

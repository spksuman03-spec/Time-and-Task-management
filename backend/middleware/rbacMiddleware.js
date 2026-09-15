import WorkspaceMember from '../models/WorkspaceMember.js';

// Global system role authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'Guest'}) is not authorized to access this resource`
      });
    }
    next();
  };
};

// Workspace-level role authorization
export const authorizeWorkspaceRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const workspaceId = req.headers['x-workspace-id'] || req.params.workspaceId || req.body.workspace;

    if (!workspaceId) {
      // If no workspace context specified, fallback to system role check
      if (req.user && (req.user.role === 'Admin' || allowedRoles.includes(req.user.role))) {
        return next();
      }
      return res.status(400).json({ success: false, message: 'Workspace ID required' });
    }

    try {
      // Platform Admins always bypass workspace restrictions
      if (req.user.role === 'Admin') {
        req.workspaceRole = 'Admin';
        return next();
      }

      const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: req.user._id
      });

      if (!membership) {
        return res.status(403).json({ success: false, message: 'You are not a member of this workspace' });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          message: `Workspace action requires role: ${allowedRoles.join(' or ')}. Your role: ${membership.role}`
        });
      }

      req.workspaceRole = membership.role;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authorization error', error: error.message });
    }
  };
};

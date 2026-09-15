import express from 'express';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspaceById,
  inviteMember,
  updateMemberRole,
  removeMember
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeWorkspaceRole } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.get('/:id', getWorkspaceById);
router.post('/:id/members', authorizeWorkspaceRole('Admin', 'Manager'), inviteMember);
router.put('/:id/members/:memberId/role', authorizeWorkspaceRole('Admin'), updateMemberRole);
router.delete('/:id/members/:memberId', authorizeWorkspaceRole('Admin'), removeMember);

export default router;

import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', authorizeRoles('Admin'), updateUserRole);
router.put('/:id/status', authorizeRoles('Admin'), toggleUserStatus);

export default router;

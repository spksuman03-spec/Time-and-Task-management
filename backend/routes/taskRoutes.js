import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeWorkspaceRole } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', authorizeWorkspaceRole('Admin', 'Manager'), createTask);
router.put('/:id', updateTask);
router.put('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;

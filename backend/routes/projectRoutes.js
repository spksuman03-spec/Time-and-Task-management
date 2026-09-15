import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeWorkspaceRole } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authorizeWorkspaceRole('Admin', 'Manager'), createProject);
router.put('/:id', authorizeWorkspaceRole('Admin', 'Manager'), updateProject);
router.delete('/:id', authorizeWorkspaceRole('Admin', 'Manager'), deleteProject);

export default router;

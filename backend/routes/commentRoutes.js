import express from 'express';
import {
  getTaskComments,
  addComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/task/:taskId', getTaskComments);
router.post('/', addComment);
router.delete('/:id', deleteComment);

export default router;

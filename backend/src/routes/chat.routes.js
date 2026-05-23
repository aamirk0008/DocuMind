import { Router } from 'express';
import protect from '../middleware/auth.js';
import { askQuestion, getChatHistory } from '../controllers/chat.controller.js';

const router = Router();

router.use(protect);

router.post('/:documentId/ask', askQuestion);
router.get('/:documentId/history', getChatHistory);

export default router;
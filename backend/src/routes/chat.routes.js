import { Router } from 'express';
import protect from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { questionValidator } from '../validators/chat.validator.js';
import { askQuestion, getChatHistory } from '../controllers/chat.controller.js';

const router = Router();

router.use(protect);

router.post('/:documentId/ask', chatLimiter, questionValidator, validate, askQuestion);
router.get('/:documentId/history', getChatHistory);

export default router;
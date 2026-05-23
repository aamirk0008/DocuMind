import { Router } from 'express';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import {
  uploadDocument,
  getDocuments,
  getDocumentStatus,
  deleteDocument,
} from '../controllers/document.controller.js';

const router = Router();

router.use(protect);

router.post('/upload', uploadLimiter, upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id/status', getDocumentStatus);
router.delete('/:id', deleteDocument);

export default router;
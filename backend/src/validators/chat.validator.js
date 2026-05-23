import { body } from 'express-validator';

export const questionValidator = [
  body('question')
    .trim()
    .notEmpty().withMessage('Question is required')
    .isLength({ min: 3, max: 1000 }).withMessage('Question must be 3-1000 characters'),
];
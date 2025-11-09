import express from 'express';
import { combineVideos } from '../controllers/videoController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/videos/combine
 * @desc    Combine multiple video URLs into a single video
 * @access  Public
 */
router.post('/combine', apiLimiter, combineVideos);

export default router;


import express from 'express';
import { enviarFeedback } from '../controllers/feedbackController';

const router = express.Router();

// POST /api/feedback — recebe feedback do usuário
router.post('/', enviarFeedback);

export default router;

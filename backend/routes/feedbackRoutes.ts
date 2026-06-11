import express from 'express';

import {
  enviarFeedback
} from '../controllers/feedbackController';

const router = express.Router();

router.post(
  '/',
  enviarFeedback
);

export default router;

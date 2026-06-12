import express from 'express';
<<<<<<< HEAD
import { enviarFeedback } from '../controllers/feedbackController';

const router = express.Router();

// POST /api/feedback — recebe feedback do usuário
router.post('/', enviarFeedback);

export default router;
=======

import {
  enviarFeedback
} from '../controllers/feedbackController';

const router = express.Router();

router.post(
  '/',
  enviarFeedback
);

export default router;
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

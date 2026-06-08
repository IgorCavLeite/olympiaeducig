import express from 'express';
const router = express.Router();
import {chat} from '../controllers/chatController';
import {authMiddleware} from '../middleware/authMiddleware';

router.post('/', authMiddleware, chat);

export default router;
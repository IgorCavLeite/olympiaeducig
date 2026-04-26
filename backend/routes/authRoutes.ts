import express from 'express';
const router = express.Router();
import { login, register } from '../controllers/authController';
import { chat } from '../controllers/chatController';

// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

//Rota do chatController
router.post('/chat', chat);

export default router;
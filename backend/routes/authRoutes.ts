import express from 'express';
const router = express.Router();
import { login, register } from '../controllers/authController';

// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

export default router;
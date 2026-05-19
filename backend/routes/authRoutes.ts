import express from 'express';
import { login, register, editarNome, alterarSenha } from '../controllers/authController';
import { chat } from '../controllers/chatController';

const router = express.Router();

// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

// Editar nome
router.put('/perfil/:id', editarNome);

// Alterar senha
router.put('/senha/:id', alterarSenha);

// Rota do chatController
router.post('/chat', chat);

export default router;
import express from 'express';
import { login, register, editarNome, alterarSenha } from '../controllers/authController';
import { autenticar } from '../middleware/authMiddleware';

const router = express.Router();

// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

// Editar nome
router.put('/perfil/:id', autenticar, editarNome);

// Alterar senha
router.put('/senha/:id', autenticar, alterarSenha);

export default router;
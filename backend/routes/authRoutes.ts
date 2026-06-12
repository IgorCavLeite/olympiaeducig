import express from 'express';
import { login, register, editarNome, alterarSenha, getPerfil } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

// Obter dados do perfil (com estatísticas)
router.get('/perfil', authMiddleware, getPerfil);

// Editar nome
router.put('/perfil', authMiddleware, editarNome);

// Alterar senha
router.put('/senha', authMiddleware, alterarSenha);

export default router;
import express from 'express';
import { registrarAcesso, registrarAcerto, getProgresso } from '../controllers/conquistaController';

const router = express.Router();

// GET /api/conquistas/:usuario_id — busca streak e acertos do usuário
router.get('/:usuario_id', getProgresso);

// POST /api/conquistas/acesso — registra acesso diário e atualiza streak
router.post('/acesso', registrarAcesso);

// POST /api/conquistas/acerto — registra acertos no quiz
router.post('/acerto', registrarAcerto);

export default router;
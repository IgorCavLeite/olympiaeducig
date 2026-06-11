import express from 'express';
import { getQuestoes, responderQuestao, getCategorias } from '../controllers/quizController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Todas as rotas do quiz requerem autenticação JWT
router.use(authMiddleware);

// Rota para obter questões filtradas/aleatórias
router.get('/questoes', getQuestoes);

// Rota para obter todas as categorias cadastradas
router.get('/categorias', getCategorias);

// Rota para enviar resposta da questão
router.post('/responder', responderQuestao);

export default router;

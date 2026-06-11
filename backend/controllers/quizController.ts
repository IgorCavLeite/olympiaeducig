import { Response } from 'express';
import pool from '../config/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// BUSCAR QUESTÕES
export const getQuestoes = async (req: AuthenticatedRequest, res: Response) => {
  const { limite, categoria, ano, fase } = req.query;

  let sql = 'SELECT id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, categoria, ano, fase FROM questoes WHERE 1=1';
  const params: any[] = [];

  if (categoria) {
    sql += ' AND categoria = ?';
    params.push(categoria);
  }

  if (ano) {
    sql += ' AND ano = ?';
    params.push(Number(ano));
  }

  if (fase) {
    sql += ' AND fase = ?';
    params.push(Number(fase));
  }

  // Ordena de forma aleatória por padrão, ou mantém ID se limite não for especificado
  sql += ' ORDER BY RAND()';

  const limitVal = Number(limite) || 10;
  sql += ' LIMIT ?';
  params.push(limitVal);

  try {
    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar questões:', err);
    return res.status(500).json({ error: 'Erro no servidor ao buscar questões' });
  }
};

// RESPONDER QUESTÃO
export const responderQuestao = async (req: AuthenticatedRequest, res: Response) => {
  const { questao_id, resposta_escolhida } = req.body;
  const usuario_id = req.user?.id;

  if (!questao_id || !resposta_escolhida) {
    return res.status(400).json({ error: 'Os campos questao_id e resposta_escolhida são obrigatórios' });
  }

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const letraResposta = resposta_escolhida.toUpperCase().trim();

  try {
    // 1. Busca a questão para conferir a resposta correta
    const [results]: any = await pool.query('SELECT resposta_correta, explicacao FROM questoes WHERE id = ?', [questao_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }

    const questao = results[0];
    const correta = questao.resposta_correta === letraResposta;

    // 2. Salva o progresso do usuário no banco de dados
    const insertSql = `
      INSERT INTO respostas_usuarios (usuario_id, questao_id, resposta_escolhida, correta)
      VALUES (?, ?, ?, ?)
    `;

    try {
      await pool.query(insertSql, [usuario_id, questao_id, letraResposta, correta]);
    } catch (insertErr) {
      console.error('Erro ao salvar resposta do usuário:', insertErr);
      // Mesmo se falhar em salvar o histórico, retornamos o resultado para o aluno não travar
    }

    res.json({
      correta,
      resposta_correta: questao.resposta_correta,
      explicacao: questao.explicacao
    });
  } catch (err) {
    console.error('Erro ao conferir questão:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// OBTER CATEGORIAS DISPONÍVEIS
export const getCategorias = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [results]: any = await pool.query('SELECT DISTINCT categoria FROM questoes WHERE categoria IS NOT NULL');
    const categorias = results.map((r: any) => r.categoria);
    res.json(categorias);
  } catch (err) {
    console.error('Erro ao obter categorias:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

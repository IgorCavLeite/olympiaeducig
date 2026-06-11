import { Request, Response } from 'express';
import pool from '../config/db';

// ─── REGISTRAR ACESSO DIÁRIO (STREAK) ────────────────────────────────────────

export const registrarAcesso = async (req: Request, res: Response) => {
  const { usuario_id } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id é obrigatório' });
  }

  try {
    const hoje = new Date().toISOString().split('T')[0];

    const [rows]: any = await pool.query(
      'SELECT * FROM streaks WHERE usuario_id = ?',
      [usuario_id]
    );

    let streak_atual = 1;
    let maior_streak = 1;

    if (rows.length === 0) {
      // Primeiro acesso — cria o registro
      await pool.query(
        'INSERT INTO streaks (usuario_id, streak_atual, maior_streak, ultimo_acesso) VALUES (?, 1, 1, ?)',
        [usuario_id, hoje]
      );
    } else {
      const registro = rows[0];
      const ultimo = registro.ultimo_acesso?.toISOString().split('T')[0];

      if (ultimo === hoje) {
        // Já acessou hoje — retorna sem alterar
        return res.json({
          streak_atual: registro.streak_atual,
          maior_streak: registro.maior_streak,
        });
      }

      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const ontemStr = ontem.toISOString().split('T')[0];

      if (ultimo === ontemStr) {
        // Acessou ontem — incrementa streak
        streak_atual = registro.streak_atual + 1;
      } else {
        // Quebrou o streak — recomeça
        streak_atual = 1;
      }

      maior_streak = Math.max(streak_atual, registro.maior_streak);

      await pool.query(
        'UPDATE streaks SET streak_atual = ?, maior_streak = ?, ultimo_acesso = ? WHERE usuario_id = ?',
        [streak_atual, maior_streak, hoje, usuario_id]
      );
    }

    return res.json({ streak_atual, maior_streak });
  } catch (error: any) {
    console.error('Erro ao registrar acesso:', error.message);
    return res.status(500).json({ error: 'Erro ao registrar acesso' });
  }
};

// ─── REGISTRAR ACERTO NO QUIZ ─────────────────────────────────────────────────

export const registrarAcerto = async (req: Request, res: Response) => {
  const { usuario_id, acertos } = req.body;

  if (!usuario_id || acertos === undefined) {
    return res.status(400).json({ error: 'usuario_id e acertos são obrigatórios' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM progresso_quiz WHERE usuario_id = ?',
      [usuario_id]
    );

    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO progresso_quiz (usuario_id, acertos_totais) VALUES (?, ?)',
        [usuario_id, acertos]
      );
    } else {
      await pool.query(
        'UPDATE progresso_quiz SET acertos_totais = acertos_totais + ? WHERE usuario_id = ?',
        [acertos, usuario_id]
      );
    }

    const [updated]: any = await pool.query(
      'SELECT acertos_totais FROM progresso_quiz WHERE usuario_id = ?',
      [usuario_id]
    );

    return res.json({ acertos_totais: updated[0].acertos_totais });
  } catch (error: any) {
    console.error('Erro ao registrar acerto:', error.message);
    return res.status(500).json({ error: 'Erro ao registrar acerto' });
  }
};

// ─── BUSCAR PROGRESSO DO USUÁRIO ──────────────────────────────────────────────

export const getProgresso = async (req: Request, res: Response) => {
  const { usuario_id } = req.params;

  try {
    const [streakRows]: any = await pool.query(
      'SELECT streak_atual, maior_streak FROM streaks WHERE usuario_id = ?',
      [usuario_id]
    );

    const [quizRows]: any = await pool.query(
      'SELECT acertos_totais FROM progresso_quiz WHERE usuario_id = ?',
      [usuario_id]
    );

    return res.json({
      streak_atual: streakRows[0]?.streak_atual || 0,
      maior_streak: streakRows[0]?.maior_streak || 0,
      acertos_totais: quizRows[0]?.acertos_totais || 0,
    });
  } catch (error: any) {
    console.error('Erro ao buscar progresso:', error.message);
    return res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
};
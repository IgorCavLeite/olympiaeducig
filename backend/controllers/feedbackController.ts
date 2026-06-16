import { Request, Response } from 'express';
import pool from '../config/db';

// ─── ENVIAR FEEDBACK ──────────────────────────────────────────────────────────

export const enviarFeedback = async (req: Request, res: Response) => {
  const { mensagem } = req.body;

  if (!mensagem || !mensagem.trim()) {
    return res.status(400).json({ error: 'A mensagem não pode estar vazia' });
  }

  try {
    await pool.query(
      'INSERT INTO feedbacks (mensagem) VALUES (?)',
      [mensagem.trim()]
    );
    return res.status(201).json({ message: 'Feedback recebido com sucesso' });
  } catch (err) {
    console.error('Erro ao salvar feedback:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

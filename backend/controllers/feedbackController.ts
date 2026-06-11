import { Request, Response } from 'express';
import pool from '../config/db';

export const enviarFeedback = async (
  req: Request,
  res: Response
) => {

  const { mensagem } = req.body;

  if (!mensagem || !mensagem.trim()) {
    return res.status(400).json({
      error: 'Mensagem obrigatória'
    });
  }

  try {

    await pool.query(
      'INSERT INTO feedbacks (mensagem) VALUES (?)',
      [mensagem]
    );

    return res.status(201).json({
      message: 'Feedback enviado'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Erro ao salvar feedback'
    });

  }
};

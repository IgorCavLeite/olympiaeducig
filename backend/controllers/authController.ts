import { Request, Response } from 'express';
import pool from '../config/db';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtConfig from '../config/jwtConfig';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
}

// CADASTRO

export const register = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );

    return res.status(201).json({ message: 'Usuário criado com sucesso' });

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// LOGIN

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    const usuarios = rows as Usuario[];

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = usuarios[0];

    if (!user.senha) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn as any }
    );

    return res.json({
      message: 'Login bem-sucedido',
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });

  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// EDITAR NOME

export const editarNome = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'O nome não pode estar vazio' });
  }

  try {
    await pool.query(
      'UPDATE usuarios SET nome = ? WHERE id = ?',
      [nome.trim(), id]
    );

    return res.json({ message: 'Nome atualizado com sucesso' });

  } catch (err) {
    console.error('Erro ao atualizar nome:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// ALTERAR SENHA

export const alterarSenha = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (novaSenha.length < 8) {
    return res.status(400).json({ error: 'A nova senha deve ter no mínimo 8 caracteres' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT senha FROM usuarios WHERE id = ?',
      [id]
    );

    const usuarios = rows as Usuario[];

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaHash = usuarios[0].senha!;
    const isMatch = await bcrypt.compare(senhaAtual, senhaHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [novoHash, id]
    );

    return res.json({ message: 'Senha alterada com sucesso' });

  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};
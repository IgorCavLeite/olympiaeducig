import { Request, Response } from 'express';
import connection from '../config/db';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtConfig from '../config/jwtConfig';

// A interface precisa estar aqui para o arquivo ser consistente
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  matricula: string;
  escola: string;
}

export const register = (req: Request, res: Response) => {
  const { nome, email, senha, matricula, escola } = req.body;

  if (!nome || !email || !senha || !matricula || !escola) {
    return res.status(400).json({ error: 'Todos os camppos são obrigatórios' });
  }

  const checkSql = 'SELECT id FROM usuarios WHERE email = ?';
  connection.query(checkSql, [email], (err, results: any) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if ((results as any[]).length > 0) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    bcrypt.hash(senha, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error('Erro ao gerar hash da senha:', hashErr);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      const insertSql = 'INSERT INTO usuarios (nome, email, senha, matricula,escola) VALUES (?, ?, ?, ?, ?)';

      connection.query(insertSql, [nome, email, hash, matricula, escola], (insertErr, result: any) => {
        if (insertErr) {
          console.error('Erro ao criar usuário:', insertErr);
          return res.status(500).json({ error: 'Erro no servidor' });
        }

        res.status(201).json({ message: 'Usuário criado com sucesso' });
      });
    });
  });
};

// O 'export' aqui é o que transforma o arquivo em um módulo
export const login = (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  
  connection.query(sql, [email], (err, results: any) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    const rows = results as Usuario[];
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = rows[0];

    if (!user.senha) {
      return res.status(500).json({ error: 'Senha não encontrada para o usuário' });
    }

    bcrypt.compare(senha, user.senha, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Erro ao comparar senhas:', compareErr);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn as any }
      );

      res.json({
        message: 'Login bem-sucedido',
        token,
        user: { id: user.id, nome: user.nome, email: user.email }
      });
    });
  });
};
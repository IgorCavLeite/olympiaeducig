import { Request, Response } from 'express';
import connection from '../config/db';
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

export const register = (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
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

      const insertSql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
      connection.query(insertSql, [nome, email, hash], (insertErr) => {
        if (insertErr) {
          console.error('Erro ao criar usuário:', insertErr);
          return res.status(500).json({ error: 'Erro no servidor' });
        }

        res.status(201).json({ message: 'Usuário criado com sucesso' });
      });
    });
  });
};

// LOGIN

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
        user: { id: user.id, nome: user.nome, email: user.email },
      });
    });
  });
};

// EDITAR NOME

export const editarNome = (req: Request, res: Response) => {
  const id = (req as any).user?.id;
  const { nome } = req.body;

  if (!id) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'O nome não pode estar vazio' });
  }

  connection.query(
    'UPDATE usuarios SET nome = ? WHERE id = ?',
    [nome.trim(), id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar nome:', err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      res.json({ message: 'Nome atualizado com sucesso' });
    }
  );
};

// ALTERAR SENHA

export const alterarSenha = (req: Request, res: Response) => {
  const id = (req as any).user?.id;
  const { senhaAtual, novaSenha } = req.body;

  if (!id) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (novaSenha.length < 8) {
    return res.status(400).json({ error: 'A nova senha deve ter no mínimo 8 caracteres' });
  }

  // Busca a senha atual do usuário
  connection.query(
    'SELECT senha FROM usuarios WHERE id = ?',
    [id],
    (err, results: any) => {
      if (err) {
        console.error('Erro na consulta:', err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      const rows = results as Usuario[];
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaHash = rows[0].senha!;

      // Verifica se a senha atual está correta
      bcrypt.compare(senhaAtual, senhaHash, (compareErr, isMatch) => {
        if (compareErr) {
          return res.status(500).json({ error: 'Erro no servidor' });
        }

        if (!isMatch) {
          return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        // Gera o hash da nova senha e salva
        bcrypt.hash(novaSenha, 10, (hashErr, novoHash) => {
          if (hashErr) {
            return res.status(500).json({ error: 'Erro no servidor' });
          }

          connection.query(
            'UPDATE usuarios SET senha = ? WHERE id = ?',
            [novoHash, id],
            (updateErr) => {
              if (updateErr) {
                return res.status(500).json({ error: 'Erro no servidor' });
              }
              res.json({ message: 'Senha alterada com sucesso' });
            }
          );
        });
      });
    }
  );
};

// BUSCAR DADOS DO PERFIL E ESTATÍSTICAS
export const getPerfil = (req: Request, res: Response) => {
  const usuarioId = (req as any).user?.id;

  if (!usuarioId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  connection.query('SELECT nome, email FROM usuarios WHERE id = ?', [usuarioId], (err, userResults: any) => {
    if (err) {
      console.error('Erro ao buscar perfil:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResults[0];

    const statsQuery = `
      SELECT 
        COUNT(*) as totalRespondidas, 
        SUM(CASE WHEN correta = 1 THEN 1 ELSE 0 END) as totalCorretas 
      FROM respostas_usuarios 
      WHERE usuario_id = ?
    `;

    connection.query(statsQuery, [usuarioId], (statsErr, statsResults: any) => {
      if (statsErr) {
        console.error('Erro ao buscar estatísticas:', statsErr);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      const stats = statsResults[0];
      const totalRespondidas = stats.totalRespondidas || 0;
      const totalCorretas = stats.totalCorretas || 0;
      const precisao = totalRespondidas > 0 ? Math.round((totalCorretas / totalRespondidas) * 100) : 0;

      res.json({
        user: {
          nome: user.nome,
          email: user.email
        },
        stats: {
          totalRespondidas,
          totalCorretas,
          precisao
        }
      });
    });
  });
};

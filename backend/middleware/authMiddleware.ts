import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

interface TokenPayload {
  id: number;
  email: string;
}

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as TokenPayload;

    if (decoded.id !== Number(req.params.id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
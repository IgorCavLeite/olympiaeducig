import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

// Extende o tipo Request para incluir o usuário autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
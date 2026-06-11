import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no token de autenticação' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    return next();
  });
};

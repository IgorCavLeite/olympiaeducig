import dotenv from 'dotenv';
dotenv.config();

interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET || 'chave_mestra_olympia_2026',
  expiresIn: '7d'
};

export default jwtConfig;
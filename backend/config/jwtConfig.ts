import dotenv from 'dotenv';
dotenv.config();

// Definimos exatamente o que esse objeto deve ter
interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET || 'chave_mestra_olympia_2026',
  expiresIn: '7d' // Garante que o TS veja isso como uma string válida
};

export default jwtConfig;
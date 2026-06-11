import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no .env. Adicione a variável antes de iniciar o servidor.');
}

interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
};

export default jwtConfig;
import * as mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Criamos a conexão. O mysql2 já entende os tipos automaticamente.
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'OlympIA',
  port: Number(process.env.DB_PORT) || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL!');
    console.error('Código do erro:', err.code); // Ex: 'ECONNREFUSED'
    console.error('Mensagem completa:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao MySQL!');
});

export default connection;
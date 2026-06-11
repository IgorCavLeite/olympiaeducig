import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'OlympIA',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MySQL!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MySQL!');
    console.error('Código do erro:', err.code);
    console.error('Mensagem completa:', err.message);
    process.exit(1);
  });

export default pool;
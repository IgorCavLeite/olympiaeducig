import * as mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'OlympIA';
const DB_PORT = Number(process.env.DB_PORT) || 3306;

console.log('🔄 Iniciando conexão com o MySQL para criar o banco e as tabelas...');
console.log(`Configuração: Host=${DB_HOST}:${DB_PORT}, User=${DB_USER}, Database=${DB_NAME}`);

// Conecta primeiro sem especificar o banco de dados (para podermos criá-lo se não existir)
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Não foi possível conectar ao MySQL!');
    console.error('Código do erro:', err.code);
    console.error('Mensagem completa:', err.message);
    console.error('\n⚠️ Por favor, certifique-se de que o MySQL está ativo e rodando nas configurações acima.');
    process.exit(1);
  }

  console.log('✅ Conectado ao MySQL com sucesso!');

  // 1. Criar banco de dados
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, (dbErr) => {
    if (dbErr) {
      console.error('❌ Erro ao criar o banco de dados:', dbErr.message);
      connection.end();
      process.exit(1);
    }
    console.log(`✅ Banco de dados "${DB_NAME}" verificado/criado.`);

    // 2. Usar o banco de dados criado
    connection.query(`USE \`${DB_NAME}\`;`, (useErr) => {
      if (useErr) {
        console.error('❌ Erro ao selecionar o banco de dados:', useErr.message);
        connection.end();
        process.exit(1);
      }

      // 3. Criar tabela 'usuarios' caso não exista (garantindo estrutura básica)
      const tableUsuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `;

      connection.query(tableUsuarios, (uErr) => {
        if (uErr) {
          console.error('❌ Erro ao criar tabela "usuarios":', uErr.message);
          connection.end();
          process.exit(1);
        }
        console.log('✅ Tabela "usuarios" verificada/criada.');

        // 4. Criar tabela 'questoes'
        const tableQuestoes = `
          CREATE TABLE IF NOT EXISTS questoes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            enunciado TEXT NOT NULL,
            alternativa_a TEXT NOT NULL,
            alternativa_b TEXT NOT NULL,
            alternativa_c TEXT NOT NULL,
            alternativa_d TEXT NOT NULL,
            alternativa_e TEXT NOT NULL,
            resposta_correta CHAR(1) NOT NULL,
            explicacao TEXT NULL,
            categoria VARCHAR(100) NULL,
            ano INT NULL,
            fase INT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB;
        `;

        connection.query(tableQuestoes, (qErr) => {
          if (qErr) {
            console.error('❌ Erro ao criar tabela "questoes":', qErr.message);
            connection.end();
            process.exit(1);
          }
          console.log('✅ Tabela "questoes" verificada/criada.');

          // 5. Criar tabela 'respostas_usuarios'
          const tableRespostas = `
            CREATE TABLE IF NOT EXISTS respostas_usuarios (
              id INT AUTO_INCREMENT PRIMARY KEY,
              usuario_id INT NOT NULL,
              questao_id INT NOT NULL,
              resposta_escolhida CHAR(1) NOT NULL,
              correta BOOLEAN NOT NULL,
              respondido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
              FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
          `;

          connection.query(tableRespostas, (rErr) => {
            if (rErr) {
              console.error('❌ Erro ao criar tabela "respostas_usuarios":', rErr.message);
            } else {
              console.log('✅ Tabela "respostas_usuarios" verificada/criada.');
              console.log('\n🎉 Inicialização do banco de dados concluída com sucesso!');
            }
            connection.end();
          });
        });
      });
    });
  });
});

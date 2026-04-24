import connection from './config/db';

const initDB = async () => {
  try {
    // Criar banco se não existir
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS OlympIA');
    await connection.promise().query('USE OlympIA');

    // Criar tabelas
    const createQuestionarios = `
      CREATE TABLE IF NOT EXISTS questionarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        ano INT NOT NULL,
        disciplina VARCHAR(100) NOT NULL,
        nivel VARCHAR(50) NOT NULL,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.promise().query(createQuestionarios);

    const createPerguntas = `
      CREATE TABLE IF NOT EXISTS perguntas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionario_id INT NOT NULL,
        pergunta TEXT NOT NULL,
        tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'dissertativa') DEFAULT 'multipla_escolha',
        pontos INT DEFAULT 1,
        FOREIGN KEY (questionario_id) REFERENCES questionarios(id) ON DELETE CASCADE
      )
    `;
    await connection.promise().query(createPerguntas);

    const createOpcoes = `
      CREATE TABLE IF NOT EXISTS opcoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pergunta_id INT NOT NULL,
        opcao TEXT NOT NULL,
        correta BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE
      )
    `;
    await connection.promise().query(createOpcoes);

    // Inserir dados de exemplo
    const insertQuestionario = `
      INSERT INTO questionarios (titulo, ano, disciplina, nivel, descricao) VALUES
      ('OBMEP 2020 - Matemática Fundamental', 2020, 'Matemática', 'fundamental', 'Questionário baseado na Olimpíada Brasileira de Matemática das Escolas Públicas 2020')
    `;
    await connection.promise().query(insertQuestionario);

    const insertPerguntas = `
      INSERT INTO perguntas (questionario_id, pergunta, tipo, pontos) VALUES
      (1, 'Qual é o resultado de 2 + 3?', 'multipla_escolha', 1),
      (1, 'Um quadrado tem quantos lados?', 'multipla_escolha', 1),
      (1, 'Qual é o próximo número na sequência: 1, 3, 5, 7, ...?', 'multipla_escolha', 2)
    `;
    await connection.promise().query(insertPerguntas);

    const insertOpcoes1 = `
      INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
      (1, '3', FALSE),
      (1, '4', FALSE),
      (1, '5', TRUE),
      (1, '6', FALSE)
    `;
    await connection.promise().query(insertOpcoes1);

    const insertOpcoes2 = `
      INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
      (2, '3', FALSE),
      (2, '4', TRUE),
      (2, '5', FALSE),
      (2, '6', FALSE)
    `;
    await connection.promise().query(insertOpcoes2);

    const insertOpcoes3 = `
      INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
      (3, '8', FALSE),
      (3, '9', TRUE),
      (3, '10', FALSE),
      (3, '11', FALSE)
    `;
    await connection.promise().query(insertOpcoes3);

    console.log('✅ Base de dados inicializada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar a base de dados:', error);
  } finally {
    connection.end();
  }
};

initDB();
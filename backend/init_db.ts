import connection from './config/db';

const initDB = async () => {
  try {
    await connection.promise().query(`
      CREATE DATABASE IF NOT EXISTS OlympIA
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
    `);
    await connection.promise().query('USE OlympIA');

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) NOT NULL UNIQUE,
        escola VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS questionarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        ano INT NOT NULL,
        fase VARCHAR(50),
        disciplina VARCHAR(100) NOT NULL,
        nivel VARCHAR(50) NOT NULL,
        descricao TEXT,
        fonte VARCHAR(255),
        data_prova DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS perguntas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionario_id INT NOT NULL,
        numero INT NOT NULL,
        enunciado TEXT NOT NULL,
        tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'dissertativa') DEFAULT 'multipla_escolha',
        pontos INT DEFAULT 1,
        tema VARCHAR(100),
        imagem_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_perguntas_questionario
          FOREIGN KEY (questionario_id) REFERENCES questionarios(id) ON DELETE CASCADE,
        CONSTRAINT uq_pergunta_numero UNIQUE (questionario_id, numero)
      )
    `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS opcoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pergunta_id INT NOT NULL,
        letra CHAR(1) NOT NULL,
        texto TEXT NOT NULL,
        correta BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_opcoes_pergunta
          FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE,
        CONSTRAINT uq_opcao_letra UNIQUE (pergunta_id, letra)
      )
    `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS tentativas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        questionario_id INT NOT NULL,
        data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_fim DATETIME NULL,
        nota DECIMAL(5,2) DEFAULT NULL,
        acertos INT DEFAULT 0,
        total_questoes INT DEFAULT 0,
        status ENUM('em_andamento', 'finalizada', 'abandonada') DEFAULT 'em_andamento',
        CONSTRAINT fk_tentativas_usuario
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT fk_tentativas_questionario
          FOREIGN KEY (questionario_id) REFERENCES questionarios(id) ON DELETE CASCADE
      )
    `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS respostas_aluno (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tentativa_id INT NOT NULL,
        pergunta_id INT NOT NULL,
        opcao_id INT NULL,
        correta BOOLEAN DEFAULT NULL,
        respondida_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_respostas_tentativa
          FOREIGN KEY (tentativa_id) REFERENCES tentativas(id) ON DELETE CASCADE,
        CONSTRAINT fk_respostas_pergunta
          FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE,
        CONSTRAINT fk_respostas_opcao
          FOREIGN KEY (opcao_id) REFERENCES opcoes(id) ON DELETE SET NULL,
        CONSTRAINT uq_resposta_pergunta UNIQUE (tentativa_id, pergunta_id)
      )
    `);

    await connection.promise().query(`
      INSERT INTO questionarios (titulo, ano, fase, disciplina, nivel, descricao, fonte, data_prova)
      SELECT
        'OBMEP 2020 - Matemática Fundamental',
        2020,
        'Exemplo',
        'Matemática',
        'fundamental',
        'Questionário de exemplo para validar a modelagem.',
        'Carga inicial do projeto',
        '2020-01-01'
      WHERE NOT EXISTS (
        SELECT 1 FROM questionarios WHERE titulo = 'OBMEP 2020 - Matemática Fundamental' AND ano = 2020
      )
    `);

    const [questionarioRows] = await connection.promise().query(
      `
      SELECT id
      FROM questionarios
      WHERE titulo = 'OBMEP 2020 - Matemática Fundamental' AND ano = 2020
      LIMIT 1
      `
    );
    const questionarioId = (questionarioRows as any[])[0]?.id;

    if (!questionarioId) {
      throw new Error('Questionário de exemplo não foi criado.');
    }

    const perguntasExemplo = [
      {
        numero: 1,
        enunciado: 'Qual é o resultado de 2 + 3?',
        tema: 'Aritmética',
        pontos: 1,
        opcoes: [
          { letra: 'A', texto: '3', correta: false },
          { letra: 'B', texto: '4', correta: false },
          { letra: 'C', texto: '5', correta: true },
          { letra: 'D', texto: '6', correta: false },
        ],
      },
      {
        numero: 2,
        enunciado: 'Um quadrado tem quantos lados?',
        tema: 'Geometria',
        pontos: 1,
        opcoes: [
          { letra: 'A', texto: '3', correta: false },
          { letra: 'B', texto: '4', correta: true },
          { letra: 'C', texto: '5', correta: false },
          { letra: 'D', texto: '6', correta: false },
        ],
      },
      {
        numero: 3,
        enunciado: 'Qual é o próximo número na sequência: 1, 3, 5, 7, ...?',
        tema: 'Sequências',
        pontos: 2,
        opcoes: [
          { letra: 'A', texto: '8', correta: false },
          { letra: 'B', texto: '9', correta: true },
          { letra: 'C', texto: '10', correta: false },
          { letra: 'D', texto: '11', correta: false },
        ],
      },
    ];

    for (const pergunta of perguntasExemplo) {
      await connection.promise().query(
        `
        INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema)
        SELECT ?, ?, ?, 'multipla_escolha', ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM perguntas WHERE questionario_id = ? AND numero = ?
        )
        `,
        [
          questionarioId,
          pergunta.numero,
          pergunta.enunciado,
          pergunta.pontos,
          pergunta.tema,
          questionarioId,
          pergunta.numero,
        ]
      );

      const [perguntaRows] = await connection.promise().query(
        'SELECT id FROM perguntas WHERE questionario_id = ? AND numero = ? LIMIT 1',
        [questionarioId, pergunta.numero]
      );
      const perguntaId = (perguntaRows as any[])[0]?.id;

      for (const opcao of pergunta.opcoes) {
        await connection.promise().query(
          `
          INSERT INTO opcoes (pergunta_id, letra, texto, correta)
          SELECT ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM opcoes WHERE pergunta_id = ? AND letra = ?
          )
          `,
          [perguntaId, opcao.letra, opcao.texto, opcao.correta, perguntaId, opcao.letra]
        );
      }
    }

    console.log('Base de dados inicializada com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar a base de dados:', error);
  } finally {
    connection.end();
  }
};

initDB();

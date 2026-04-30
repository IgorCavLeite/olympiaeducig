-- Script para inicializar a base de dados OlympIA com foco em estudo do aluno

CREATE DATABASE IF NOT EXISTS OlympIA
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE OlympIA;

-- Usuários do app (alunos)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  escola VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provas/listas de estudo
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
);

-- Questões de cada prova
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
);

-- Alternativas das questões
CREATE TABLE IF NOT EXISTS opcoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pergunta_id INT NOT NULL,
  letra CHAR(1) NOT NULL,
  texto TEXT NOT NULL,
  correta BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_opcoes_pergunta
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE,
  CONSTRAINT uq_opcao_letra UNIQUE (pergunta_id, letra)
);

-- Tentativas feitas pelo aluno
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
);

-- Respostas marcadas em cada tentativa
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
);

-- Dados de exemplo para validar a estrutura
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
);

SET @questionario_exemplo_id = (
  SELECT id FROM questionarios
  WHERE titulo = 'OBMEP 2020 - Matemática Fundamental' AND ano = 2020
  LIMIT 1
);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema)
SELECT @questionario_exemplo_id, 1, 'Qual é o resultado de 2 + 3?', 'multipla_escolha', 1, 'Aritmética'
WHERE NOT EXISTS (
  SELECT 1 FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 1
);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema)
SELECT @questionario_exemplo_id, 2, 'Um quadrado tem quantos lados?', 'multipla_escolha', 1, 'Geometria'
WHERE NOT EXISTS (
  SELECT 1 FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 2
);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema)
SELECT @questionario_exemplo_id, 3, 'Qual é o próximo número na sequência: 1, 3, 5, 7, ...?', 'multipla_escolha', 2, 'Sequências'
WHERE NOT EXISTS (
  SELECT 1 FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 3
);

SET @pergunta_1_id = (
  SELECT id FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 1 LIMIT 1
);
SET @pergunta_2_id = (
  SELECT id FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 2 LIMIT 1
);
SET @pergunta_3_id = (
  SELECT id FROM perguntas WHERE questionario_id = @questionario_exemplo_id AND numero = 3 LIMIT 1
);

INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_1_id, 'A', '3', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_1_id AND letra = 'A');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_1_id, 'B', '4', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_1_id AND letra = 'B');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_1_id, 'C', '5', TRUE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_1_id AND letra = 'C');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_1_id, 'D', '6', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_1_id AND letra = 'D');

INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_2_id, 'A', '3', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_2_id AND letra = 'A');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_2_id, 'B', '4', TRUE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_2_id AND letra = 'B');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_2_id, 'C', '5', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_2_id AND letra = 'C');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_2_id, 'D', '6', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_2_id AND letra = 'D');

INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_3_id, 'A', '8', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_3_id AND letra = 'A');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_3_id, 'B', '9', TRUE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_3_id AND letra = 'B');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_3_id, 'C', '10', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_3_id AND letra = 'C');
INSERT INTO opcoes (pergunta_id, letra, texto, correta)
SELECT @pergunta_3_id, 'D', '11', FALSE
WHERE NOT EXISTS (SELECT 1 FROM opcoes WHERE pergunta_id = @pergunta_3_id AND letra = 'D');

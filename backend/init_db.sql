-- Script para inicializar a base de dados OlympIA com tabelas para questionários de olímpiadas

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS OlympIA;
USE OlympIA;

-- Tabela para questionários
CREATE TABLE IF NOT EXISTS questionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  ano INT NOT NULL,
  disciplina VARCHAR(100) NOT NULL,
  nivel VARCHAR(50) NOT NULL, -- Ex: 'fundamental', 'medio', 'superior'
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para perguntas
CREATE TABLE IF NOT EXISTS perguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionario_id INT NOT NULL,
  pergunta TEXT NOT NULL,
  tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'dissertativa') DEFAULT 'multipla_escolha',
  pontos INT DEFAULT 1,
  FOREIGN KEY (questionario_id) REFERENCES questionarios(id) ON DELETE CASCADE
);

-- Tabela para opções de resposta (para múltipla escolha)
CREATE TABLE IF NOT EXISTS opcoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pergunta_id INT NOT NULL,
  opcao TEXT NOT NULL,
  correta BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE
);

-- Exemplo de inserção de dados (questionário de Matemática da OBMEP 2020, nível fundamental)
INSERT INTO questionarios (titulo, ano, disciplina, nivel, descricao) VALUES
('OBMEP 2020 - Matemática Fundamental', 2020, 'Matemática', 'fundamental', 'Questionário baseado na Olimpíada Brasileira de Matemática das Escolas Públicas 2020');

-- Perguntas de exemplo
INSERT INTO perguntas (questionario_id, pergunta, tipo, pontos) VALUES
(1, 'Qual é o resultado de 2 + 3?', 'multipla_escolha', 1),
(1, 'Um quadrado tem quantos lados?', 'multipla_escolha', 1),
(1, 'Qual é o próximo número na sequência: 1, 3, 5, 7, ...?', 'multipla_escolha', 2);

-- Opções para a primeira pergunta
INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
(1, '3', FALSE),
(1, '4', FALSE),
(1, '5', TRUE),
(1, '6', FALSE);

-- Opções para a segunda pergunta
INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
(2, '3', FALSE),
(2, '4', TRUE),
(2, '5', FALSE),
(2, '6', FALSE);

-- Opções para a terceira pergunta
INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES
(3, '8', FALSE),
(3, '9', TRUE),
(3, '10', FALSE),
(3, '11', FALSE);
import connection from './config/db';
import * as fs from 'fs';

interface Opcao {
  opcao: string;
  correta: boolean;
}

interface Pergunta {
  pergunta: string;
  tipo: string;
  pontos: number;
  opcoes: Opcao[];
}

interface Questionario {
  titulo: string;
  ano: number;
  disciplina: string;
  nivel: string;
  descricao: string;
  perguntas: Pergunta[];
}

const populateDB = async () => {
  try {
    const data: Questionario[] = JSON.parse(fs.readFileSync('./olimpiadas_data.json', 'utf-8'));

    for (const q of data) {
      // Inserir questionário
      const [result] = await connection.promise().query(
        'INSERT INTO questionarios (titulo, ano, disciplina, nivel, descricao) VALUES (?, ?, ?, ?, ?)',
        [q.titulo, q.ano, q.disciplina, q.nivel, q.descricao]
      );
      const questionarioId = (result as any).insertId;

      for (const p of q.perguntas) {
        // Inserir pergunta
        const [resultP] = await connection.promise().query(
          'INSERT INTO perguntas (questionario_id, pergunta, tipo, pontos) VALUES (?, ?, ?, ?)',
          [questionarioId, p.pergunta, p.tipo, p.pontos]
        );
        const perguntaId = (resultP as any).insertId;

        for (const o of p.opcoes) {
          // Inserir opções
          await connection.promise().query(
            'INSERT INTO opcoes (pergunta_id, opcao, correta) VALUES (?, ?, ?)',
            [perguntaId, o.opcao, o.correta]
          );
        }
      }
    }

    console.log('✅ Dados das olímpiadas inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao popular a base de dados:', error);
  } finally {
    connection.end();
  }
};

populateDB();
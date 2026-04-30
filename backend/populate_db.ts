import connection from './config/db';
import * as fs from 'fs';

interface Opcao {
  letra?: string;
  opcao?: string;
  texto?: string;
  correta: boolean;
}

interface Pergunta {
  numero?: number;
  pergunta?: string;
  enunciado?: string;
  tipo?: string;
  pontos?: number;
  tema?: string;
  imagem_path?: string;
  opcoes: Opcao[];
}

interface Questionario {
  titulo: string;
  ano: number;
  fase?: string;
  disciplina: string;
  nivel: string;
  descricao?: string;
  fonte?: string;
  data_prova?: string;
  perguntas: Pergunta[];
}

const letrasPadrao = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const populateDB = async () => {
  try {
    const data: Questionario[] = JSON.parse(fs.readFileSync('./olimpiadas_data.json', 'utf-8'));

    for (const q of data) {
      const [questionarioResult] = await connection.promise().query(
        `
        INSERT INTO questionarios (titulo, ano, fase, disciplina, nivel, descricao, fonte, data_prova)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          q.titulo,
          q.ano,
          q.fase ?? null,
          q.disciplina,
          q.nivel,
          q.descricao ?? null,
          q.fonte ?? null,
          q.data_prova ?? null,
        ]
      );

      const questionarioId = (questionarioResult as any).insertId;

      for (let perguntaIndex = 0; perguntaIndex < q.perguntas.length; perguntaIndex += 1) {
        const p = q.perguntas[perguntaIndex];
        const numero = p.numero ?? perguntaIndex + 1;
        const enunciado = p.enunciado ?? p.pergunta ?? '';

        const [perguntaResult] = await connection.promise().query(
          `
          INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            questionarioId,
            numero,
            enunciado,
            p.tipo ?? 'multipla_escolha',
            p.pontos ?? 1,
            p.tema ?? null,
            p.imagem_path ?? null,
          ]
        );

        const perguntaId = (perguntaResult as any).insertId;

        for (let opcaoIndex = 0; opcaoIndex < p.opcoes.length; opcaoIndex += 1) {
          const o = p.opcoes[opcaoIndex];
          const letra = o.letra ?? letrasPadrao[opcaoIndex] ?? String(opcaoIndex + 1);
          const texto = o.texto ?? o.opcao ?? '';

          await connection.promise().query(
            `
            INSERT INTO opcoes (pergunta_id, letra, texto, correta)
            VALUES (?, ?, ?, ?)
            `,
            [perguntaId, letra, texto, o.correta]
          );
        }
      }
    }

    console.log('Dados das olimpíadas inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao popular a base de dados:', error);
  } finally {
    connection.end();
  }
};

populateDB();

import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

// Verifica a chave da API do Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Erro: A variável GEMINI_API_KEY não foi encontrada no seu arquivo backend/.env!');
  console.error('Por favor, edite o arquivo backend/.env e insira a sua chave da API do Gemini antes de continuar.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  const args = process.argv.slice(2);
  const pdfFileName = args[0];
  const ano = Number(args[1]);
  const fase = Number(args[2]);

  if (!pdfFileName || isNaN(ano) || isNaN(fase)) {
    console.log('📖 Como usar o script de importação:');
    console.log('  npx tsx scripts/importarQuestoes.ts <nome_do_arquivo_pdf> <ano> <fase>');
    console.log('\nExemplo:');
    console.log('  npx tsx scripts/importarQuestoes.ts "Prova OBB 2020.pdf" 2020 1');
    process.exit(1);
  }

  const pdfPath = path.join(__dirname, '../provas', pdfFileName);
  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ Arquivo PDF não encontrado no caminho: ${pdfPath}`);
    process.exit(1);
  }

  console.log(`\n📄 Lendo e extraindo texto do arquivo: ${pdfFileName}...`);
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const pdfData = await parser.getText();
  await parser.destroy();

  const textoProva = pdfData.text;
  console.log(`✅ Texto extraído com sucesso! (${textoProva.length} caracteres, ${pdfData.total} páginas)`);

  console.log('🤖 Enviando texto para a API do Gemini para estruturar e resolver as questões...');

  const systemInstruction = `Você é um professor de Biologia especialista na Olimpíada Brasileira de Biologia (OBB).
Seu trabalho é ler o texto de uma prova de biologia, identificar todas as questões de múltipla escolha (com 5 alternativas de A a E) contidas nele e:
1. Extrair fielmente o enunciado e as alternativas (A, B, C, D, E).
2. Usar seus profundos conhecimentos em Biologia para resolver cada questão e identificar a resposta correta (A, B, C, D ou E).
3. Escrever uma explicação didática e curta (máximo de 3 frases) justificando por que aquela resposta é a correta.
4. Classificar a questão em uma categoria relevante de Biologia (ex: Citologia, Genética, Evolução, Ecologia, Zoologia, Botânica, Fisiologia Humana, Bioquímica).

Você deve retornar os dados em um array JSON estrito, onde cada objeto segue o seguinte formato:
{
  "enunciado": "Enunciado completo da questão...",
  "alternativa_a": "Texto da alternativa A...",
  "alternativa_b": "Texto da alternativa B...",
  "alternativa_c": "Texto da alternativa C...",
  "alternativa_d": "Texto da alternativa D...",
  "alternativa_e": "Texto da alternativa E...",
  "resposta_correta": "A", // Letra maiúscula correspondente (A, B, C, D ou E)
  "explicacao": "Explicação curta de por que essa alternativa é a correta...",
  "categoria": "Categoria da questão..."
}`;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1 // Temperatura baixa para maior precisão e consistência
      }
    });

    const prompt = `Analise o texto da prova a seguir e extraia TODAS as questões de múltipla escolha encontradas, resolvendo-as e estruturando-as conforme as instruções:
    
    TEXTO DA PROVA:
    ${textoProva}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parseia a resposta do Gemini
    const questoes: any[] = JSON.parse(responseText);
    console.log(`\n✅ Gemini processou a prova! Total de questões identificadas: ${questoes.length}`);

    if (questoes.length === 0) {
      console.log('⚠️ Nenhuma questão foi identificada pelo modelo.');
      process.exit(0);
    }

    console.log('💾 Salvando questões no banco de dados MySQL...');

    let inseridas = 0;
    const query = `
      INSERT INTO questoes 
      (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao, categoria, ano, fase)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const q of questoes) {
      // Validações básicas da estrutura recebida
      if (!q.enunciado || !q.alternativa_a || !q.resposta_correta) {
        console.warn('⚠️ Pulando questão com estrutura inválida:', q);
        continue;
      }

      await new Promise<void>((resolve, reject) => {
        pool.query(
          query,
          [
            q.enunciado.trim(),
            q.alternativa_a.trim(),
            q.alternativa_b.trim(),
            q.alternativa_c.trim(),
            q.alternativa_d.trim(),
            q.alternativa_e.trim(),
            q.resposta_correta.toUpperCase().trim(),
            q.explicacao ? q.explicacao.trim() : null,
            q.categoria ? q.categoria.trim() : 'Biologia Geral',
            ano,
            fase
          ],
          (err) => {
            if (err) {
              console.error(`❌ Erro ao inserir questão "${q.enunciado.substring(0, 30)}...":`, err.message);
              reject(err);
            } else {
              inseridas++;
              resolve();
            }
          }
        );
      });
    }

    console.log(`\n🎉 Processamento concluído!`);
    console.log(`📈 Questões extraídas e resolvidas pela IA: ${questoes.length}`);
    console.log(`💾 Questões inseridas no banco de dados com sucesso: ${inseridas}/${questoes.length}`);

  } catch (error: any) {
    console.error('❌ Erro durante a chamada da API do Gemini ou inserção no banco:', error.message);
  } finally {
    pool.end();
  }
}

main().catch(err => {
  console.error('❌ Erro inesperado:', err);
  pool.end();
});

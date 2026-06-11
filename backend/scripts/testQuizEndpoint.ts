import axios from 'axios';
import pool from '../config/db';

async function test() {
  console.log('🔄 Iniciando teste de integração do endpoint de Quiz...');

  const baseURL = 'http://localhost:3001/api';
  const testEmail = `test_temp_${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testNome = 'Test User';

  try {
    // 1. Cadastrar usuário de teste
    console.log('1. Cadastrando usuário temporário...');
    await axios.post(`${baseURL}/auth/register`, {
      nome: testNome,
      email: testEmail,
      senha: testPassword
    });
    console.log('✅ Usuário cadastrado com sucesso!');

    // 2. Fazer Login para obter o token JWT
    console.log('2. Efetuando login...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: testEmail,
      senha: testPassword
    });
    const token = loginRes.data.token;
    console.log('✅ Login bem-sucedido! Token obtido:', token.substring(0, 20) + '...');

    // 3. Chamar o endpoint do Quiz
    console.log('3. Buscando questões no quiz (GET /api/quiz/questoes)...');
    const quizRes = await axios.get(`${baseURL}/quiz/questoes`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limite: 5 }
    });

    console.log('✅ Resposta recebida com sucesso!');
    console.log('Status:', quizRes.status);
    console.log(`Total de questões recebidas: ${quizRes.data.length}`);
    if (quizRes.data.length > 0) {
      console.log('Exemplo da primeira questão:', {
        id: quizRes.data[0].id,
        enunciado: quizRes.data[0].enunciado.substring(0, 60) + '...'
      });
    }

  } catch (error: any) {
    console.error('❌ Ocorreu um erro no teste:');
    if (error.response) {
      console.error('Status do erro:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    } else {
      console.error(error.message);
    }
  } finally {
    // Limpar usuário temporário do banco de dados
    console.log('\n🧹 Limpando dados de teste do banco...');
    await new Promise<void>((resolve) => {
      pool.query('DELETE FROM usuarios WHERE email = ?', [testEmail], (err) => {
        if (err) console.error('Erro ao deletar usuário temporário:', err.message);
        else console.log('✅ Dados de teste limpos!');
        resolve();
      });
    });
    pool.end();
  }
}

test().catch(err => {
  console.error('Erro geral no script:', err);
  pool.end();
});

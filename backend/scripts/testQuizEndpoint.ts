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
    const registerRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: testNome,
        email: testEmail,
        senha: testPassword
      })
    });
    if (!registerRes.ok) {
      throw new Error(`Erro ao cadastrar usuário: ${registerRes.status} ${await registerRes.text()}`);
    }
    console.log('✅ Usuário cadastrado com sucesso!');

    // 2. Fazer Login para obter o token JWT
    console.log('2. Efetuando login...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        senha: testPassword
      })
    });
    if (!loginRes.ok) {
      throw new Error(`Erro no login: ${loginRes.status} ${await loginRes.text()}`);
    }
    const loginData = await loginRes.json() as any;
    const token = loginData.token;
    console.log('✅ Login bem-sucedido! Token obtido:', token.substring(0, 20) + '...');

    // 3. Chamar o endpoint do Quiz
    console.log('3. Buscando questões no quiz (GET /api/quiz/questoes)...');
    const quizRes = await fetch(`${baseURL}/quiz/questoes?limite=5`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    if (!quizRes.ok) {
      throw new Error(`Erro ao buscar questões: ${quizRes.status} ${await quizRes.text()}`);
    }

    const quizData = await quizRes.json() as any[];
    console.log('✅ Resposta recebida com sucesso!');
    console.log('Status:', quizRes.status);
    console.log(`Total de questões recebidas: ${quizData.length}`);
    if (quizData.length > 0) {
      console.log('Exemplo da primeira questão:', {
        id: quizData[0].id,
        enunciado: quizData[0].enunciado.substring(0, 60) + '...'
      });
    }

  } catch (error: any) {
    console.error('❌ Ocorreu um erro no teste:');
    console.error(error.message);
  } finally {
    // Limpar usuário temporário do banco de dados
    console.log('\n🧹 Limpando dados de teste do banco...');
    try {
      await pool.query('DELETE FROM usuarios WHERE email = ?', [testEmail]);
      console.log('✅ Dados de teste limpos!');
    } catch (err: any) {
      console.error('Erro ao deletar usuário temporário:', err.message);
    }
    await pool.end();
  }
}

test().catch(err => {
  console.error('Erro geral no script:', err);
  pool.end();
});

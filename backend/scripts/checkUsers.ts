import pool from '../config/db';

async function check() {
  console.log('🔄 Buscando usuários no MySQL...');
  pool.query('SELECT id, nome, email, criado_em FROM usuarios', (err, results: any) => {
    if (err) {
      console.error('❌ Erro ao buscar usuários:', err.message);
      process.exit(1);
    }
    console.log(`✅ Busca concluída! Total de usuários cadastrados: ${results.length}`);
    console.log(JSON.stringify(results, null, 2));
    pool.end();
  });
}

check().catch(err => console.error(err));

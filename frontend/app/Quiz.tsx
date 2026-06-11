import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ENDPOINTS } from '../constants/Config';

interface Questao {
  id: number;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  categoria: string;
  ano: number;
  fase: number;
}

export default function Quiz() {
  const router = useRouter();

  // Estados de Fluxo
  const [faseQuiz, setFaseQuiz] = useState<'lobby' | 'jogando' | 'resultado'>('lobby');
  const [carregando, setCarregando] = useState(false);

  // Filtros (Lobby)
  const [anosDisponiveis] = useState<string[]>(['Todos', '2020', '2021']);
  const [anoSelecionado, setAnoSelecionado] = useState<string>('Todos');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [limiteQuestoes, setLimiteQuestoes] = useState<number>(10);

  // Questões e Progresso (Jogando)
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [indiceAtual, setIndiceAtual] = useState<number>(0);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<string | null>(null);
  
  // Resposta submetida
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [explicacaoIA, setExplicacaoIA] = useState<string>('');
  const [alternativaCorreta, setAlternativaCorreta] = useState<string>('');
  const [acertouQuestao, setAcertouQuestao] = useState<boolean>(false);
  const [totalAcertos, setTotalAcertos] = useState<number>(0);

  // Carrega categorias do DB ao iniciar o lobby
  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${ENDPOINTS.QUIZ}/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(['Todas', ...response.data]);
    } catch (error) {
      console.warn('Erro ao carregar categorias para o lobby:', error);
    }
  };

  // INICIAR SIMULADO
  const handleIniciarQuiz = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado para fazer o quiz');
        router.replace('/LoginScreen');
        return;
      }

      // Monta query params
      const params: any = { limite: limiteQuestoes };
      if (anoSelecionado !== 'Todos') params.ano = anoSelecionado;
      if (categoriaSelecionada !== 'Todas') params.categoria = categoriaSelecionada;

      const response = await axios.get(`${ENDPOINTS.QUIZ}/questoes`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.length === 0) {
        Alert.alert('Aviso', 'Nenhuma questão encontrada com os filtros selecionados.');
        return;
      }

      setQuestoes(response.data);
      setIndiceAtual(0);
      setAlternativaSelecionada(null);
      setRespostaConfirmada(false);
      setTotalAcertos(0);
      setFaseQuiz('jogando');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Não foi possível carregar as questões.';
      Alert.alert('Erro', msg);
    } finally {
      setCarregando(false);
    }
  };

  // ENVIAR / CONFIRMAR RESPOSTA
  const handleConfirmarResposta = async () => {
    if (!alternativaSelecionada || respostaConfirmada) return;

    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const questaoAtual = questoes[indiceAtual];

      const response = await axios.post(
        `${ENDPOINTS.QUIZ}/responder`,
        {
          questao_id: questaoAtual.id,
          resposta_escolhida: alternativaSelecionada
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { correta, resposta_correta, explicacao } = response.data;
      setAcertouQuestao(correta);
      setAlternativaCorreta(resposta_correta);
      setExplicacaoIA(explicacao || 'Sem explicação disponível.');
      setRespostaConfirmada(true);

      if (correta) {
        setTotalAcertos(prev => prev + 1);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao processar a resposta.');
    } finally {
      setCarregando(false);
    }
  };

  // IR PARA PRÓXIMA QUESTÃO
  const handleProximaQuestao = () => {
    setAlternativaSelecionada(null);
    setRespostaConfirmada(false);
    setExplicacaoIA('');
    setAlternativaCorreta('');

    if (indiceAtual + 1 < questoes.length) {
      setIndiceAtual(prev => prev + 1);
    } else {
      setFaseQuiz('resultado');
    }
  };

  // VOLTAR PRO LOBBY
  const handleVoltarLobby = () => {
    setFaseQuiz('lobby');
    setQuestoes([]);
    carregarCategorias(); // recarrega caso novas tenham sido adicionadas
  };

  // RENDERIZAÇÃO DE ESTADOS

  // 1. TELA LOBBY (FILTROS)
  const renderLobby = () => (
    <ScrollView contentContainerStyle={styles.lobbyContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.lobbySubtitulo}>Prepare-se para a Olimpíada Brasileira de Biologia (OBB)</Text>

      {/* Seletor de Ano */}
      <View style={styles.secaoFiltro}>
        <Text style={styles.filtroLabel}>Selecionar Prova (Ano):</Text>
        <View style={styles.grupoBotoes}>
          {anosDisponiveis.map(ano => (
            <TouchableOpacity
              key={ano}
              style={[styles.botaoOpcao, anoSelecionado === ano && styles.botaoOpcaoAtivo]}
              onPress={() => setAnoSelecionado(ano)}
            >
              <Text style={[styles.textoOpcao, anoSelecionado === ano && styles.textoOpcaoAtivo]}>
                {ano === 'Todos' ? 'Qualquer' : ano}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seletor de Categoria */}
      <View style={styles.secaoFiltro}>
        <Text style={styles.filtroLabel}>Filtrar por Tema:</Text>
        <View style={styles.grupoBotoesFlex}>
          {(categorias.length > 0 ? categorias : ['Todas']).map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.botaoBadge, categoriaSelecionada === cat && styles.botaoBadgeAtivo]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text style={[styles.textoBadge, categoriaSelecionada === cat && styles.textoBadgeAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quantidade de Questões */}
      <View style={styles.secaoFiltro}>
        <Text style={styles.filtroLabel}>Quantidade de Questões:</Text>
        <View style={styles.grupoBotoes}>
          {[5, 10, 15, 20].map(num => (
            <TouchableOpacity
              key={num}
              style={[styles.botaoOpcao, limiteQuestoes === num && styles.botaoOpcaoAtivo]}
              onPress={() => setLimiteQuestoes(num)}
            >
              <Text style={[styles.textoOpcao, limiteQuestoes === num && styles.textoOpcaoAtivo]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão de Iniciar */}
      <TouchableOpacity
        style={[styles.botaoPrincipal, carregando && styles.botaoDesabilitado]}
        onPress={handleIniciarQuiz}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotaoPrincipal}>Iniciar Simulado</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  // 2. TELA JOGANDO
  const renderJogando = () => {
    if (questoes.length === 0) return null;

    const questao = questoes[indiceAtual];
    const totalQuestoes = questoes.length;
    const progresso = (indiceAtual + 1) / totalQuestoes;

    // Função auxiliar para estilizar os cards de alternativas
    const getEstiloAlternativa = (letra: string) => {
      if (!respostaConfirmada) {
        return alternativaSelecionada === letra
          ? [styles.cardAlternativa, styles.cardAlternativaSelecionado]
          : styles.cardAlternativa;
      }

      // Se já foi respondido e confirmado
      if (letra === alternativaCorreta) {
        return [styles.cardAlternativa, styles.cardAlternativaCorreto];
      }
      if (alternativaSelecionada === letra && !acertouQuestao) {
        return [styles.cardAlternativa, styles.cardAlternativaErrado];
      }

      return styles.cardAlternativa;
    };

    const getEstiloTextoAlternativa = (letra: string) => {
      if (!respostaConfirmada) {
        return alternativaSelecionada === letra
          ? [styles.textoAlternativa, styles.textoAlternativaSelecionado]
          : styles.textoAlternativa;
      }

      if (letra === alternativaCorreta) {
        return [styles.textoAlternativa, styles.textoAlternativaCorreto];
      }
      if (alternativaSelecionada === letra && !acertouQuestao) {
        return [styles.textoAlternativa, styles.textoAlternativaErrado];
      }

      return styles.textoAlternativa;
    };

    return (
      <ScrollView contentContainerStyle={styles.jogandoContent} showsVerticalScrollIndicator={false}>
        {/* Barra de Progresso */}
        <View style={styles.containerProgresso}>
          <View style={styles.barraFundoProgresso}>
            <View style={[styles.barraAtivaProgresso, { width: `${progresso * 100}%` }]} />
          </View>
          <View style={styles.infoProgresso}>
            <Text style={styles.textoProgresso}>Questão {indiceAtual + 1} de {totalQuestoes}</Text>
            <Text style={styles.textoFiltrosQuestao}>{questao.categoria} • OBB {questao.ano}</Text>
          </View>
        </View>

        {/* Enunciado */}
        <View style={styles.cardEnunciado}>
          <Text style={styles.textoEnunciado}>{questao.enunciado}</Text>
        </View>

        {/* Alternativas */}
        <View style={styles.containerAlternativas}>
          {[
            { letra: 'A', texto: questao.alternativa_a },
            { letra: 'B', texto: questao.alternativa_b },
            { letra: 'C', texto: questao.alternativa_c },
            { letra: 'D', texto: questao.alternativa_d },
            { letra: 'E', texto: questao.alternativa_e }
          ].map(item => (
            <TouchableOpacity
              key={item.letra}
              style={getEstiloAlternativa(item.letra)}
              onPress={() => !respostaConfirmada && setAlternativaSelecionada(item.letra)}
              disabled={respostaConfirmada}
              activeOpacity={0.7}
            >
              <View style={styles.letraBadge}>
                <Text style={styles.letraTexto}>{item.letra}</Text>
              </View>
              <Text style={getEstiloTextoAlternativa(item.letra)}>{item.texto}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bloco de Explicação e Feedback (Pós-Resposta) */}
        {respostaConfirmada && (
          <View style={[styles.cardExplicacao, acertouQuestao ? styles.cardExplicacaoCorreto : styles.cardExplicacaoErrado]}>
            <Text style={styles.tituloExplicacao}>
              {acertouQuestao ? '🎉 Resposta Correta!' : '❌ Resposta Incorreta'}
            </Text>
            <Text style={styles.textoExplicacao}>{explicacaoIA}</Text>
          </View>
        )}

        {/* Botão de Ação */}
        {!respostaConfirmada ? (
          <TouchableOpacity
            style={[styles.botaoPrincipal, !alternativaSelecionada && styles.botaoDesabilitado]}
            onPress={handleConfirmarResposta}
            disabled={!alternativaSelecionada || carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotaoPrincipal}>Confirmar Resposta</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.botaoPrincipal} onPress={handleProximaQuestao}>
            <Text style={styles.textoBotaoPrincipal}>
              {indiceAtual + 1 < totalQuestoes ? 'Próxima Questão →' : 'Ver Resultados'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  // 3. TELA RESULTADO
  const renderResultado = () => {
    const totalQuestoes = questoes.length;
    const porcentagemAcertos = Math.round((totalAcertos / totalQuestoes) * 100);

    // Mensagem motivacional
    let feedbackMsg = 'Continue estudando! Pratique mais simulados para evoluir.';
    if (porcentagemAcertos >= 80) {
      feedbackMsg = 'Espetacular! Você está muito bem preparado para a olimpíada. Darwin ficaria orgulhoso!';
    } else if (porcentagemAcertos >= 50) {
      feedbackMsg = 'Bom desempenho! Revise os tópicos errados e tente melhorar no próximo.';
    }

    return (
      <View style={styles.resultadoContent}>
        <Text style={styles.resultadoTitulo}>Simulado Concluído!</Text>
        
        {/* Círculo do Score */}
        <View style={styles.resultadoCirculo}>
          <Text style={styles.resultadoScore}>{porcentagemAcertos}%</Text>
          <Text style={styles.resultadoScoreDetalhe}>{totalAcertos} de {totalQuestoes} acertos</Text>
        </View>

        <Text style={styles.resultadoFeedback}>{feedbackMsg}</Text>

        <TouchableOpacity style={styles.botaoPrincipal} onPress={handleVoltarLobby}>
          <Text style={styles.textoBotaoPrincipal}>Novo Simulado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoPrincipal, styles.botaoSecundario]} onPress={() => router.push('/Home')}>
          <Text style={styles.textoBotaoSecundario}>Voltar ao Menu Principal</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {faseQuiz === 'lobby' ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarText}>← Home</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleVoltarLobby} style={styles.voltarBtn}>
            <Text style={styles.voltarText}>← Abortar</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>SIMULADO QUIZ</Text>
        <Text style={styles.headerSubtitle}>Tutor OlympIA</Text>
      </View>

      {/* Renderiza a tela de acordo com o estado do fluxo */}
      {faseQuiz === 'lobby' && renderLobby()}
      {faseQuiz === 'jogando' && renderJogando()}
      {faseQuiz === 'resultado' && renderResultado()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cceaff' },
  header: { backgroundColor: '#024084', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20 },
  voltarBtn: { marginBottom: 6 },
  voltarText: { color: '#e4b93f', fontSize: 14, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  headerSubtitle: { color: '#e4b93f', fontSize: 12, textAlign: 'center', marginTop: 2 },
  
  // Lobby Styles
  lobbyContent: { padding: 20, paddingBottom: 40 },
  lobbySubtitulo: { fontSize: 16, textAlign: 'center', color: '#024084', marginBottom: 25, fontWeight: '500' },
  secaoFiltro: { marginBottom: 24 },
  filtroLabel: { fontSize: 15, fontWeight: 'bold', color: '#024084', marginBottom: 10 },
  grupoBotoes: { flexDirection: 'row', gap: 10 },
  grupoBotoesFlex: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  botaoOpcao: { flex: 1, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#dde3ec' },
  botaoOpcaoAtivo: { backgroundColor: '#024084', borderColor: '#024084' },
  textoOpcao: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  textoOpcaoAtivo: { color: '#fff' },
  botaoBadge: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dde3ec' },
  botaoBadgeAtivo: { backgroundColor: '#024084', borderColor: '#024084' },
  textoBadge: { color: '#555', fontSize: 13, fontWeight: '600' },
  textoBadgeAtivo: { color: '#fff' },

  // Jogando Styles
  jogandoContent: { padding: 16, paddingBottom: 40 },
  containerProgresso: { marginBottom: 16 },
  barraFundoProgresso: { height: 6, backgroundColor: '#fff', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  barraAtivaProgresso: { height: '100%', backgroundColor: '#024084' },
  infoProgresso: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textoProgresso: { fontSize: 13, fontWeight: 'bold', color: '#024084' },
  textoFiltrosQuestao: { fontSize: 11, color: '#666' },
  
  cardEnunciado: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#dde3ec' },
  textoEnunciado: { fontSize: 15, color: '#1a1a2e', lineHeight: 22, fontWeight: '500' },
  
  containerAlternativas: { gap: 10, marginBottom: 16 },
  cardAlternativa: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#dde3ec', alignItems: 'center', gap: 12 },
  cardAlternativaSelecionado: { borderColor: '#024084', backgroundColor: '#ebf5fb' },
  cardAlternativaCorreto: { borderColor: '#27ae60', backgroundColor: '#e8f8f5' },
  cardAlternativaErrado: { borderColor: '#c0392b', backgroundColor: '#fde8e8' },
  letraBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#024084', justifyContent: 'center', alignItems: 'center' },
  letraTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  textoAlternativa: { flex: 1, fontSize: 14, color: '#1a1a2e', lineHeight: 20 },
  textoAlternativaSelecionado: { color: '#024084', fontWeight: 'bold' },
  textoAlternativaCorreto: { color: '#27ae60', fontWeight: 'bold' },
  textoAlternativaErrado: { color: '#c0392b', fontWeight: 'bold' },

  // Explicação Styles
  cardExplicacao: { padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  cardExplicacaoCorreto: { backgroundColor: '#e8f8f5', borderColor: '#27ae60' },
  cardExplicacaoErrado: { backgroundColor: '#fdf2e9', borderColor: '#e67e22' },
  tituloExplicacao: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  textoExplicacao: { fontSize: 13, lineHeight: 18, color: '#444' },

  // Buttons
  botaoPrincipal: { backgroundColor: '#024084', padding: 15, borderRadius: 12, alignItems: 'center', marginVertical: 10 },
  botaoDesabilitado: { backgroundColor: '#a0b0c8' },
  textoBotaoPrincipal: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#024084' },
  textoBotaoSecundario: { color: '#024084', fontSize: 16, fontWeight: 'bold' },

  // Resultado Styles
  resultadoContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 },
  resultadoTitulo: { fontSize: 24, fontWeight: 'bold', color: '#024084', textAlign: 'center' },
  resultadoCirculo: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#fff', borderWidth: 6, borderColor: '#e4b93f', justifyContent: 'center', alignItems: 'center' },
  resultadoScore: { fontSize: 44, fontWeight: 'bold', color: '#024084' },
  resultadoScoreDetalhe: { fontSize: 13, color: '#666', marginTop: 4 },
  resultadoFeedback: { fontSize: 15, textAlign: 'center', color: '#024084', paddingHorizontal: 12, lineHeight: 22, fontWeight: '500' }
});

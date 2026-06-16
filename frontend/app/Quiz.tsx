import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useFonte } from '../utils/fontes';
import { Ionicons } from '@expo/vector-icons';
import { ENDPOINTS } from '../constants/Config';

// Habilita animações de layout simples no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const { t } = useTranslation();
  const fonte = useFonte();

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

  // Carrega categorias ao iniciar
  useEffect(() => {
    carregarCategorias();
  }, []);

  // Registra acertos nas conquistas ao finalizar o quiz
  useEffect(() => {
    if (faseQuiz === 'resultado') {
      registrarAcertosConquistas(totalAcertos);
    }
  }, [faseQuiz]);

  const carregarCategorias = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${ENDPOINTS.QUIZ}/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCategorias(['Todas', ...response.data]);
    } catch (error) {
      console.warn('Erro ao carregar categorias:', error);
    }
  };

  const registrarAcertosConquistas = async (acertos: number) => {
    try {
      const usuario_id = await AsyncStorage.getItem('usuario_id');
      if (!usuario_id || acertos === 0) return;

      await axios.post(`${ENDPOINTS.CONQUISTAS}/acerto`, {
        usuario_id: Number(usuario_id),
        acertos,
      });
    } catch (e) {
      // Silencioso
    }
  };

  // Mudar fase com animação
  const setFaseQuizComAnimacao = (fase: 'lobby' | 'jogando' | 'resultado') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFaseQuiz(fase);
  };

  // INICIAR SIMULADO
  const handleIniciarQuiz = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error') || 'Erro', 'Você precisa estar logado para fazer o quiz');
        router.replace('/LoginScreen');
        return;
      }

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
      setFaseQuizComAnimacao('jogando');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Não foi possível carregar as questões.';
      Alert.alert(t('error') || 'Erro', msg);
    } finally {
      setCarregando(false);
    }
  };

  // CONFIRMAR RESPOSTA
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { correta, resposta_correta, explicacao } = response.data;
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setAcertouQuestao(correta);
      setAlternativaCorreta(resposta_correta);
      setExplicacaoIA(explicacao || 'Sem explicação disponível.');
      setRespostaConfirmada(true);

      if (correta) {
        setTotalAcertos(prev => prev + 1);
      }
    } catch (error: any) {
      Alert.alert(t('error') || 'Erro', 'Falha ao processar a resposta.');
    } finally {
      setCarregando(false);
    }
  };

  // PRÓXIMA QUESTÃO
  const handleProximaQuestao = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAlternativaSelecionada(null);
    setRespostaConfirmada(false);
    setExplicacaoIA('');
    setAlternativaCorreta('');

    if (indiceAtual + 1 < questoes.length) {
      setIndiceAtual(prev => prev + 1);
    } else {
      setFaseQuizComAnimacao('resultado');
    }
  };

  // VOLTAR AO LOBBY
  const handleVoltarLobby = () => {
    setFaseQuizComAnimacao('lobby');
    setQuestoes([]);
    carregarCategorias();
  };

  // ─── TELA LOBBY ───────────────────────────────────────────────────────────

  const renderLobby = () => (
    <ScrollView contentContainerStyle={styles.lobbyContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.lobbySubtitulo, { fontSize: fonte.subtitulo }]}>
        Treine com questões oficiais e gabaritos comentados pela Inteligência Artificial.
      </Text>

      {/* CARD DE FILTROS */}
      <View style={styles.cardFiltros}>
        <View style={styles.secaoFiltro}>
          <View style={styles.filtroHeader}>
            <Ionicons name="calendar-outline" size={18} color="#004B9B" style={{ marginRight: 8 }} />
            <Text style={styles.filtroLabel}>Ano da Prova</Text>
          </View>
          <View style={styles.grupoBotoes}>
            {anosDisponiveis.map(ano => (
              <TouchableOpacity
                key={ano}
                style={[styles.botaoOpcao, anoSelecionado === ano && styles.botaoOpcaoAtivo]}
                onPress={() => setAnoSelecionado(ano)}
                activeOpacity={0.8}
              >
                <Text style={[styles.textoOpcao, { fontSize: fonte.texto }, anoSelecionado === ano && styles.textoOpcaoAtivo]}>
                  {ano === 'Todos' ? 'Qualquer' : ano}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.secaoFiltro}>
          <View style={styles.filtroHeader}>
            <Ionicons name="bookmark-outline" size={18} color="#004B9B" style={{ marginRight: 8 }} />
            <Text style={styles.filtroLabel}>Tema de Biologia</Text>
          </View>
          <View style={styles.grupoBotoesFlex}>
            {(categorias.length > 0 ? categorias : ['Todas']).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.botaoBadge, categoriaSelecionada === cat && styles.botaoBadgeAtivo]}
                onPress={() => setCategoriaSelecionada(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.textoBadge, { fontSize: fonte.texto - 2 }, categoriaSelecionada === cat && styles.textoBadgeAtivo]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.secaoFiltro}>
          <View style={styles.filtroHeader}>
            <Ionicons name="list-outline" size={18} color="#004B9B" style={{ marginRight: 8 }} />
            <Text style={styles.filtroLabel}>Número de Questões</Text>
          </View>
          <View style={styles.grupoBotoes}>
            {[5, 10, 15, 20].map(num => (
              <TouchableOpacity
                key={num}
                style={[styles.botaoOpcao, limiteQuestoes === num && styles.botaoOpcaoAtivo]}
                onPress={() => setLimiteQuestoes(num)}
                activeOpacity={0.8}
              >
                <Text style={[styles.textoOpcao, { fontSize: fonte.texto }, limiteQuestoes === num && styles.textoOpcaoAtivo]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.botaoPrincipal, carregando && styles.botaoDesabilitado]}
        onPress={handleIniciarQuiz}
        disabled={carregando}
        activeOpacity={0.8}
      >
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.textoBotaoPrincipal}>Iniciar Simulado</Text>
            <Ionicons name="play-circle-outline" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── TELA JOGANDO ─────────────────────────────────────────────────────────

  const renderJogando = () => {
    if (questoes.length === 0) return null;

    const questao = questoes[indiceAtual];
    const totalQuestoes = questoes.length;
    const progresso = (indiceAtual + 1) / totalQuestoes;

    const getEstiloAlternativa = (letra: string) => {
      if (!respostaConfirmada) {
        return alternativaSelecionada === letra
          ? [styles.cardAlternativa, styles.cardAlternativaSelecionado]
          : styles.cardAlternativa;
      }
      if (letra === alternativaCorreta) return [styles.cardAlternativa, styles.cardAlternativaCorreto];
      if (alternativaSelecionada === letra && !acertouQuestao) return [styles.cardAlternativa, styles.cardAlternativaErrado];
      return styles.cardAlternativa;
    };

    const getEstiloTextoAlternativa = (letra: string) => {
      if (!respostaConfirmada) {
        return alternativaSelecionada === letra
          ? [styles.textoAlternativa, styles.textoAlternativaSelecionado]
          : styles.textoAlternativa;
      }
      if (letra === alternativaCorreta) return [styles.textoAlternativa, styles.textoAlternativaCorreto];
      if (alternativaSelecionada === letra && !acertouQuestao) return [styles.textoAlternativa, styles.textoAlternativaErrado];
      return styles.textoAlternativa;
    };

    const getIconeBadge = (letra: string) => {
      if (!respostaConfirmada) {
        return <Text style={styles.letraTexto}>{letra}</Text>;
      }
      if (letra === alternativaCorreta) {
        return <Ionicons name="checkmark" size={16} color="#FFFFFF" />;
      }
      if (alternativaSelecionada === letra && !acertouQuestao) {
        return <Ionicons name="close" size={16} color="#FFFFFF" />;
      }
      return <Text style={styles.letraTexto}>{letra}</Text>;
    };

    const getEstiloBadge = (letra: string) => {
      if (!respostaConfirmada) {
        return alternativaSelecionada === letra
          ? [styles.letraBadge, styles.letraBadgeSelecionado]
          : styles.letraBadge;
      }
      if (letra === alternativaCorreta) return [styles.letraBadge, styles.letraBadgeCorreto];
      if (alternativaSelecionada === letra && !acertouQuestao) return [styles.letraBadge, styles.letraBadgeErrado];
      return styles.letraBadge;
    };

    return (
      <ScrollView contentContainerStyle={styles.jogandoContent} showsVerticalScrollIndicator={false}>
        {/* COMPONENTE DE PROGRESSO */}
        <View style={styles.containerProgresso}>
          <View style={styles.progressoHeader}>
            <View style={styles.capsulaQuestao}>
              <Text style={styles.textoProgresso}>Questão {indiceAtual + 1} de {totalQuestoes}</Text>
            </View>
            <View style={styles.capsulaMeta}>
              <Ionicons name="folder-open-outline" size={12} color="#004B9B" style={{ marginRight: 4 }} />
              <Text style={styles.textoFiltrosQuestao}>{questao.categoria} • OBB {questao.ano}</Text>
            </View>
          </View>
          <View style={styles.barraFundoProgresso}>
            <View style={[styles.barraAtivaProgresso, { width: `${progresso * 100}%` }]} />
          </View>
        </View>

        {/* CARTÃO DO ENUNCIADO */}
        <View style={styles.cardEnunciado}>
          <Text style={[styles.textoEnunciado, { fontSize: fonte.texto }]}>{questao.enunciado}</Text>
        </View>

        {/* CONTAINER DE ALTERNATIVAS */}
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
              <View style={getEstiloBadge(item.letra)}>
                {getIconeBadge(item.letra)}
              </View>
              <Text style={[getEstiloTextoAlternativa(item.letra), { fontSize: fonte.texto }]}>
                {item.texto}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EXPLICAÇÃO DO TUTOR */}
        {respostaConfirmada && (
          <View style={[styles.cardExplicacao, acertouQuestao ? styles.cardExplicacaoCorreto : styles.cardExplicacaoErrado]}>
            <View style={styles.explicacaoHeader}>
              <Ionicons 
                name={acertouQuestao ? "checkmark-circle" : "close-circle"} 
                size={22} 
                color={acertouQuestao ? "#2E7D32" : "#D32F2F"} 
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.tituloExplicacao, { color: acertouQuestao ? "#2E7D32" : "#D32F2F", fontSize: fonte.subtitulo }]}>
                {acertouQuestao ? 'Resposta Correta!' : 'Resposta Incorreta'}
              </Text>
            </View>
            <View style={styles.explicacaoIaBox}>
              <View style={styles.explicacaoIaTitleRow}>
                <Ionicons name="sparkles-outline" size={14} color="#E65100" style={{ marginRight: 6 }} />
                <Text style={styles.explicacaoIaTitle}>Explicação da OlympIA</Text>
              </View>
              <Text style={[styles.textoExplicacao, { fontSize: fonte.texto - 1 }]}>{explicacaoIA}</Text>
            </View>
          </View>
        )}

        {/* BOTOES DE AÇÃO */}
        {!respostaConfirmada ? (
          <TouchableOpacity
            style={[styles.botaoPrincipal, !alternativaSelecionada && styles.botaoDesabilitado]}
            onPress={handleConfirmarResposta}
            disabled={!alternativaSelecionada || carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.textoBotaoPrincipal}>Confirmar Resposta</Text>
                <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.botaoPrincipal} onPress={handleProximaQuestao} activeOpacity={0.8}>
            <Text style={styles.textoBotaoPrincipal}>
              {indiceAtual + 1 < totalQuestoes ? 'Próxima Questão' : 'Ver Resultados'}
            </Text>
            <Ionicons 
              name={indiceAtual + 1 < totalQuestoes ? "arrow-forward-outline" : "stats-chart-outline"} 
              size={20} 
              color="#FFFFFF" 
              style={{ marginLeft: 8 }} 
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  // ─── TELA RESULTADO ───────────────────────────────────────────────────────

  const renderResultado = () => {
    const totalQuestoes = questoes.length;
    const porcentagemAcertos = Math.round((totalAcertos / totalQuestoes) * 100);

    let feedbackMsg = 'Continue estudando! Pratique mais simulados para evoluir.';
    let medalIcon = 'medal-outline';
    let medalColor = '#78909C';

    if (porcentagemAcertos >= 80) {
      feedbackMsg = 'Espetacular! Você está muito bem preparado para a olimpíada. Darwin ficaria orgulhoso!';
      medalIcon = 'trophy';
      medalColor = '#FFD54F';
    } else if (porcentagemAcertos >= 50) {
      feedbackMsg = 'Bom desempenho! Revise os tópicos errados e tente melhorar no próximo.';
      medalIcon = 'medal';
      medalColor = '#E0E0E0';
    }

    return (
      <View style={styles.resultadoContent}>
        <Text style={[styles.resultadoTitulo, { fontSize: fonte.titulo }]}>Simulado Concluído!</Text>

        <View style={[styles.resultadoCirculo, { borderColor: medalColor }]}>
          <Ionicons name={medalIcon as any} size={44} color={medalColor} style={{ marginBottom: 6 }} />
          <Text style={styles.resultadoScore}>{porcentagemAcertos}%</Text>
          <Text style={styles.resultadoScoreDetalhe}>{totalAcertos} de {totalQuestoes} acertos</Text>
        </View>

        <View style={styles.resultadoFeedbackCard}>
          <Text style={[styles.resultadoFeedback, { fontSize: fonte.texto }]}>{feedbackMsg}</Text>
        </View>

        <View style={styles.resultadoButtonsContainer}>
          <TouchableOpacity style={styles.botaoPrincipal} onPress={handleVoltarLobby} activeOpacity={0.8}>
            <Text style={styles.textoBotaoPrincipal}>Novo Simulado</Text>
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.botaoPrincipal, styles.botaoSecundario]} 
            onPress={() => router.replace('/Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSecundario}>Voltar ao Início</Text>
            <Ionicons name="home-outline" size={20} color="#004B9B" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {faseQuiz === 'lobby' ? (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#004B9B" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleVoltarLobby} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={24} color="#D32F2F" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { fontSize: fonte.titulo }]}>
            {faseQuiz === 'lobby' ? 'SIMULADO QUIZ' : faseQuiz === 'jogando' ? 'SIMULADO EM CURSO' : 'RESULTADO'}
          </Text>
          <Text style={styles.headerSubtitle}>Tutor Inteligente OlympIA</Text>
        </View>
      </View>

      {faseQuiz === 'lobby' && renderLobby()}
      {faseQuiz === 'jogando' && renderJogando()}
      {faseQuiz === 'resultado' && renderResultado()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F9FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E1F0FC',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F9FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E1F0FC',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#004B9B',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#6085a6',
    fontSize: 13,
    marginTop: 2,
  },

  // Lobby Styles
  lobbyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  lobbySubtitulo: {
    textAlign: 'center',
    color: '#546E7A',
    marginBottom: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  cardFiltros: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  secaoFiltro: {
    paddingVertical: 10,
  },
  filtroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004B9B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grupoBotoes: {
    flexDirection: 'row',
    gap: 8,
  },
  grupoBotoesFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoOpcao: {
    flex: 1,
    backgroundColor: '#F8FBFE',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0FC',
  },
  botaoOpcaoAtivo: {
    backgroundColor: '#004B9B',
    borderColor: '#004B9B',
  },
  textoOpcao: {
    color: '#546E7A',
    fontWeight: '700',
  },
  textoOpcaoAtivo: {
    color: '#FFFFFF',
  },
  botaoBadge: {
    backgroundColor: '#F8FBFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1F0FC',
  },
  botaoBadgeAtivo: {
    backgroundColor: '#004B9B',
    borderColor: '#004B9B',
  },
  textoBadge: {
    color: '#546E7A',
    fontWeight: '600',
  },
  textoBadgeAtivo: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F5FA',
    marginVertical: 8,
  },

  // Jogando Styles
  jogandoContent: {
    padding: 16,
    paddingBottom: 40,
  },
  containerProgresso: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E1F0FC',
  },
  progressoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  capsulaQuestao: {
    backgroundColor: '#E1F0FC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoProgresso: {
    fontWeight: '700',
    color: '#004B9B',
    fontSize: 12,
  },
  capsulaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoFiltrosQuestao: {
    fontSize: 12,
    color: '#546E7A',
    fontWeight: '600',
  },
  barraFundoProgresso: {
    height: 8,
    backgroundColor: '#CFD8DC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraAtivaProgresso: {
    height: '100%',
    backgroundColor: '#004B9B',
  },
  cardEnunciado: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textoEnunciado: {
    color: '#2C3E50',
    lineHeight: 24,
    fontWeight: '500',
  },
  containerAlternativas: {
    gap: 12,
    marginBottom: 16,
  },
  cardAlternativa: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardAlternativaSelecionado: {
    borderColor: '#004B9B',
    backgroundColor: '#E1F0FC',
  },
  cardAlternativaCorreto: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  cardAlternativaErrado: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  letraBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#004B9B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letraBadgeSelecionado: {
    backgroundColor: '#004B9B',
    borderColor: '#004B9B',
  },
  letraBadgeCorreto: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  letraBadgeErrado: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  letraTexto: {
    color: '#004B9B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoAlternativa: {
    flex: 1,
    color: '#2C3E50',
    lineHeight: 20,
  },
  textoAlternativaSelecionado: {
    color: '#004B9B',
    fontWeight: '700',
  },
  textoAlternativaCorreto: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  textoAlternativaErrado: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  cardExplicacao: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardExplicacaoCorreto: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  cardExplicacaoErrado: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFCC80',
  },
  explicacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tituloExplicacao: {
    fontWeight: 'bold',
  },
  explicacaoIaBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F5FA',
  },
  explicacaoIaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  explicacaoIaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E65100',
    textTransform: 'uppercase',
  },
  textoExplicacao: {
    lineHeight: 20,
    color: '#455A64',
  },

  // Botões
  botaoPrincipal: {
    backgroundColor: '#004B9B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  botaoDesabilitado: {
    backgroundColor: '#B3D7F7',
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#004B9B',
  },
  textoBotaoSecundario: {
    color: '#004B9B',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Resultado Styles
  resultadoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 20,
  },
  resultadoTitulo: {
    fontWeight: 'bold',
    color: '#004B9B',
    textAlign: 'center',
  },
  resultadoCirculo: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resultadoScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004B9B',
  },
  resultadoScoreDetalhe: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 2,
    fontWeight: '600',
  },
  resultadoFeedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    padding: 16,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resultadoFeedback: {
    textAlign: 'center',
    color: '#546E7A',
    lineHeight: 22,
    fontWeight: '500',
  },
  resultadoButtonsContainer: {
    width: '100%',
    marginTop: 10,
  },
});

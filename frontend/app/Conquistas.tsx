import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useFonte } from '../utils/fontes';
import { Ionicons } from '@expo/vector-icons';
import { achievements } from "../constants/achievements";
import { ENDPOINTS } from "../constants/Config";

// Habilita animações de layout simples no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Conquistas() {
  const router = useRouter();
  const { t } = useTranslation();
  const fonte = useFonte();

  const [streakAtual, setStreakAtual] = useState(0);
  const [acertosTotais, setAcertosTotais] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProgresso();
    registrarAcesso();
  }, []);

  const registrarAcesso = async () => {
    try {
      const usuario_id = await AsyncStorage.getItem("usuario_id");
      if (!usuario_id) return;
      await axios.post(`${ENDPOINTS.CONQUISTAS}/acesso`, { usuario_id: Number(usuario_id) });
    } catch (e) {
      // silencioso
    }
  };

  const carregarProgresso = async () => {
    try {
      const usuario_id = await AsyncStorage.getItem("usuario_id");
      if (!usuario_id) return;

      const response = await axios.get(`${ENDPOINTS.CONQUISTAS}/${usuario_id}`);
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setStreakAtual(response.data.streak_atual);
      setAcertosTotais(response.data.acertos_totais);
    } catch (e) {
      // usa valores padrão 0
    } finally {
      setCarregando(false);
    }
  };

  // Calcula o progresso real de cada conquista
  const achievementsComProgresso = useMemo(() => {
    return achievements.map((item) => {
      const progresso = item.tipo === "quiz" ? acertosTotais : streakAtual;
      const desbloqueado = progresso >= item.objetivo;
      return { ...item, progresso: Math.min(progresso, item.objetivo), desbloqueado };
    });
  }, [streakAtual, acertosTotais]);

  const desbloqueadas = useMemo(() => {
    return achievementsComProgresso.filter((item) => item.desbloqueado).length;
  }, [achievementsComProgresso]);

  const renderBarra = (progresso: number, objetivo: number, desbloqueado: boolean) => {
    const porcentagem = Math.min((progresso / objetivo) * 100, 100);
    return (
      <View style={styles.progressBackground}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${porcentagem}%`,
              backgroundColor: desbloqueado ? '#FFD54F' : '#004B9B' 
            }
          ]} 
        />
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#004B9B" />
        <Text style={[styles.loadingText, { fontSize: fonte.texto }]}>
          Carregando jornada...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#004B9B" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { fontSize: fonte.titulo }]}>
              JORNADA AO OLIMPO
            </Text>
            <Text style={styles.subtitulo}>
              {desbloqueadas} de {achievementsComProgresso.length} bênçãos recebidas
            </Text>
          </View>
        </View>

        {/* Resumo de streak e acertos (Glassmorphism layout) */}
        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <View style={styles.resumoValueRow}>
              <Ionicons name="flame" size={20} color="#FF6D00" style={{ marginRight: 6 }} />
              <Text style={styles.resumoNumero}>{streakAtual}</Text>
            </View>
            <Text style={styles.resumoLabel}>Dias Seguidos</Text>
          </View>
          
          <View style={styles.resumoDivisor} />
          
          <View style={styles.resumoItem}>
            <View style={styles.resumoValueRow}>
              <Ionicons name="trophy" size={20} color="#FFD54F" style={{ marginRight: 6 }} />
              <Text style={styles.resumoNumero}>{acertosTotais}</Text>
            </View>
            <Text style={styles.resumoLabel}>Acertos no Quiz</Text>
          </View>
        </View>
      </View>

      {/* LISTA DE CONQUISTAS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {achievementsComProgresso.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.card, 
              item.desbloqueado ? styles.cardDesbloqueado : styles.cardBloqueado
            ]}
          >
            <View style={styles.cardHeader}>
              <View 
                style={[
                  styles.emojiContainer, 
                  item.desbloqueado ? styles.emojiContainerDesbloqueado : styles.emojiContainerBloqueado
                ]}
              >
                {item.desbloqueado ? (
                  <Text style={styles.emoji}>{item.emoji}</Text>
                ) : (
                  <Ionicons name="lock-closed" size={20} color="#90A4AE" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.badgeDeus}>
                  <Text style={styles.deus}>BÊNÇÃO DE {item.deus.toUpperCase()}</Text>
                </View>
                <Text style={[styles.nome, { fontSize: fonte.texto + 1 }]}>{item.nome}</Text>
              </View>
            </View>

            <Text style={[styles.descricao, { fontSize: fonte.texto - 1 }]}>
              {item.descricao}
            </Text>

            {renderBarra(item.progresso, item.objetivo, item.desbloqueado)}

            <View style={styles.footer}>
              <Text style={[styles.progresso, { fontSize: fonte.pequeno + 2 }]}>
                Progresso: {item.progresso} / {item.objetivo}
              </Text>

              {item.desbloqueado ? (
                <View style={[styles.badgeStatus, styles.badgeConquistado]}>
                  <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeTexto}>Recebida</Text>
                </View>
              ) : (
                <View style={[styles.badgeStatus, styles.badgeProgresso]}>
                  <Ionicons name="time-outline" size={14} color="#004B9B" style={{ marginRight: 4 }} />
                  <Text style={[styles.badgeTexto, { color: '#004B9B' }]}>Em Progresso</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F9FD",
    gap: 12,
  },
  loadingText: {
    color: "#004B9B",
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#004B9B",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  subtitulo: {
    marginTop: 2,
    color: "#B3D7F7",
    fontSize: 14,
    fontWeight: '500',
  },
  resumo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resumoItem: {
    alignItems: "center",
    flex: 1,
  },
  resumoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumoNumero: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  resumoLabel: {
    color: "#B3D7F7",
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  resumoDivisor: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  scroll: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1F0FC",
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDesbloqueado: {
    borderWidth: 1.5,
    borderColor: "#FFD54F",
    backgroundColor: "#FFFDF2",
  },
  cardBloqueado: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
  },
  emojiContainerDesbloqueado: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFD54F',
  },
  emojiContainerBloqueado: {
    backgroundColor: '#F0F4F8',
    borderColor: '#CFD8DC',
  },
  emoji: {
    fontSize: 26,
  },
  badgeDeus: {
    backgroundColor: '#E1F0FC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  deus: {
    fontSize: 10,
    color: "#004B9B",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  nome: {
    color: "#2C3E50",
    fontWeight: "bold",
  },
  descricao: {
    marginBottom: 14,
    color: "#546E7A",
    lineHeight: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#CFD8DC",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progresso: {
    color: "#546E7A",
    fontWeight: "700",
  },
  badgeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeConquistado: {
    backgroundColor: "#2E7D32",
  },
  badgeProgresso: {
    backgroundColor: "#E1F0FC",
    borderWidth: 1,
    borderColor: '#B3D7F7',
  },
  badgeTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});

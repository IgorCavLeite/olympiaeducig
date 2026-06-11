import React, { useMemo, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { achievements } from "../constants/achievements";
import { ENDPOINTS } from "../constants/Config";

export default function Conquistas() {
  const router = useRouter();
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

  const renderBarra = (progresso: number, objetivo: number) => {
    const porcentagem = Math.min((progresso / objetivo) * 100, 100);
    return (
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${porcentagem}%` }]} />
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#024084" />
        <Text style={styles.loadingText}>Carregando conquistas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>JORNADA AO OLIMPO</Text>
        <Text style={styles.subtitulo}>
          {desbloqueadas}/{achievementsComProgresso.length} conquistas desbloqueadas
        </Text>

        {/* Resumo de streak e acertos */}
        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNumero}>🔥 {streakAtual}</Text>
            <Text style={styles.resumoLabel}>dias seguidos</Text>
          </View>
          <View style={styles.resumoDivisor} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNumero}>✅ {acertosTotais}</Text>
            <Text style={styles.resumoLabel}>acertos no quiz</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {achievementsComProgresso.map((item) => (
          <View key={item.id} style={[styles.card, item.desbloqueado && styles.cardDesbloqueado]}>
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.deus}>{item.deus}</Text>
                <Text style={styles.nome}>{item.nome}</Text>
              </View>
            </View>

            <Text style={styles.descricao}>{item.descricao}</Text>

            {renderBarra(item.progresso, item.objetivo)}

            <View style={styles.footer}>
              <Text style={styles.progresso}>
                {item.progresso}/{item.objetivo}
              </Text>

              {item.desbloqueado ? (
                <View style={styles.badgeConquistado}>
                  <Text style={styles.badgeTexto}>✓ Conquistada</Text>
                </View>
              ) : (
                <View style={styles.badgeProgresso}>
                  <Text style={styles.badgeTexto}>Em progresso</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#cceaff" 
  },
  loading: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#cceaff" 
  },
  loadingText: { 
    marginTop: 12, 
    color: "#666", 
    fontSize: 15 
  },
  header: { 
    backgroundColor: "#024084", 
    paddingTop: 50, 
    paddingBottom: 20, 
    paddingHorizontal: 20 
  },
  voltarBtn: { 
    marginBottom: 10 
  },
  voltarText: { 
    color: "#e4b93f", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 26, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  subtitulo: { 
    marginTop: 8, 
    textAlign: "center", 
    color: "#ffffff", 
    opacity: 0.9, 
    fontSize: 15 },
  resumo: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 16, 
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: 12, 
    padding: 12 
  },
  resumoItem: { 
    alignItems: "center", 
    flex: 1 
  },
  resumoNumero: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  resumoLabel: { 
    color: "#ccc", 
    fontSize: 12, 
    marginTop: 2 
  },
  resumoDivisor: { 
    width: 1, 
    height: 36, 
    backgroundColor: "rgba(255,255,255,0.3)" 
  },
  scroll: { 
    padding: 20 
  },
  card: { 
    backgroundColor: "#ffffff", 
    borderRadius: 18, 
    padding: 18, 
    marginBottom: 18, 
    elevation: 4 
  },
  cardDesbloqueado: { 
    borderWidth: 2, 
    borderColor: "#e4b93f" 
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10 
  },
  emoji: { 
    fontSize: 34, 
    marginRight: 15 
  },
  deus: { 
    fontSize: 20, 
    color: "#024084", 
    fontWeight: "bold" 
  },
  nome: { 
    fontSize: 15, 
    color: "#555", 
    marginTop: 2 
  },
  descricao: { 
    marginTop: 10, 
    marginBottom: 12, 
    color: "#444", 
    fontSize: 15, 
    lineHeight: 22 
  },
  progressBackground: { 
    height: 10, 
    backgroundColor: "#d9d9d9", 
    borderRadius: 50, 
    overflow: "hidden" 
  },
  progressFill: { 
    height: 10, 
    backgroundColor: "#024084", 
    borderRadius: 50 
  },
  footer: { 
    marginTop: 15, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  progresso: { 
    color: "#024084", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  badgeConquistado: { 
    backgroundColor: "#e4b93f", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  badgeProgresso: { 
    backgroundColor: "#024084", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  badgeTexto: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 12 
  },
});

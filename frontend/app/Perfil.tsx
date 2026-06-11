import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Keyboard,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';
import { ENDPOINTS } from '../constants/Config';

interface Stats {
  totalRespondidas: number;
  totalCorretas: number;
  precisao: number;
}

export default function Perfil() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState<Stats>({ totalRespondidas: 0, totalCorretas: 0, precisao: 0 });
  const [carregandoDados, setCarregandoDados] = useState(true);

  // Modal Editar Nome
  const [modalNomeVisible, setModalNomeVisible] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [salvandoNome, setSalvandoNome] = useState(false);

  // Modal Alterar Senha
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    setCarregandoDados(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/LoginScreen');
        return;
      }

      // Faz chamada protegida ao backend para obter os dados cadastrais e estatísticas
      const response = await axios.get(`${ENDPOINTS.AUTH}/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { user, stats: fetchedStats } = response.data;
      setUsername(user.nome);
      setEmail(user.email);
      setStats(fetchedStats);

      // Sincroniza localmente no cache por segurança
      await AsyncStorage.setItem('username', user.nome);
    } catch (error: any) {
      console.warn('Erro ao carregar dados do perfil do backend:', error.message);
      
      // Fallback local se estiver offline
      const nomeLocal = await AsyncStorage.getItem('username');
      if (nomeLocal) setUsername(nomeLocal);
    } finally {
      setCarregandoDados(false);
    }
  };

  // EDITAR NOME
  const handleEditarNome = async () => {
    Keyboard.dismiss();

    if (!novoNome.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    setSalvandoNome(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${ENDPOINTS.AUTH}/perfil`, 
        { nome: novoNome.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await AsyncStorage.setItem('username', novoNome.trim());
      setUsername(novoNome.trim());
      setModalNomeVisible(false);
      setNovoNome('');
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Não foi possível atualizar o nome.';
      Alert.alert('Erro', msg);
    } finally {
      setSalvandoNome(false);
    }
  };

  // ALTERAR SENHA
  const handleAlterarSenha = async () => {
    Keyboard.dismiss();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setSalvandoSenha(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${ENDPOINTS.AUTH}/senha`, 
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalSenhaVisible(false);
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Não foi possível alterar a senha.';
      Alert.alert('Erro', mensagem);
    } finally {
      setSalvandoSenha(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/');
        },
      },
    ]);
  };

  // INICIAIS DO AVATAR
  const iniciais = username
    ? username
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERFIL</Text>
        <Text style={styles.headerSubtitle}>Tutor OlympIA</Text>
      </View>

      {carregandoDados ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#024084" />
          <Text style={styles.loaderText}>Carregando perfil...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* AVATAR */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* PAINEL DE ESTATÍSTICAS */}
          <View style={styles.statsCardContainer}>
            <Text style={styles.statsTitle}>📊 Estatísticas do Simulado</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.totalRespondidas}</Text>
                <Text style={styles.statLabel}>Respondidas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#27ae60' }]}>{stats.totalCorretas}</Text>
                <Text style={styles.statLabel}>Corretas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#e67e22' }]}>{stats.precisao}%</Text>
                <Text style={styles.statLabel}>Precisão</Text>
              </View>
            </View>
          </View>

          {/* OPÇÕES */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { setNovoNome(username); setModalNomeVisible(true); }}
            >
              <Text style={styles.buttonText}>Editar Nome</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalSenhaVisible(true)}
            >
              <Text style={styles.buttonText}>Alterar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* MODAL EDITAR NOME */}
      <Modal visible={modalNomeVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Nome</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Novo nome"
              placeholderTextColor="#999"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancelar]}
                onPress={() => { setModalNomeVisible(false); setNovoNome(''); }}
              >
                <Text style={styles.modalBtnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSalvar]}
                onPress={handleEditarNome}
                disabled={salvandoNome}
              >
                {salvandoNome
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalBtnSalvarText}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={modalSenhaVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Alterar Senha</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Senha atual"
              placeholderTextColor="#999"
              secureTextEntry
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nova senha (mínimo 8 caracteres)"
              placeholderTextColor="#999"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancelar]}
                onPress={() => {
                  setModalSenhaVisible(false);
                  setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
                }}
              >
                <Text style={styles.modalBtnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSalvar]}
                onPress={handleAlterarSenha}
                disabled={salvandoSenha}
              >
                {salvandoSenha
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalBtnSalvarText}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { color: '#024084', fontSize: 15, fontWeight: '500' },
  
  scrollContent: { paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginTop: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#024084', borderWidth: 4, borderColor: '#e4b93f', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  username: { marginTop: 12, fontSize: 20, fontWeight: 'bold', color: '#024084', textAlign: 'center', paddingHorizontal: 20 },
  userEmail: { fontSize: 13, color: '#555', marginTop: 2 },

  // Painel de Estatísticas
  statsCardContainer: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 24, padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#dde3ec', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statsTitle: { fontSize: 15, fontWeight: 'bold', color: '#024084', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  statBox: { flex: 1, backgroundColor: '#f0f4f8', padding: 10, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4, fontWeight: '500' },

  // Opções Styles
  optionsContainer: { marginTop: 24, paddingHorizontal: 20 },
  button: { backgroundColor: '#024084', padding: 14, borderRadius: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#c0392b' },

  // Modais Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#024084', marginBottom: 20 },
  modalInput: { backgroundColor: '#f0f4f8', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 12, color: '#1a1a2e', borderWidth: 1, borderColor: '#dde3ec' },
  modalBotoes: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalBtnCancelar: { backgroundColor: '#f0f4f8' },
  modalBtnCancelarText: { color: '#555', fontWeight: '600' },
  modalBtnSalvar: { backgroundColor: '#024084' },
  modalBtnSalvarText: { color: '#fff', fontWeight: '600' },
});

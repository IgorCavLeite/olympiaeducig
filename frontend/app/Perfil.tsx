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
  ScrollView,
  Platform,
  LayoutAnimation,
  UIManager,
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

interface Stats {
  totalRespondidas: number;
  totalCorretas: number;
  precisao: number;
}

export default function Perfil() {
  const router = useRouter();
  const { t } = useTranslation();
  const fonte = useFonte();

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

      const response = await axios.get(`${ENDPOINTS.AUTH}/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { user, stats: fetchedStats } = response.data;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsername(user.nome);
      setEmail(user.email);
      setStats(fetchedStats);

      await AsyncStorage.setItem('username', user.nome);
    } catch (error: any) {
      console.warn('Erro ao carregar dados do perfil do backend:', error.message);
      
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
      Alert.alert(t('error') || 'Erro', t('emptyName') || 'O nome não pode estar vazio');
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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsername(novoNome.trim());
      setModalNomeVisible(false);
      setNovoNome('');
      Alert.alert(t('success') || 'Sucesso', t('nameUpdated') || 'Nome atualizado com sucesso!');
    } catch (error: any) {
      const msg = error.response?.data?.error || t('profileUpdateError') || 'Não foi possível atualizar o nome.';
      Alert.alert(t('error') || 'Erro', msg);
    } finally {
      setSalvandoNome(false);
    }
  };

  // ALTERAR SENHA
  const handleAlterarSenha = async () => {
    Keyboard.dismiss();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert(t('error') || 'Erro', t('fillFields') || 'Preencha todos os campos');
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert(t('error') || 'Erro', t('passwordMinError') || 'A nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert(t('error') || 'Erro', t('passwordMismatch') || 'As senhas não coincidem');
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
      Alert.alert(t('success') || 'Sucesso', t('passwordUpdated') || 'Senha alterada com sucesso!');
    } catch (error: any) {
      const mensagem = error.response?.data?.error || t('passwordChangeError') || 'Não foi possível alterar a senha.';
      Alert.alert(t('error') || 'Erro', mensagem);
    } finally {
      setSalvandoSenha(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    Alert.alert(t('logout') || 'Sair', t('logoutConfirm') || 'Tem certeza que deseja sair?', [
      { text: t('cancel') || 'Cancelar', style: 'cancel' },
      {
        text: t('logout') || 'Sair',
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#004B9B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { fontSize: fonte.titulo }]}>
            {t('profile') || 'Perfil'}
          </Text>
          <Text style={styles.headerSubtitle}>Bons estudos, {username.split(' ')[0]}!</Text>
        </View>
      </View>

      {carregandoDados ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#004B9B" />
          <Text style={[styles.loaderText, { fontSize: fonte.texto }]}>
            Carregando perfil...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* AVATAR CARD */}
          <View style={styles.avatarCard}>
            <TouchableOpacity 
              style={styles.avatarWrapper} 
              activeOpacity={0.85}
              onPress={() => { setNovoNome(username); setModalNomeVisible(true); }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </View>
              <View style={styles.editAvatarBadge}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.username, { fontSize: fonte.titulo }]}>{username}</Text>
            <Text style={[styles.userEmail, { fontSize: fonte.texto }]}>{email}</Text>
          </View>

          {/* ESTÁTISTICAS DO SIMULADO */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Ionicons name="stats-chart" size={20} color="#004B9B" style={{ marginRight: 8 }} />
              <Text style={[styles.statsTitle, { fontSize: fonte.subtitulo }]}>
                Estatísticas do Simulado
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={[styles.statIconBg, { backgroundColor: '#E1F0FC' }]}>
                  <Ionicons name="book-outline" size={20} color="#004B9B" />
                </View>
                <Text style={styles.statValue}>{stats.totalRespondidas}</Text>
                <Text style={styles.statLabel}>Respondidas</Text>
              </View>
              
              <View style={styles.statBox}>
                <View style={[styles.statIconBg, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="checkmark-done-circle-outline" size={20} color="#2E7D32" />
                </View>
                <Text style={[styles.statValue, { color: '#2E7D32' }]}>{stats.totalCorretas}</Text>
                <Text style={styles.statLabel}>Corretas</Text>
              </View>

              <View style={styles.statBox}>
                <View style={[styles.statIconBg, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="analytics-outline" size={20} color="#E65100" />
                </View>
                <Text style={[styles.statValue, { color: '#E65100' }]}>{stats.precisao}%</Text>
                <Text style={styles.statLabel}>Precisão</Text>
              </View>
            </View>

            {/* BARRA DE PROGRESSO DE PRECISÃO */}
            <View style={styles.precisionProgressContainer}>
              <View style={styles.precisionTextRow}>
                <Text style={styles.precisionProgressLabel}>Aproveitamento Geral</Text>
                <Text style={styles.precisionProgressPercent}>{stats.precisao}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${stats.precisao}%`,
                      backgroundColor: stats.precisao > 70 ? '#2E7D32' : stats.precisao > 40 ? '#FF9800' : '#D32F2F'
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* OPÇÕES MENU (SETTINGS RAYS STYLE) */}
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => { setNovoNome(username); setModalNomeVisible(true); }}
              activeOpacity={0.6}
            >
              <View style={styles.menuRowLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: '#E1F0FC' }]}>
                  <Ionicons name="person-outline" size={18} color="#004B9B" />
                </View>
                <Text style={[styles.menuText, { fontSize: fonte.texto }]}>
                  {t('editName') || 'Editar Nome'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setModalSenhaVisible(true)}
              activeOpacity={0.6}
            >
              <View style={styles.menuRowLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: '#EDE7F6' }]}>
                  <Ionicons name="key-outline" size={18} color="#5E35B1" />
                </View>
                <Text style={[styles.menuText, { fontSize: fonte.texto }]}>
                  {t('changePassword') || 'Alterar Senha'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleLogout}
              activeOpacity={0.6}
            >
              <View style={styles.menuRowLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
                </View>
                <Text style={[styles.menuText, { color: '#D32F2F', fontSize: fonte.texto }]}>
                  {t('logout') || 'Sair da Conta'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FFCDD2" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* MODAL EDITAR NOME */}
      <Modal visible={modalNomeVisible} transparent animationType="slide" onRequestClose={() => setModalNomeVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { fontSize: fonte.titulo }]}>
                {t('editName') || 'Editar Nome'}
              </Text>
              <TouchableOpacity onPress={() => setModalNomeVisible(false)}>
                <Ionicons name="close" size={24} color="#546E7A" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputIconWrapper}>
              <Ionicons name="person-outline" size={20} color="#004B9B" style={styles.inputFieldIcon} />
              <TextInput
                style={[styles.modalInput, { fontSize: fonte.texto }]}
                placeholder={t('newName') || 'Novo nome'}
                placeholderTextColor="#90A4AE"
                value={novoNome}
                onChangeText={setNovoNome}
              />
            </View>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancelar]}
                onPress={() => { setModalNomeVisible(false); setNovoNome(''); }}
              >
                <Text style={styles.modalBtnCancelarText}>{t('cancel') || 'Cancelar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSalvar]}
                onPress={handleEditarNome}
                disabled={salvandoNome}
              >
                {salvandoNome ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalBtnSalvarText}>{t('save') || 'Salvar'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={modalSenhaVisible} transparent animationType="slide" onRequestClose={() => setModalSenhaVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { fontSize: fonte.titulo }]}>
                {t('changePassword') || 'Alterar Senha'}
              </Text>
              <TouchableOpacity onPress={() => setModalSenhaVisible(false)}>
                <Ionicons name="close" size={24} color="#546E7A" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputIconWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#004B9B" style={styles.inputFieldIcon} />
              <TextInput
                style={[styles.modalInput, { fontSize: fonte.texto }]}
                placeholder={t('currentPassword') || 'Senha atual'}
                placeholderTextColor="#90A4AE"
                secureTextEntry
                value={senhaAtual}
                onChangeText={setSenhaAtual}
              />
            </View>

            <View style={styles.inputIconWrapper}>
              <Ionicons name="key-outline" size={20} color="#5E35B1" style={styles.inputFieldIcon} />
              <TextInput
                style={[styles.modalInput, { fontSize: fonte.texto }]}
                placeholder={t('newPassword') || 'Nova senha'}
                placeholderTextColor="#90A4AE"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
            </View>

            <View style={styles.inputIconWrapper}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#5E35B1" style={styles.inputFieldIcon} />
              <TextInput
                style={[styles.modalInput, { fontSize: fonte.texto }]}
                placeholder={t('confirmPassword') || 'Confirmar nova senha'}
                placeholderTextColor="#90A4AE"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancelar]}
                onPress={() => {
                  setModalSenhaVisible(false);
                  setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
                }}
              >
                <Text style={styles.modalBtnCancelarText}>{t('cancel') || 'Cancelar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSalvar]}
                onPress={handleAlterarSenha}
                disabled={salvandoSenha}
              >
                {salvandoSenha ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalBtnSalvarText}>{t('save') || 'Salvar'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    color: '#004B9B',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0FC',
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#004B9B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFE082',
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#004B9B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#004B9B',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  userEmail: {
    color: '#546E7A',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1F0FC',
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#F0F5FA',
    paddingBottom: 10,
  },
  statsTitle: {
    color: '#004B9B',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FBFE',
    borderWidth: 1,
    borderColor: '#F0F5FA',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 4,
    fontWeight: '600',
  },
  precisionProgressContainer: {
    backgroundColor: '#F8FBFE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F5FA',
  },
  precisionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  precisionProgressLabel: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
  },
  precisionProgressPercent: {
    fontSize: 13,
    color: '#004B9B',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CFD8DC',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    paddingHorizontal: 16,
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
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F5FA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 64, 132, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    color: '#004B9B',
    fontWeight: 'bold',
  },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  inputFieldIcon: {
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#2C3E50',
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalBtnCancelar: {
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#E1F0FC',
  },
  modalBtnCancelarText: {
    color: '#546E7A',
    fontWeight: '700',
  },
  modalBtnSalvar: {
    backgroundColor: '#004B9B',
  },
  modalBtnSalvarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

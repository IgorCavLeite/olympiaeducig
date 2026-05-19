import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, Keyboard} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ENDPOINTS } from '../constants/Config';

export default function Perfil() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [usuarioId, setUsuarioId] = useState('');

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
    const nome = await AsyncStorage.getItem('username');
    const id = await AsyncStorage.getItem('usuario_id');
    console.log('usuario_id:', id);
    console.log('username:', nome);
    if (nome) setUsername(nome);
    if (id) setUsuarioId(id);
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
      await axios.put(`${ENDPOINTS.AUTH}/perfil/${usuarioId}`, { nome: novoNome.trim() });
      await AsyncStorage.setItem('username', novoNome.trim());
      setUsername(novoNome.trim());
      setModalNomeVisible(false);
      setNovoNome('');
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
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
      await axios.put(`${ENDPOINTS.AUTH}/senha/${usuarioId}`, { senhaAtual, novaSenha });
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
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERFIL</Text>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <Text style={styles.username}>{username}</Text>
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
  header: { backgroundColor: '#024084', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  voltarBtn: { marginBottom: 8 },
  voltarText: { color: '#e4b93f', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  avatarContainer: { alignItems: 'center', marginTop: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#024084', borderWidth: 4, borderColor: '#e4b93f', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  username: { marginTop: 16, fontSize: 22, fontWeight: 'bold', color: '#024084', textAlign: 'center', paddingHorizontal: 20 },
  optionsContainer: { marginTop: 40, paddingHorizontal: 20 },
  button: { backgroundColor: '#024084', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#c0392b' },
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

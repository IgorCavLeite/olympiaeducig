import axios from 'axios';
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ENDPOINTS } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
     Keyboard.dismiss();
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    setCarregando(true);

    try {
      await axios.post(ENDPOINTS.REGISTER, { nome, email, senha });

      await AsyncStorage.setItem('username', nome);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/LoginScreen') },
      ]);
    } catch (error: unknown) {
      let mensagemErro = 'Erro ao conectar ao servidor';

      if (axios.isAxiosError(error)) {
        mensagemErro = error.response?.data?.error || mensagemErro;
      }

      Alert.alert('Falha no Cadastro', mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          paddingTop: 20,
        }}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>
          Olymp<Text style={styles.ia}>IA</Text>
        </Text>

        <Text style={styles.titleCadastro}>Cadastro</Text>

        <TextInput
          placeholder="Nome Completo"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha (mínimo 8 caracteres)"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {senha.length > 0 && (
          <Text style={[
            styles.senhaInfo,
            senha.length >= 8 ? styles.senhaOk : styles.senhaErro
          ]}>
            {senha.length}/8 caracteres {senha.length >= 8 ? '✓' : ''}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, carregando && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.link}
          onPress={() => router.push('/LoginScreen')}
        >
          Já tem conta? Faça login
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#cceaff',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  titleCadastro: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  ia: {
    color: '#e4b93f',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
    senhaInfo: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  senhaOk: {
    color: '#27ae60',
  },
  senhaErro: {
    color: '#e74c3c',
  },
  button: {
    backgroundColor: '#024084',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#a0b0c8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    color: '#ab8580',
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 180,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

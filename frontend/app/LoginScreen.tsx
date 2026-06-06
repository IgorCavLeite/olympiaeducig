import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../constants/Config';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setCarregando(true);
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, { email, senha });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuario_id', String(user.id));
      await AsyncStorage.setItem('username', user.nome);

      console.log('Login realizado com sucesso! Token:', token);
      router.push('/Home');
    } catch (error: any) {
      const mensagemErro = error.response?.data?.error || 'Não foi possível conectar ao servidor';
      Alert.alert('Falha no Login', mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Olimp<Text style={styles.ia}>IA</Text>!</Text>
        <Text style={styles.titleLogin}>Login</Text>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />
        <TouchableOpacity style={[styles.button, carregando && styles.buttonDisabled]} onPress={handleLogin} disabled={carregando}>
        <Text style={styles.buttonText}> {carregando ? 'Entrando...' : 'Entrar'} </Text></TouchableOpacity>        
        <Text style={styles.link} onPress={() => router.push('/Cadastro')}>Não tem conta? Cadastre-se</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cceaff' },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  logo: { width: 150, height: 180, alignSelf: 'center', marginBottom: 10 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, marginBottom: 15, backgroundColor: '#fff' },
  link: { marginTop: 20, color: '#ab8580', textAlign: 'center' },
  title: { fontSize: 50, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  ia: { color: '#e4b93f' },
  titleLogin: { fontSize: 24, textAlign: 'center', marginBottom: 30, color: '#333' },
  button: { backgroundColor: '#024084', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { backgroundColor: '#a0b0c8' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

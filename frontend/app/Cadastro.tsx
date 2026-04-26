import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ENDPOINTS } from '../constants/Config';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [escola, setEscola] = useState('');
  const [matri, setMatri] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !escola || !matri) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    setCarregando(true);
    try {
      await axios.post(ENDPOINTS.REGISTER, { nome, email, senha, matricula: matri, escola });
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/LoginScreen') }
      ]);
    } catch (error: any) {
      const mensagemErro = error.response?.data?.error || 'Erro ao conectar ao servidor';
      Alert.alert('Falha no Cadastro', mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingTop: 20 }}>
        <Image source={require('../assets/images/logo.png')} style={[styles.logo, { height: 100 }]} />
        <Text style={styles.title}>Olimp<Text style={styles.ia}>IA</Text></Text>
        <Text style={styles.titleCadastro}>Cadastro</Text>
        <TextInput placeholder="Nome Completo" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput placeholder="Matrícula" style={styles.input} value={matri} onChangeText={setMatri} />
        <TextInput placeholder="Escola" style={styles.input} value={escola} onChangeText={setEscola} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />
        <Button title={carregando ? 'Cadastrando...' : 'Cadastrar'} onPress={handleCadastro} disabled={carregando} />
        <Text style={styles.link} onPress={() => router.push('/LoginScreen')}>Já tem conta? Faça login</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 12, paddingRight: 12, backgroundColor: '#cceaff' },
  title: { fontSize: 40, textAlign: 'center', marginBottom: 10 },
  titleCadastro: { fontSize: 30, textAlign: 'center', marginBottom: 20 },
  ia: { fontSize: 40, color: '#e4b93f' },
  input: { height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, marginBottom: 12 },
  link: { marginTop: 16, color: '#ab8580', textAlign: 'center' },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 10 },
});

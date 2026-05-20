import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>
        Olymp<Text style={styles.ia}>IA</Text>
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/LoginScreen')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/Cadastro')}>
        <Text style={styles.buttonText}>Cadastro</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cceaff', padding: 20 },
  logo: { width: 200, height: 230, marginBottom: 20 },
  title: { fontSize: 42, fontWeight: 'bold', marginBottom: 40 },
  ia: { color: '#e4b93f' },
  button: { backgroundColor: '#024084', width: '100%', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
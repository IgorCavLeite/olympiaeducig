import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo ao Olymp<Text style={styles.ia}>IA</Text>!</Text>

        <View style={styles.mainGrid}>
          <Pressable onPress={() => router.push('/Chat')}><Image style={styles.iconesHome} source={require('../assets/images/chat.png')}/></Pressable>
          <Pressable onPress={() => router.push('/Perfil')}><Image style={styles.iconesHome} source={require('../assets/images/perfil.png')}/></Pressable>
          <View><Image style={styles.iconesHome} source={require('../assets/images/conquistas.png')}/></View>
          <View><Image style={styles.iconesHome} source={require('../assets/images/configuracoes.png')}/></View>
          <View><Image style={styles.iconesHome} source={require('../assets/images/calendario.png')}/></View>
          <View ><Image style={styles.iconesHome} source={require('../assets/images/quiz.png')}/></View>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#cceaff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 230,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  iconesHome: {
    width: 140,
    margin: 8,
    height: 140,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ia: { color: '#e4b93f' },
});

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFonte } from '../utils/fontes';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const fonte = useFonte();

  useEffect(() => {
    const verificar = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setTimeout(() => router.replace('/'), 0);
      }
    };
    verificar();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={[styles.title, { fontSize: fonte.titulo }]}>
        {t('welcome')} Olymp<Text style={styles.ia}>IA</Text>!
      </Text>

      <View style={styles.mainGrid}>
        {/* CHAT */}
        <Pressable onPress={() => router.push('/Chat')}>
          <Image style={styles.iconesHome} source={require('../assets/images/chat.png')} />
        </Pressable>

        {/* PERFIL */}
        <Pressable onPress={() => router.push('/Perfil')}>
          <Image style={styles.iconesHome} source={require('../assets/images/perfil.png')} />
        </Pressable>

        {/* CONQUISTAS */}
        <Pressable onPress={() => router.push('/Conquistas')}>
          <Image style={styles.iconesHome} source={require('../assets/images/conquistas.png')} />
        </Pressable>

        {/* CONFIGURAÇÕES */}
        <Pressable onPress={() => router.push('/Configuracoes')}>
          <Image style={styles.iconesHome} source={require('../assets/images/configuracoes.png')} />
        </Pressable>

        {/* CALENDÁRIO */}
        <Pressable onPress={() => router.push('/Calendario')}>
          <Image style={styles.iconesHome} source={require('../assets/images/calendario.png')} />
        </Pressable>

        {/* QUIZ */}
        <Pressable onPress={() => router.push('/Quiz')}>
          <Image style={styles.iconesHome} source={require('../assets/images/quiz.png')} />
        </Pressable>
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
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
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
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    marginBottom: 15,
  },
  legenda: {
    textAlign: 'center',
    color: '#024084',
    fontWeight: 'bold',
  },
  iconesHome: {
    width: 140,
    height: 140,
    margin: 8,
    borderRadius: 10,
  },
  ia: {
    color: '#e4b93f',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonte } from '../utils/fontes';

export default function Sobre() {
  const router = useRouter();

  const fonte = useFonte();

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.voltar,
              { fontSize: fonte.titulo }
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.titulo,
            { fontSize: fonte.titulo }
          ]}
        >
          {t('about')}
        </Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.card}>
        <Text
          style={[
            styles.nomeProjeto,
            { fontSize: fonte.titulo }
          ]}
        >
          OlympIA
        </Text>

        <Text
          style={[
            styles.versao,
            { fontSize: fonte.texto }
          ]}
        >
          Versão 1.0
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          O OlympIA é uma plataforma
          educacional desenvolvida para
          auxiliar estudantes na preparação
          para olimpíadas científicas e
          acadêmicas.
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          A aplicação utiliza Inteligência
          Artificial para oferecer suporte
          personalizado aos usuários,
          ajudando no aprendizado de
          conteúdos de diversas áreas do
          conhecimento.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          Objetivo
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Democratizar o acesso à educação
          de qualidade, tornando o estudo
          para olimpíadas mais acessível,
          interativo e eficiente.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          Tecnologias Utilizadas
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          • React Native{"\n"}
          • Expo Router{"\n"}
          • Node.js{"\n"}
          • Express{"\n"}
          • MySQL{"\n"}
          • Google Gemini AI
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          Desenvolvido por
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Equipe OlympIA
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#D9EEFF',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  voltar: {
    color: '#004B9B',
    marginRight: 15,
    fontWeight: 'bold',
  },

  titulo: {
    color: '#004B9B',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  nomeProjeto: {
    color: '#004B9B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  versao: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },

  subtitulo: {
    color: '#004B9B',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  texto: {
    color: '#333',
    lineHeight: 28,
    textAlign: 'justify',
  },

});
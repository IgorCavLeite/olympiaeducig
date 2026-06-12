import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonte } from '../utils/fontes';

export default function FAQ() {

  const router = useRouter();
  const fonte = useFonte();

  return (
    <ScrollView style={styles.container}>

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
          FAQ
        </Text>

      </View>

      <View style={styles.card}>

        <Text
          style={[
            styles.pergunta,
            { fontSize: fonte.texto }
          ]}
        >
          O que é o OlympIA?
        </Text>

        <Text
          style={[
            styles.resposta,
            { fontSize: fonte.texto }
          ]}
        >
          O OlympIA é um aplicativo
          educacional que auxilia estudantes
          na preparação para olimpíadas
          científicas e acadêmicas.
        </Text>

        <Text
          style={[
            styles.pergunta,
            { fontSize: fonte.texto }
          ]}
        >
          O aplicativo é gratuito?
        </Text>

        <Text
          style={[
            styles.resposta,
            { fontSize: fonte.texto }
          ]}
        >
          Sim. O OlympIA pode ser utilizado
          gratuitamente pelos estudantes.
        </Text>

        <Text
          style={[
            styles.pergunta,
            { fontSize: fonte.texto }
          ]}
        >
          Como conversar com a IA?
        </Text>

        <Text
          style={[
            styles.resposta,
            { fontSize: fonte.texto }
          ]}
        >
          Basta acessar a área de Chat
          disponível na tela inicial.
        </Text>

        <Text
          style={[
            styles.pergunta,
            { fontSize: fonte.texto }
          ]}
        >
          Posso usar o aplicativo em qualquer
          dispositivo?
        </Text>

        <Text
          style={[
            styles.resposta,
            { fontSize: fonte.texto }
          ]}
        >
          Sim. O aplicativo foi desenvolvido
          para funcionar em celulares,
          tablets e navegadores compatíveis.
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
  },

  pergunta: {
    color: '#004B9B',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },

  resposta: {
    color: '#333',
    lineHeight: 26,
  },

});
import React from 'react';
<<<<<<< HEAD
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
=======

import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';

>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
import { useFonte } from '../utils/fontes';

export default function PoliticaPrivacidade() {

  const router = useRouter();
<<<<<<< HEAD
=======

  const { t } = useTranslation();

>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
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
          Política de Privacidade
        </Text>

      </View>

      <View style={styles.card}>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Esta Política de Privacidade descreve
          como o OlympIA coleta, utiliza e
          protege as informações fornecidas
          pelos usuários.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          1. Informações Coletadas
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Podemos coletar informações como
          nome, e-mail e dados necessários
          para o funcionamento da plataforma.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          2. Uso das Informações
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Os dados são utilizados para
          autenticação, personalização da
          experiência do usuário e melhoria
          dos serviços oferecidos.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          3. Compartilhamento de Dados
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          O OlympIA não comercializa os dados
          dos usuários. As informações podem
          ser compartilhadas apenas quando
          exigido por lei.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          4. Segurança
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Adotamos medidas de segurança para
          proteger os dados contra acessos
          não autorizados, alterações ou
          divulgação indevida.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          5. Direitos do Usuário
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          O usuário pode solicitar atualização,
          correção ou exclusão de seus dados,
          respeitando as exigências legais.
        </Text>

        <Text
          style={[
            styles.subtitulo,
            { fontSize: fonte.titulo }
          ]}
        >
          6. Alterações
        </Text>

        <Text
          style={[
            styles.texto,
            { fontSize: fonte.texto }
          ]}
        >
          Esta política poderá ser atualizada
          periodicamente para refletir mudanças
          nos serviços ou exigências legais.
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
    flex: 1,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  subtitulo: {
    color: '#004B9B',
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },

  texto: {
    color: '#333',
    lineHeight: 28,
    textAlign: 'justify',
  },

<<<<<<< HEAD
});
=======
});
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

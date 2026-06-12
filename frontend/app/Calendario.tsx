import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useFonte } from '../utils/fontes';

export default function Calendario() {

  const router = useRouter();

  const fonte = useFonte();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.replace('/Home')}
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
          Calendário Olímpico
        </Text>

      </View>

      {/* OBB */}

      <Text
        style={[
          styles.olimpiada,
          { fontSize: fonte.subtitulo }
        ]}
      >
        OBB 2026
      </Text>

      <View style={styles.card}>

        <Text style={styles.fase}>
          Inscrições e Fase 1
        </Text>

        <Text>15/01 a 25/02 - Inscrições</Text>
        <Text>02/03 - Download da prova</Text>
        <Text>03/03 - Realização da prova</Text>
        <Text>04/03 - Gabarito provisório</Text>
        <Text>05/03 - Gabarito definitivo</Text>
        <Text>10/03 - Inserção de acertos</Text>
        <Text>11/03 - Lista preliminar Fase 2</Text>
        <Text>12/03 - Lista definitiva Fase 2</Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.fase}>
          Fase 2
        </Text>

        <Text>17/03 - Download da prova</Text>
        <Text>18/03 - Realização da prova</Text>
        <Text>19/03 - Gabarito provisório</Text>
        <Text>20/03 - Gabarito definitivo</Text>
        <Text>26/03 - Inserção de acertos</Text>
        <Text>30/03 - Lista preliminar Fase 3</Text>
        <Text>31/03 - Lista definitiva Fase 3</Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.fase}>
          Fase 3
        </Text>

        <Text>02/04 - Confirmação de interesse</Text>
        <Text>09/04 - Teste técnico</Text>
        <Text>10/04 - Lista de aptos</Text>
        <Text>14/04 - Prova Fase 3</Text>
        <Text>15/04 - Gabarito provisório</Text>
        <Text>16/04 - Gabarito definitivo</Text>
        <Text>16/04 - Classificação preliminar</Text>
        <Text>17/04 - Lista definitiva</Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.fase}>
          Capacitação Internacional
        </Text>

        <Text>18/04 - Formulários</Text>
        <Text>23/04 - Envio de documentos</Text>
        <Text>06/05 - Acesso à plataforma</Text>
        <Text>07 e 08/05 - Etapa virtual</Text>
        <Text>11/05 - Cerimônia de abertura</Text>
        <Text>11 a 16/05 - Etapa presencial</Text>
        <Text>20/05 - Lista preliminar</Text>
        <Text>22/05 - Lista definitiva</Text>

      </View>

      {/* OBBS */}

      <Text
        style={[
          styles.olimpiada,
          { fontSize: fonte.subtitulo }
        ]}
      >
        OBBS 2026
      </Text>

      <View style={styles.card}>

        <Text style={styles.fase}>
          Cronograma
        </Text>

        <Text>20/05 a 31/07 - Inscrições</Text>
        <Text>08/09 a 14/09 - 1ª Fase</Text>
        <Text>13/10 a 19/10 - 2ª Fase</Text>
        <Text>27/11 - Encerramento</Text>

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

  scrollContent: {
    paddingBottom: 30,
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

  olimpiada: {
    color: '#004B9B',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  fase: {
    color: '#004B9B',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20, 
  },

});
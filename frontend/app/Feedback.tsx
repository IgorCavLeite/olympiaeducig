import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonte } from '../utils/fontes';
import axios from 'axios';
import { ENDPOINTS } from '../constants/Config';

export default function EnviarFeedback() {

  const router = useRouter();

  const fonte = useFonte();

  const [mensagem, setMensagem] = useState('');

  async function enviarFeedback() {

    if (!mensagem.trim()) {

      Alert.alert(
        'Atenção',
        'Digite seu feedback.'
      );

      return;
    }

    try {

      await axios.post(
        ENDPOINTS.FEEDBACK,
        {
          mensagem
        }
      );

      Alert.alert(
        'Sucesso',
        'Feedback enviado com sucesso!'
      );

      setMensagem('');

    } catch {

      Alert.alert(
        'Erro',
        'Não foi possível enviar o feedback.'
      );

    }
  }

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
          Enviar Feedback
        </Text>

      </View>

      <Text
        style={[
          styles.label,
          { fontSize: fonte.texto }
        ]}
      >
        Conte para nós sua opinião:
      </Text>

      <TextInput
        style={[
          styles.input,
          { fontSize: fonte.texto }
        ]}
        multiline
        numberOfLines={8}
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Digite seu feedback..."
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={enviarFeedback}
      >
        <Text style={styles.botaoTexto}>
          Enviar
        </Text>
      </TouchableOpacity>

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

  label: {
    color: '#004B9B',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    minHeight: 180,
  },

  botao: {
    backgroundColor: '#004B9B',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

});
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ConfigContext } from '../contexts/configContext';
import { useFonte } from '../utils/fontes';

export default function Configuracoes() {
  const router = useRouter();

  const fonte = useFonte();

  const {
    fonteGrande,
    alterarFonte,
  } = useContext(ConfigContext);

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
<TouchableOpacity
  onPress={() => router.replace('/Home')}
>
  <Text style={styles.voltar}>←</Text>
</TouchableOpacity>

        <Text
          style={[
            styles.titulo,
            {
              fontSize: fonte.titulo,
            },
          ]}
        >
          {('configurações').toUpperCase()}
        </Text>
      </View>

      {/* Geral */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {('geral').toUpperCase()}
        </Text>

        <View style={styles.item}>
          <Text
            style={[
              styles.label,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {('Fonte Grande')}
          </Text>

          <Switch
            value={fonteGrande}
            onValueChange={alterarFonte}
          />
        </View>

        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            router.push('/PoliticaPrivacidade')
          }
        >
          <Text
            style={[
              styles.linkText,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {('Política de Privacidade')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ajuda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {('Suporte').toUpperCase()}
        </Text>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/FAQ')}
        >
          <Text
            style={[
              styles.linkText,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {('FAQ')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.link}
  onPress={() => router.push('/Feedback')}
>
  <Text
    style={[
      styles.linkText,
      {
        fontSize: fonte.texto,
      },
    ]}
  >
    {('Feedback')}
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/Sobre')}
        >
          <Text
            style={[
              styles.linkText,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {('Sobre')}
          </Text>
        </TouchableOpacity>
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
    fontSize: 28,
    color: '#004B9B',
    marginRight: 15,
  },

  titulo: {
    fontWeight: 'bold',
    color: '#004B9B',
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    backgroundColor: '#004B9B',
    color: '#FFF',
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#004B9B',
  },

  link: {
    marginVertical: 6,
  },

  linkText: {
    color: '#004B9B',
  },

  radioContainer: {
    marginVertical: 5,
  },

  radio: {
    color: '#004B9B',
  },
});
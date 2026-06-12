import React, { useContext } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ConfigContext } from '../contexts/configContext';
=======
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';

import { ConfigContext } from '../contexts/ConfigContext';

import { useTranslation } from 'react-i18next';
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
import { useFonte } from '../utils/fontes';

export default function Configuracoes() {
  const router = useRouter();

<<<<<<< HEAD
=======
  const { t } = useTranslation();

>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
  const fonte = useFonte();

  const {
    fonteGrande,
<<<<<<< HEAD
    alterarFonte,
=======
    idioma,
    alterarFonte,
    alterarIdioma,
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
  } = useContext(ConfigContext);

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
<<<<<<< HEAD
<TouchableOpacity
  onPress={() => router.replace('/Home')}
>
  <Text style={styles.voltar}>←</Text>
</TouchableOpacity>
=======
        <TouchableOpacity
          onPress={() => router.replace('/Home')}
        >
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

        <Text
          style={[
            styles.titulo,
            {
              fontSize: fonte.titulo,
            },
          ]}
        >
<<<<<<< HEAD
          {('configurações').toUpperCase()}
=======
          {t('settings').toUpperCase()}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
        </Text>
      </View>

      {/* Geral */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
<<<<<<< HEAD
          {('geral').toUpperCase()}
=======
          {t('general').toUpperCase()}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
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
<<<<<<< HEAD
            {('Fonte Grande')}
=======
            {t('largeFont')}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
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
<<<<<<< HEAD
            {('Política de Privacidade')}
=======
            {t('privacyPolicy')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Idioma */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('language').toUpperCase()}
        </Text>

        <TouchableOpacity
          onPress={() => alterarIdioma('pt')}
          style={styles.radioContainer}
        >
          <Text
            style={[
              styles.radio,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {idioma === 'pt' ? '●' : '○'} Português
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alterarIdioma('en')}
          style={styles.radioContainer}
        >
          <Text
            style={[
              styles.radio,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {idioma === 'en' ? '●' : '○'} English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alterarIdioma('es')}
          style={styles.radioContainer}
        >
          <Text
            style={[
              styles.radio,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {idioma === 'es' ? '●' : '○'} Español
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ajuda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
<<<<<<< HEAD
          {('Suporte').toUpperCase()}
=======
          {t('helpSupport').toUpperCase()}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
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
<<<<<<< HEAD
            {('FAQ')}
=======
            FAQ
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
<<<<<<< HEAD
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
=======
          style={styles.link}
          onPress={() => router.push('/EnviarFeedback')}
        >
          <Text
            style={[
              styles.linkText,
              {
                fontSize: fonte.texto,
              },
            ]}
          >
            {t('sendFeedback')}
          </Text>
        </TouchableOpacity>
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

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
<<<<<<< HEAD
            {('Sobre')}
=======
            {t('about')}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

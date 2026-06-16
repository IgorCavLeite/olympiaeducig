import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ConfigContext } from '../contexts/configContext';
import { useTranslation } from 'react-i18next';
import { useFonte } from '../utils/fontes';
import { Ionicons } from '@expo/vector-icons';

export default function Configuracoes() {
  const router = useRouter();
  const { t } = useTranslation();
  const fonte = useFonte();

  const {
    fonteGrande,
    idioma,
    alterarFonte,
    alterarIdioma,
  } = useContext(ConfigContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/Home')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#004B9B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.titulo, { fontSize: fonte.titulo }]}>
            {t('settings') || 'Configurações'}
          </Text>
          <Text style={styles.subtituloHeader}>
            Gerencie suas preferências de uso
          </Text>
        </View>
      </View>

      {/* SEÇÃO: GERAL */}
      <Text style={styles.sectionLabel}>{t('general') || 'Geral'}</Text>
      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#E1F0FC' }]}>
              <Ionicons name="text-outline" size={18} color="#004B9B" />
            </View>
            <Text style={[styles.label, { fontSize: fonte.texto }]}>
              {t('largeFont')}
            </Text>
          </View>
          <Switch 
            value={fonteGrande} 
            onValueChange={alterarFonte} 
            trackColor={{ false: '#CFD8DC', true: '#B3D7F7' }}
            thumbColor={fonteGrande ? '#004B9B' : '#ECEFF1'}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push('/PoliticaPrivacidade')}
          activeOpacity={0.6}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#2E7D32" />
            </View>
            <Text style={[styles.linkLabel, { fontSize: fonte.texto }]}>
              {t('privacyPolicy')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* SEÇÃO: IDIOMA */}
      <Text style={styles.sectionLabel}>{t('language') || 'Idioma'}</Text>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => alterarIdioma('pt')}
          style={styles.radioRow}
          activeOpacity={0.7}
        >
          <View style={styles.radioLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#EDE7F6' }]}>
              <Ionicons name="globe-outline" size={18} color="#5E35B1" />
            </View>
            <Text style={[styles.radioLabel, { fontSize: fonte.texto }]}>
              Português
            </Text>
          </View>
          <View style={[styles.radioCircle, idioma === 'pt' && styles.radioCircleActive]}>
            {idioma === 'pt' && <View style={styles.radioInnerCircle} />}
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => alterarIdioma('en')}
          style={styles.radioRow}
          activeOpacity={0.7}
        >
          <View style={styles.radioLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#EDE7F6' }]}>
              <Ionicons name="globe-outline" size={18} color="#5E35B1" />
            </View>
            <Text style={[styles.radioLabel, { fontSize: fonte.texto }]}>
              English
            </Text>
          </View>
          <View style={[styles.radioCircle, idioma === 'en' && styles.radioCircleActive]}>
            {idioma === 'en' && <View style={styles.radioInnerCircle} />}
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => alterarIdioma('es')}
          style={styles.radioRow}
          activeOpacity={0.7}
        >
          <View style={styles.radioLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#EDE7F6' }]}>
              <Ionicons name="globe-outline" size={18} color="#5E35B1" />
            </View>
            <Text style={[styles.radioLabel, { fontSize: fonte.texto }]}>
              Español
            </Text>
          </View>
          <View style={[styles.radioCircle, idioma === 'es' && styles.radioCircleActive]}>
            {idioma === 'es' && <View style={styles.radioInnerCircle} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* SEÇÃO: AJUDA */}
      <Text style={styles.sectionLabel}>{t('helpSupport') || 'Ajuda e Suporte'}</Text>
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.linkRow} 
          onPress={() => router.push('/FAQ')}
          activeOpacity={0.6}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="help-circle-outline" size={18} color="#E65100" />
            </View>
            <Text style={[styles.linkLabel, { fontSize: fonte.texto }]}>
              FAQ
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.linkRow} 
          onPress={() => router.push('/EnviarFeedback')}
          activeOpacity={0.6}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="chatbox-ellipses-outline" size={18} color="#8E24AA" />
            </View>
            <Text style={[styles.linkLabel, { fontSize: fonte.texto }]}>
              {t('sendFeedback') || 'Enviar Feedback'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.linkRow} 
          onPress={() => router.push('/Sobre')}
          activeOpacity={0.6}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="information-circle-outline" size={18} color="#00838F" />
            </View>
            <Text style={[styles.linkLabel, { fontSize: fonte.texto }]}>
              {t('about') || 'Sobre'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F9FD',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTextContainer: {
    flex: 1,
  },
  titulo: {
    color: '#004B9B',
    fontWeight: 'bold',
  },
  subtituloHeader: {
    color: '#6085a6',
    fontSize: 14,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6085a6',
    marginBottom: 10,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    paddingHorizontal: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F5FA',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  linkLabel: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  radioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#90A4AE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#004B9B',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#004B9B',
  },
});

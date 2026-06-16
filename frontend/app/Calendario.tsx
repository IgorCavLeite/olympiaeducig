import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFonte } from '../utils/fontes';
import { Ionicons } from '@expo/vector-icons';

// Habilita animações de layout simples no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface EventItem {
  date: string;
  name: string;
  status: 'done' | 'active' | 'upcoming';
  description?: string;
}

interface Phase {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: 'done' | 'active' | 'upcoming';
  events: EventItem[];
}

const OBB_DATA: Phase[] = [
  {
    title: 'Inscrições e Fase 1',
    icon: 'school-outline',
    status: 'done',
    events: [
      { date: '15/01 a 25/02', name: 'Inscrições', status: 'done', description: 'Período oficial de inscrições na olimpíada' },
      { date: '02/03', name: 'Download da prova', status: 'done', description: 'Disponibilização da prova no sistema do professor' },
      { date: '03/03', name: 'Realização da prova', status: 'done', description: 'Aplicação presencial da prova de Fase 1' },
      { date: '04/03', name: 'Gabarito provisório', status: 'done', description: 'Divulgação do gabarito preliminar da primeira fase' },
      { date: '05/03', name: 'Gabarito definitivo', status: 'done', description: 'Gabarito final após recursos da Fase 1' },
      { date: '10/03', name: 'Inserção de acertos', status: 'done', description: 'Envio das notas dos alunos pelas escolas' },
      { date: '11/03', name: 'Lista preliminar Fase 2', status: 'done', description: 'Primeira listagem de aprovados para a Fase 2' },
      { date: '12/03', name: 'Lista definitiva Fase 2', status: 'done', description: 'Homologação oficial dos classificados' },
    ]
  },
  {
    title: 'Fase 2',
    icon: 'document-text-outline',
    status: 'done',
    events: [
      { date: '17/03', name: 'Download da prova', status: 'done', description: 'Disponibilização do caderno de provas de Fase 2' },
      { date: '18/03', name: 'Realização da prova', status: 'done', description: 'Aplicação oficial da prova de Fase 2' },
      { date: '19/03', name: 'Gabarito provisório', status: 'done', description: 'Divulgação do gabarito preliminar da segunda fase' },
      { date: '20/03', name: 'Gabarito definitivo', status: 'done', description: 'Gabarito final após recursos da Fase 2' },
      { date: '26/03', name: 'Inserção de acertos', status: 'done', description: 'Lançamento das notas da Fase 2 no sistema' },
      { date: '30/03', name: 'Lista preliminar Fase 3', status: 'done', description: 'Prévia dos classificados para a Fase 3' },
      { date: '31/03', name: 'Lista definitiva Fase 3', status: 'done', description: 'Classificados finais autorizados para a Fase 3' },
    ]
  },
  {
    title: 'Fase 3',
    icon: 'trophy-outline',
    status: 'done',
    events: [
      { date: '02/04', name: 'Confirmação de interesse', status: 'done', description: 'Prazo limite para confirmar presença na etapa final' },
      { date: '09/04', name: 'Teste técnico', status: 'done', description: 'Simulação do sistema de prova digital' },
      { date: '10/04', name: 'Lista de aptos', status: 'done', description: 'Lista de alunos confirmados no teste técnico' },
      { date: '14/04', name: 'Prova Fase 3', status: 'done', description: 'Realização da prova prática e teórica da Fase 3' },
      { date: '15/04', name: 'Gabarito provisório', status: 'done', description: 'Gabarito preliminar da prova de Fase 3' },
      { date: '16/04', name: 'Gabarito definitivo', status: 'done', description: 'Gabarito definitivo homologado' },
      { date: '16/04', name: 'Classificação preliminar', status: 'done', description: 'Prévia do ranking de medalhas e capacitação' },
      { date: '17/04', name: 'Lista definitiva', status: 'done', description: 'Resultado oficial final da OBB 2026' },
    ]
  },
  {
    title: 'Capacitação Internacional',
    icon: 'globe-outline',
    status: 'done',
    events: [
      { date: '18/04', name: 'Formulários', status: 'done', description: 'Preenchimento de dados cadastrais e termo de compromisso' },
      { date: '23/04', name: 'Envio de documentos', status: 'done', description: 'Upload de passaporte e documentação de viagem' },
      { date: '06/05', name: 'Acesso à plataforma', status: 'done', description: 'Boas-vindas e acesso ao ambiente virtual de estudos' },
      { date: '07 e 08/05', name: 'Etapa virtual', status: 'done', description: 'Aulas preparatórias e nivelamento online' },
      { date: '11/05', name: 'Cerimônia de abertura', status: 'done', description: 'Início oficial da capacitação presencial' },
      { date: '11 a 16/05', name: 'Etapa presencial', status: 'done', description: 'Aulas práticas intensivas em laboratório universitário' },
      { date: '20/05', name: 'Lista preliminar', status: 'done', description: 'Indicação dos alunos selecionados para a IBO e OIAB' },
      { date: '22/05', name: 'Lista definitiva', status: 'done', description: 'Definição oficial dos representantes do Brasil' },
    ]
  }
];

const OBBS_DATA: Phase[] = [
  {
    title: 'Cronograma Geral OBBS',
    icon: 'calendar-outline',
    status: 'active',
    events: [
      { date: '20/05 a 31/07', name: 'Inscrições', status: 'active', description: 'Inscrições abertas para estudantes de escolas privadas' },
      { date: '08/09 a 14/09', name: '1ª Fase', status: 'upcoming', description: 'Período para aplicação e envio da prova de Fase 1' },
      { date: '13/10 a 19/10', name: '2ª Fase', status: 'upcoming', description: 'Realização das avaliações de Fase 2' },
      { date: '27/11', name: 'Encerramento', status: 'upcoming', description: 'Divulgação dos resultados finais e premiação da OBBS' },
    ]
  }
];

export default function Calendario() {
  const router = useRouter();
  const { t } = useTranslation();
  const fonte = useFonte();

  const [activeTab, setActiveTab] = React.useState<'obb' | 'obbs'>('obb');
  const [expandedPhases, setExpandedPhases] = React.useState<Record<string, boolean>>({
    'Inscrições e Fase 1': true,
    'Cronograma Geral OBBS': true,
  });

  const togglePhase = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPhases(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleTabChange = (tab: 'obb' | 'obbs') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const currentData = activeTab === 'obb' ? OBB_DATA : OBBS_DATA;

  const getStatusStyle = (status: 'done' | 'active' | 'upcoming') => {
    switch (status) {
      case 'done':
        return {
          dotBg: '#E8F5E9',
          dotBorder: '#4CAF50',
          dotIcon: 'checkmark',
          iconColor: '#2E7D32',
          badgeBg: '#E8F5E9',
          badgeText: '#2E7D32',
          badgeLabel: 'Concluído',
          lineColor: '#A5D6A7',
        };
      case 'active':
        return {
          dotBg: '#FFF3E0',
          dotBorder: '#FF9800',
          dotIcon: 'time-outline',
          iconColor: '#E65100',
          badgeBg: '#FFF3E0',
          badgeText: '#E65100',
          badgeLabel: 'Em Andamento',
          lineColor: '#FFCC80',
        };
      case 'upcoming':
        return {
          dotBg: '#F5F5F5',
          dotBorder: '#BDBDBD',
          dotIcon: 'ellipse-outline',
          iconColor: '#757575',
          badgeBg: '#F5F5F5',
          badgeText: '#616161',
          badgeLabel: 'Em Breve',
          lineColor: '#E0E0E0',
        };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* HEADER */}
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
            {t('calendar') || 'Calendário'}
          </Text>
          <Text style={styles.subtituloHeader}>
            Cronograma e Fases 2026
          </Text>
        </View>
      </View>

      {/* TABS SELECTOR */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'obb' && styles.tabButtonActive]}
          onPress={() => handleTabChange('obb')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="ribbon-outline"
            size={18}
            color={activeTab === 'obb' ? '#FFFFFF' : '#004B9B'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'obb' && styles.tabTextActive]}>
            OBB 2026
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'obbs' && styles.tabButtonActive]}
          onPress={() => handleTabChange('obbs')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="medal-outline"
            size={18}
            color={activeTab === 'obbs' ? '#FFFFFF' : '#004B9B'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'obbs' && styles.tabTextActive]}>
            OBBS 2026
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY BANNER */}
      {activeTab === 'obb' ? (
        <View style={styles.bannerInfo}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="trophy" size={28} color="#FFB300" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Edição Concluída 🏆</Text>
            <Text style={styles.bannerDescription}>
              As fases teóricas e a capacitação presencial nacional da OBB 2026 foram concluídas.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.bannerInfo, styles.bannerInfoActive]}>
          <View style={[styles.bannerIconContainer, styles.bannerIconContainerActive]}>
            <Ionicons name="notifications" size={28} color="#FF9800" style={styles.pulseIcon} />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Inscrições Abertas! 🎉</Text>
            <Text style={styles.bannerDescription}>
              Garanta a vaga de sua escola parceira na OBBS 2026 até o dia 31 de julho.
            </Text>
          </View>
        </View>
      )}

      {/* TIMELINE LIST */}
      {currentData.map((phase, phaseIdx) => {
        const isExpanded = !!expandedPhases[phase.title];
        return (
          <View key={phase.title} style={styles.phaseCard}>
            {/* Phase Header */}
            <Pressable
              style={styles.phaseHeader}
              onPress={() => togglePhase(phase.title)}
            >
              <View style={styles.phaseHeaderLeft}>
                <View style={styles.phaseHeaderIconBg}>
                  <Ionicons name={phase.icon} size={22} color="#004B9B" />
                </View>
                <Text style={[styles.phaseTitle, { fontSize: fonte.subtitulo }]}>
                  {phase.title}
                </Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#004B9B"
              />
            </Pressable>

            {/* Phase Content */}
            {isExpanded && (
              <View style={styles.phaseContent}>
                {phase.events.map((event, eventIdx) => {
                  const styleMeta = getStatusStyle(event.status);
                  const isLast = eventIdx === phase.events.length - 1;

                  return (
                    <View key={event.name} style={styles.timelineRow}>
                      {/* Left: Graphic Timeline Connectors */}
                      <View style={styles.timelineGraphicContainer}>
                        {!isLast && (
                          <View
                            style={[
                              styles.timelineLine,
                              { backgroundColor: styleMeta.lineColor },
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.timelineDot,
                            {
                              backgroundColor: styleMeta.dotBg,
                              borderColor: styleMeta.dotBorder,
                            },
                          ]}
                        >
                          <Ionicons
                            name={styleMeta.dotIcon as any}
                            size={10}
                            color={styleMeta.iconColor}
                          />
                        </View>
                      </View>

                      {/* Right: Details Card */}
                      <View style={styles.timelineCard}>
                        <View style={styles.timelineCardHeader}>
                          <Text style={[styles.eventName, { fontSize: fonte.texto }]}>
                            {event.name}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: styleMeta.badgeBg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                { color: styleMeta.badgeText, fontSize: fonte.pequeno },
                              ]}
                            >
                              {styleMeta.badgeLabel}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.eventDateContainer}>
                          <Ionicons name="calendar-outline" size={14} color="#666" style={{ marginRight: 6 }} />
                          <Text style={styles.eventDate}>{event.date}</Text>
                        </View>

                        {event.description && (
                          <Text style={styles.eventDescription}>
                            {event.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E1F0FC',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#004B9B',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    color: '#004B9B',
    fontWeight: '700',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  bannerInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#FFF59D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerInfoActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  bannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFDE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#FFF9C4',
  },
  bannerIconContainerActive: {
    backgroundColor: '#FFE0B2',
    borderColor: '#FFCC80',
  },
  pulseIcon: {
    transform: [{ scale: 1.05 }],
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E65100',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#6D4C41',
    lineHeight: 18,
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  phaseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phaseHeaderIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E1F0FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  phaseTitle: {
    color: '#004B9B',
    fontWeight: 'bold',
    flex: 1,
  },
  phaseContent: {
    padding: 18,
    paddingTop: 0,
    backgroundColor: '#FCFDFF',
    borderTopWidth: 1,
    borderColor: '#F1F7FC',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineGraphicContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 12,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 18,
    bottom: -24, // Estende a linha até o próximo nó da linha temporal
    width: 2,
    backgroundColor: '#E0E0E0',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    zIndex: 2,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F5FA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  timelineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  eventName: {
    color: '#004B9B',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontWeight: '700',
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDate: {
    color: '#455A64',
    fontSize: 14,
    fontWeight: '600',
  },
  eventDescription: {
    color: '#546E7A',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonte } from '../utils/fontes';
import { Ionicons } from '@expo/vector-icons';
import { ENDPOINTS } from '../constants/Config';

// Habilita animações de layout simples no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const Chat = () => {
  const router = useRouter();
  const fonte = useFonte();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Inicializa o chat com a mensagem de boas-vindas traduzida
  useEffect(() => {
    const verificar = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/');
      }
    };
    verificar();

    setMessages([
      {
        id: 'welcome',
        text:'Olá! Sou o OlympIA, seu tutor para olimpíadas acadêmicas.\nPosso te ajudar com suas dúvidas em Biologia!\n\nQual tema vamos estudar hoje?',
        sender: 'ai',
      },
    ]);
  }, []);

  const handleSend = async (overrideText?: string) => {
    const texto = (overrideText || input).trim();
    if (!texto || carregando) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: texto,
      sender: 'user',
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setCarregando(true);

    try {
      // Cria histórico filtrando as boas-vindas
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ sender: m.sender, text: m.text }));

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: texto, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Date.now().toString() + '-error',
        text:'Não foi possível conectar ao servidor. Verifique sua conexão.',
        sender: 'ai',
      };
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setCarregando(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Limpar Conversa',
      'Deseja apagar todo o histórico desta conversa?',
      [
        { text:'Cancelar', style: 'cancel' },
        { 
          text:'Limpar', 
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setMessages([
              {
                id: 'welcome',
                text:'Olá! Sou o OlympIA, seu tutor para olimpíadas acadêmicas.\nPosso te ajudar com suas dúvidas em Biologia!\n\nQual tema vamos estudar hoje?',
                sender: 'ai',
              },
            ]);
          }
        }
      ]
    );
  };

  const suggestions = [
    { label: '🧬 Leis de Mendel', text: 'Pode me explicar as Leis de Mendel de forma resumida e didática?' },
    { label: '🦠 Organelas Celulares', text: 'Quais as principais organelas celulares e suas respectivas funções?' },
    { label: '🌱 Fotossíntese', text: 'Como funciona o processo de fotossíntese nas plantas?' },
    { label: '🏆 Dicas da OBB', text: 'Quais as principais dicas e conteúdos mais cobrados na prova da OBB?' }
  ];

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={styles.bubbleAvatar}>
            <Ionicons name="sparkles" size={14} color="#004B9B" />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, { fontSize: fonte.texto }, isUser ? styles.userText : styles.aiText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/Home')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="sparkles-outline" size={20} color="#FFFFFF" />
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>OlympIA</Text>
            <View style={styles.headerStatusContainer}>
              <Text style={styles.headerSubtitle}>
                {'Tutor de Olimpíadas'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleClearChat}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* TYPING STATUS */}
      {carregando && (
        <View style={styles.typingRow}>
          <View style={styles.bubbleAvatar}>
            <Ionicons name="sparkles" size={14} color="#004B9B" />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#004B9B" style={{ marginRight: 8 }} />
            <Text style={[styles.typingText, { fontSize: fonte.pequeno }]}>
              {'OlympIA está pensando...'}
            </Text>
          </View>
        </View>
      )}

      {/* SUGGESTION CHIPS (only visible on initial screen) */}
      {messages.length === 1 && !carregando && (
        <View style={styles.suggestionsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.label}
                style={styles.suggestionChip}
                onPress={() => handleSend(suggestion.text)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionText}>{suggestion.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* INPUT PANEL */}
      <View style={styles.inputAreaWrapper}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { fontSize: fonte.texto }]}
              placeholder={'Digite sua pergunta...'}
              placeholderTextColor="#90A4AE"
              value={input}
              onChangeText={setInput}
              multiline
              editable={!carregando}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || carregando) && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || carregando}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    backgroundColor: '#004B9B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#004B9B',
  },
  headerTitleContainer: {},
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E1F0FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#B3D7F7',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#004B9B',
    borderBottomRightRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1F0FC',
    borderBottomLeftRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#024084',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  messageText: {
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#2C3E50',
  },
  typingRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1F0FC',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  typingText: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  suggestionsWrapper: {
    borderTopWidth: 1,
    borderColor: '#EAECEF',
    backgroundColor: '#F5F9FC',
    paddingVertical: 12,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0E3F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  suggestionText: {
    color: '#004B9B',
    fontWeight: '600',
    fontSize: 14,
  },
  inputAreaWrapper: {
    borderTopWidth: 1,
    borderColor: '#E6EFF5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E1F0FC',
    maxHeight: 120,
  },
  input: {
    padding: 0,
    margin: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: '#004B9B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#004B9B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sendButtonDisabled: {
    backgroundColor: '#B3D7F7',
  },
});

export default Chat;

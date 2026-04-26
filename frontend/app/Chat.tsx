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
} from 'react-native';
import { ENDPOINTS } from '../constants/Config';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Olá! Sou o OlympIA, seu tutor para olimpíadas acadêmicas.\nPosso te ajudar com suas dúvidas em Biologia!\n\nQual tema vamos estudar hoje?',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const texto = input.trim();
    if (!texto || carregando) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: texto,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setCarregando(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ sender: m.sender, text: m.text }));

      const response = await fetch(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Date.now().toString() + '-error',
        text: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OlympIA</Text>
        <Text style={styles.headerSubtitle}>Tutor de Olimpíadas</Text>
      </View>

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

      {carregando && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#024084" />
          <Text style={styles.typingText}>OlympIA está pensando...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua pergunta..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
          editable={!carregando}
        />
        <TouchableOpacity
          style={[styles.sendButton, carregando && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={carregando}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { paddingTop: 50, paddingBottom: 16, backgroundColor: '#024084', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#e4b93f', fontSize: 13, marginTop: 2 },
  messagesContainer: { padding: 12, paddingBottom: 8, flexGrow: 1 },
  message: { maxWidth: '82%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userMessage: { backgroundColor: '#024084', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiMessage: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#1a1a2e' },
  typingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 8, backgroundColor: '#f0f4f8' },
  typingText: { color: '#666', fontSize: 13, fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, paddingBottom: 28, borderTopWidth: 1, borderColor: '#dde3ec', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#f0f4f8', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#dde3ec', fontSize: 15, maxHeight: 100, color: '#1a1a2e' },
  sendButton: { backgroundColor: '#024084', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendButtonDisabled: { backgroundColor: '#a0b0c8' },
  sendButtonText: { color: '#fff', fontSize: 18 },
});

export default Chat;

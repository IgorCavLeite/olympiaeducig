import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

import { getQuizQuestions } from '../services/quizService';

export default function Quiz() {
  const router = useRouter();

  const [perguntas] = useState(() => getQuizQuestions());
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  if (perguntas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>Nenhuma pergunta encontrada.</Text>
      </View>
    );
  }

  const perguntaAtual = perguntas[indiceAtual];

  function responder(opcao: string) {
    if (opcao === perguntaAtual.resposta) {
      setPontuacao((prev) => prev + 1);
    }

    const proximaPergunta = indiceAtual + 1;

    if (proximaPergunta < perguntas.length) {
      setIndiceAtual(proximaPergunta);
    } else {
      setFinalizado(true);
    }
  }

  if (finalizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloFinal}>Quiz Finalizado 🎉</Text>

        <Text style={styles.resultado}>
          Você acertou {pontuacao} de {perguntas.length}
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setIndiceAtual(0);
            setPontuacao(0);
            setFinalizado(false);
          }}
        >
          <Text style={styles.textoBotao}>Jogar Novamente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.materia}>{perguntaAtual.materia}</Text>

      <Text style={styles.dificuldade}>
        Dificuldade: {perguntaAtual.dificuldade}
      </Text>

      <Text style={styles.contador}>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </Text>

      <Text style={styles.pergunta}>{perguntaAtual.pergunta}</Text>

      {perguntaAtual.opcoes.map((opcao: string) => (
        <TouchableOpacity
          key={opcao}
          style={styles.botao}
          onPress={() => responder(opcao)}
        >
          <Text style={styles.textoBotao}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 24,
    justifyContent: 'center',
  },

  voltarBtn: {
    position: 'absolute',
    top: 52,
    left: 24,
  },

  voltarText: {
    color: '#e4b93f',
    fontSize: 14,
    fontWeight: 'bold',
  },

  materia: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  dificuldade: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 10,
  },

  contador: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 20,
  },

  pergunta: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  botao: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  botaoVoltar: {
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },

  textoBotaoVoltar: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
  },

  tituloFinal: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  resultado: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },

  erro: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
});

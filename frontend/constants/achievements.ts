export interface Achievement {
  id: number;
  nome: string;
  deus: string;
  descricao: string;
  objetivo: number;
  progresso: number;
  tipo: "quiz" | "sequencia";
  desbloqueado: boolean;
  emoji: string;
}

export const achievements: Achievement[] = [
  {
    id: 1,
    nome: "Mensageiro da Sabedoria",
    deus: "Hermes",
    descricao: "Responda 5 perguntas corretamente",
    objetivo: 5,
    progresso: 0,
    tipo: "quiz",
    desbloqueado: false,
    emoji: "⚡",
  },

  {
    id: 2,
    nome: "Guardião do Conhecimento",
    deus: "Apolo",
    descricao: "Responda 10 perguntas corretamente",
    objetivo: 10,
    progresso: 0,
    tipo: "quiz",
    desbloqueado: false,
    emoji: "🏹",
  },

  {
    id: 3,
    nome: "Mestre da Estratégia",
    deus: "Atena",
    descricao: "Responda 15 perguntas corretamente",
    objetivo: 15,
    progresso: 0,
    tipo: "quiz",
    desbloqueado: false,
    emoji: "🦉",
  },

  {
    id: 4,
    nome: "Cultivador do Saber",
    deus: "Deméter",
    descricao: "Estude durante 5 dias consecutivos",
    objetivo: 5,
    progresso: 0,
    tipo: "sequencia",
    desbloqueado: false,
    emoji: "🌾",
  },

  {
    id: 5,
    nome: "Disciplina Lunar",
    deus: "Ártemis",
    descricao: "Estude durante 7 dias consecutivos",
    objetivo: 7,
    progresso: 0,
    tipo: "sequencia",
    desbloqueado: false,
    emoji: "🌙",
  },

  {
    id: 6,
    nome: "Forjador do Conhecimento",
    deus: "Hefesto",
    descricao: "Estude durante 10 dias consecutivos",
    objetivo: 10,
    progresso: 0,
    tipo: "sequencia",
    desbloqueado: false,
    emoji: "🔥",
  },

  {
    id: 7,
    nome: "Escolhido do Olimpo",
    deus: "Zeus",
    descricao: "Estude durante 14 dias consecutivos",
    objetivo: 14,
    progresso: 0,
    tipo: "sequencia",
    desbloqueado: false,
    emoji: "👑",
  },
];
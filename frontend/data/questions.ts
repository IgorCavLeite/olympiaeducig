export interface Question {
  id: number;
  pergunta: string;
  opcoes: string[];
  resposta: string;
  materia: string;
  dificuldade: "facil" | "medio" | "dificil";
}

export const questions: Question[] = [
  {
    id: 1,
    pergunta: "Qual organela celular é responsável pela produção de ATP durante a respiração celular?",
    opcoes: ["Lisossomo", "Mitocôndria", "Complexo de Golgi", "Ribossomo"],
    resposta: "Mitocôndria",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 2,
    pergunta: "Qual é a principal função dos ribossomos?",
    opcoes: [
      "Produzir energia",
      "Armazenar água",
      "Realizar síntese de proteínas",
      "Controlar a divisão celular"
    ],
    resposta: "Realizar síntese de proteínas",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 3,
    pergunta: "O DNA é composto por quais bases nitrogenadas?",
    opcoes: [
      "Adenina, Timina, Citosina e Guanina",
      "Adenina, Uracila, Citosina e Guanina",
      "Timina, Uracila, Citosina e Guanina",
      "Adenina, Timina, Uracila e Guanina"
    ],
    resposta: "Adenina, Timina, Citosina e Guanina",
    materia: "Biologia",
    dificuldade: "medio",
  },

  {
    id: 4,
    pergunta: "Qual processo converte energia luminosa em energia química?",
    opcoes: [
      "Fermentação",
      "Respiração celular",
      "Fotossíntese",
      "Digestão"
    ],
    resposta: "Fotossíntese",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 5,
    pergunta: "Qual estrutura vegetal é responsável pela absorção de água e sais minerais?",
    opcoes: [
      "Folha",
      "Flor",
      "Raiz",
      "Fruto"
    ],
    resposta: "Raiz",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 6,
    pergunta: "Qual dos seguintes organismos pertence ao Reino Fungi?",
    opcoes: [
      "Bactéria",
      "Cogumelo",
      "Protozoário",
      "Alga"
    ],
    resposta: "Cogumelo",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 7,
    pergunta: "Na genética mendeliana, um indivíduo heterozigoto possui:",
    opcoes: [
      "Dois alelos iguais",
      "Dois alelos diferentes",
      "Apenas um alelo",
      "Nenhum alelo dominante"
    ],
    resposta: "Dois alelos diferentes",
    materia: "Biologia",
    dificuldade: "medio",
  },

  {
    id: 8,
    pergunta: "Qual é o principal pigmento responsável pela captação de luz na fotossíntese?",
    opcoes: [
      "Hemoglobina",
      "Melanina",
      "Clorofila",
      "Caroteno"
    ],
    resposta: "Clorofila",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 9,
    pergunta: "Qual sistema do corpo humano é responsável pelo transporte de oxigênio e nutrientes?",
    opcoes: [
      "Digestório",
      "Respiratório",
      "Circulatório",
      "Nervoso"
    ],
    resposta: "Circulatório",
    materia: "Biologia",
    dificuldade: "facil",
  },

  {
    id: 10,
    pergunta: "Qual das alternativas representa corretamente a sequência dos níveis de organização biológica?",
    opcoes: [
      "Célula → tecido → órgão → sistema → organismo",
      "Órgão → tecido → célula → organismo → sistema",
      "Sistema → célula → tecido → órgão → organismo",
      "Tecido → órgão → célula → sistema → organismo"
    ],
    resposta: "Célula → tecido → órgão → sistema → organismo",
    materia: "Biologia",
    dificuldade: "medio",
  },

  {
  id: 11,
  pergunta: "Qual organela contém enzimas responsáveis pela digestão intracelular?",
  opcoes: ["Ribossomo", "Lisossomo", "Mitocôndria", "Nucléolo"],
  resposta: "Lisossomo",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 12,
  pergunta: "Qual processo celular produz duas células-filhas geneticamente idênticas?",
  opcoes: ["Meiose", "Mitose", "Fecundação", "Mutação"],
  resposta: "Mitose",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 13,
  pergunta: "A seleção natural foi proposta principalmente por:",
  opcoes: ["Gregor Mendel", "Louis Pasteur", "Charles Darwin", "Lamarck"],
  resposta: "Charles Darwin",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 14,
  pergunta: "Qual gás é consumido durante a respiração celular aeróbica?",
  opcoes: ["Nitrogênio", "Oxigênio", "Gás carbônico", "Metano"],
  resposta: "Oxigênio",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 15,
  pergunta: "Qual tecido vegetal é responsável pelo transporte de água e sais minerais?",
  opcoes: ["Floema", "Xilema", "Epiderme", "Parênquima"],
  resposta: "Xilema",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 16,
  pergunta: "Qual grupo sanguíneo é considerado receptor universal?",
  opcoes: ["A", "B", "AB", "O"],
  resposta: "AB",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 17,
  pergunta: "A unidade básica estrutural e funcional dos seres vivos é:",
  opcoes: ["Órgão", "Tecido", "Célula", "Sistema"],
  resposta: "Célula",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 18,
  pergunta: "Qual relação ecológica beneficia ambos os organismos envolvidos?",
  opcoes: ["Parasitismo", "Predação", "Mutualismo", "Competição"],
  resposta: "Mutualismo",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 19,
  pergunta: "Qual estrutura controla a entrada e saída de substâncias da célula?",
  opcoes: ["Citoplasma", "Membrana plasmática", "Núcleo", "Ribossomo"],
  resposta: "Membrana plasmática",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 20,
  pergunta: "Qual cientista é conhecido como o pai da genética?",
  opcoes: ["Darwin", "Pasteur", "Mendel", "Watson"],
  resposta: "Mendel",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 21,
  pergunta: "A molécula responsável pelo armazenamento das informações genéticas é:",
  opcoes: ["ATP", "RNA", "DNA", "Proteína"],
  resposta: "DNA",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 22,
  pergunta: "Qual bioma brasileiro apresenta grande biodiversidade e clima equatorial?",
  opcoes: ["Caatinga", "Pampa", "Amazônia", "Pantanal"],
  resposta: "Amazônia",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 23,
  pergunta: "Qual é a principal função das hemácias?",
  opcoes: [
    "Produzir anticorpos",
    "Transportar oxigênio",
    "Coagular sangue",
    "Combater vírus"
  ],
  resposta: "Transportar oxigênio",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 24,
  pergunta: "Na cadeia alimentar, os produtores são organismos que:",
  opcoes: [
    "Produzem seu próprio alimento",
    "Se alimentam de animais",
    "Decompõem matéria orgânica",
    "Vivem em simbiose"
  ],
  resposta: "Produzem seu próprio alimento",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 25,
  pergunta: "A fotossíntese ocorre principalmente em qual organela?",
  opcoes: ["Mitocôndria", "Cloroplasto", "Lisossomo", "Complexo de Golgi"],
  resposta: "Cloroplasto",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 26,
  pergunta: "Qual é o nome do processo em que plantas perdem água na forma de vapor?",
  opcoes: ["Respiração", "Fotossíntese", "Transpiração", "Gutação"],
  resposta: "Transpiração",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 27,
  pergunta: "Os organismos que se alimentam de matéria orgânica morta são chamados de:",
  opcoes: ["Produtores", "Consumidores", "Decompositores", "Autótrofos"],
  resposta: "Decompositores",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 28,
  pergunta: "Qual estrutura celular está presente em células vegetais e ausente em células animais?",
  opcoes: ["Membrana plasmática", "Ribossomo", "Parede celular", "Citoplasma"],
  resposta: "Parede celular",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 29,
  pergunta: "Qual vitamina é produzida pela pele com auxílio da luz solar?",
  opcoes: ["Vitamina A", "Vitamina B12", "Vitamina C", "Vitamina D"],
  resposta: "Vitamina D",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 30,
  pergunta: "Na classificação biológica, qual é a menor categoria taxonômica?",
  opcoes: ["Reino", "Filo", "Espécie", "Classe"],
  resposta: "Espécie",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 31,
  pergunta: "Qual sistema do corpo humano é responsável pela defesa do organismo?",
  opcoes: ["Digestório", "Respiratório", "Imunológico", "Nervoso"],
  resposta: "Imunológico",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 32,
  pergunta: "Os seres autotróficos produzem alimento através principalmente da:",
  opcoes: ["Fermentação", "Fotossíntese", "Digestão", "Respiração"],
  resposta: "Fotossíntese",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 33,
  pergunta: "Qual componente do sangue é responsável pela coagulação?",
  opcoes: ["Hemácias", "Leucócitos", "Plaquetas", "Plasma"],
  resposta: "Plaquetas",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 34,
  pergunta: "Qual gás é liberado na fotossíntese?",
  opcoes: ["Nitrogênio", "Oxigênio", "Gás carbônico", "Hidrogênio"],
  resposta: "Oxigênio",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 35,
  pergunta: "As bactérias pertencem a qual reino na classificação tradicional?",
  opcoes: ["Protista", "Fungi", "Monera", "Animalia"],
  resposta: "Monera",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 36,
  pergunta: "Qual é a principal função do sistema respiratório?",
  opcoes: [
    "Produzir sangue",
    "Realizar trocas gasosas",
    "Produzir hormônios",
    "Transportar nutrientes"
  ],
  resposta: "Realizar trocas gasosas",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 37,
  pergunta: "Qual é o nome do cruzamento entre indivíduos com características diferentes?",
  opcoes: ["Clonagem", "Hibridização", "Mitose", "Mutação"],
  resposta: "Hibridização",
  materia: "Biologia",
  dificuldade: "dificil",
  },

  {
  id: 38,
  pergunta: "Qual órgão humano produz a bile?",
  opcoes: ["Estômago", "Fígado", "Pâncreas", "Intestino"],
  resposta: "Fígado",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 39,
  pergunta: "Qual relação ecológica ocorre quando um organismo vive às custas de outro?",
  opcoes: ["Mutualismo", "Comensalismo", "Parasitismo", "Protocooperação"],
  resposta: "Parasitismo",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 40,
  pergunta: "A meiose resulta na formação de células:",
  opcoes: [
    "Diploides idênticas",
    "Haploides geneticamente diferentes",
    "Diploides diferentes",
    "Sem núcleo"
  ],
  resposta: "Haploides geneticamente diferentes",
  materia: "Biologia",
  dificuldade: "dificil",
  },

  {
  id: 41,
  pergunta: "Qual é a camada da atmosfera mais importante para proteção contra radiação UV?",
  opcoes: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"],
  resposta: "Estratosfera",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 42,
  pergunta: "Qual estrutura do olho humano controla a entrada de luz?",
  opcoes: ["Retina", "Córnea", "Íris", "Cristalino"],
  resposta: "Íris",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 43,
  pergunta: "O processo de obtenção de energia sem uso de oxigênio é chamado de:",
  opcoes: ["Fotossíntese", "Respiração aeróbica", "Fermentação", "Digestão"],
  resposta: "Fermentação",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 44,
  pergunta: "Qual hormônio regula a quantidade de glicose no sangue?",
  opcoes: ["Adrenalina", "Insulina", "Testosterona", "Tiroxina"],
  resposta: "Insulina",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 45,
  pergunta: "Qual dos seguintes é um exemplo de vertebrado?",
  opcoes: ["Minhoca", "Polvo", "Sapo", "Água-viva"],
  resposta: "Sapo",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 46,
  pergunta: "Qual estrutura é responsável pela produção de gametas femininos?",
  opcoes: ["Útero", "Ovário", "Trompa de Falópio", "Placenta"],
  resposta: "Ovário",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 47,
  pergunta: "A biodiversidade refere-se:",
  opcoes: [
    "À quantidade de água em um ambiente",
    "À variedade de seres vivos",
    "Ao número de humanos",
    "À poluição ambiental"
  ],
  resposta: "À variedade de seres vivos",
  materia: "Biologia",
  dificuldade: "facil",
  },

  {
  id: 48,
  pergunta: "Qual processo evolutivo favorece indivíduos mais adaptados ao ambiente?",
  opcoes: ["Mutação", "Seleção natural", "Migração", "Mitose"],
  resposta: "Seleção natural",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 49,
  pergunta: "Os vírus são considerados acelulares porque:",
  opcoes: [
    "Não possuem núcleo",
    "Não possuem membrana",
    "Não possuem células",
    "Não possuem DNA"
  ],
  resposta: "Não possuem células",
  materia: "Biologia",
  dificuldade: "medio",
  },

  {
  id: 50,
  pergunta: "Qual cientista desenvolveu a teoria da evolução das espécies?",
  opcoes: [
    "Mendel",
    "Pasteur",
    "Charles Darwin",
    "Lineu"
  ],
  resposta: "Charles Darwin",
  materia: "Biologia",
  dificuldade: "facil",
  },

  
];
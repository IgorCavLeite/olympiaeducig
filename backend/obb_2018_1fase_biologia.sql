-- Importacao pronta para phpMyAdmin
-- XIV Olimp?ada Brasileira de Biologia - 1? fase

SET NAMES utf8mb4;
USE OlympIA;

START TRANSACTION;

INSERT INTO questionarios (titulo, ano, fase, disciplina, nivel, descricao, fonte, data_prova) VALUES
('XIV Olimpíada Brasileira de Biologia - 1ª fase', 2018, NULL, 'Biologia', 'medio', 'Prova da 1ª fase da XIV Olimpíada Brasileira de Biologia, aplicada em 23/24 de fevereiro de 2018.', NULL, NULL);
SET @questionario_id = LAST_INSERT_ID();

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 1, '1) A pandemia de gripe hoje é menos provável devido às campanhas de vacinação promovidas em diversos países. O item abaixo que NÃO contém um dos possíveis componentes de vacinas é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Antígenos específicos.', 0),
(@pergunta_id, 'B', 'Patógenos mortos.', 0),
(@pergunta_id, 'C', 'Patógenos enfraquecidos.', 0),
(@pergunta_id, 'D', 'Anticorpos específicos.', 1),
(@pergunta_id, 'E', 'Ácido nucleico do patógeno.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 2, '2) Vírus são tidos como em um limiar entre seres vivos e matéria bruta. A característica comum entre os seres vivos e os vírus é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Capacidade de mineralização.', 0),
(@pergunta_id, 'B', 'Constituição química simples.', 0),
(@pergunta_id, 'C', 'Célula sem núcleo individualizado.', 0),
(@pergunta_id, 'D', 'Capacidade de reprodução.', 1),
(@pergunta_id, 'E', 'Presença de metabolismo.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 3, '3) Em 2005, os pesquisadores anunciaram ter determinado o sequenciamento genético do vírus da gripe de 1918. O vírus foi recuperado do corpo de uma vítima da doença sepultada no permafrost do Alasca, e também de amostras de soldados norte-americanos abatidos pela doença naquela época. Neste sequenciamento não foram encontrados nucleotídeos contendo:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Adenina.', 0),
(@pergunta_id, 'B', 'Citosina.', 0),
(@pergunta_id, 'C', 'Uracila.', 0),
(@pergunta_id, 'D', 'Timina.', 1),
(@pergunta_id, 'E', 'Guanina.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 4, '4) Doenças causadas por vírus usualmente são mais letais em seu surgimento do que após inúmeros surtos. Uma provável explicação para esta redução da letalidade é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Aumento das taxas de mutações virais ao longo do tempo.', 0),
(@pergunta_id, 'B', 'Coevolução parasita-hospedeiro.', 1),
(@pergunta_id, 'C', 'Surgimento de novos tipos de agentes transmissores.', 0),
(@pergunta_id, 'D', 'Desenvolvimento de novos tipos de antibióticos que ajam sobre o metabolismo viral.', 0),
(@pergunta_id, 'E', 'Aumento da produção de toxinas pelas novas linhagens virais.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 5, '5) Nos recentes casos de febre amarela no Brasil, parte da população erroneamente atacou diversas espécies de macacos por acreditar que estes seriam a origem da doença. Nesta doença os macacos podem ser classificados como:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Hospedeiro.', 1),
(@pergunta_id, 'B', 'Vetor.', 0),
(@pergunta_id, 'C', 'Agente transmissor.', 0),
(@pergunta_id, 'D', 'Agente causador.', 0),
(@pergunta_id, 'E', 'Agente etiológico.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 6, '6) A manga é cultivada em vários países do mundo, tendo como principal espécie Mangifera indica (2n = 40). O número esperado de cromossomos em seu pólen, caule e endosperma é respectivamente:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', '20, 40, 60.', 1),
(@pergunta_id, 'B', '20, 20, 40.', 0),
(@pergunta_id, 'C', '20, 40, 40.', 0),
(@pergunta_id, 'D', '40, 40, 40.', 0),
(@pergunta_id, 'E', '40, 40, 60.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 7, '7) Supondo que a cor rosa da manga seja determinada por um gene autossômico dominante e a cor amarela por seu alelo recessivo, na fecundação de uma planta feminina homozigota para a cor amarela por pólen oriundo de uma planta rosa homozigota, espera-se encontrar frutos de cor:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Somente rosas.', 0),
(@pergunta_id, 'B', 'Somente amarelos.', 1),
(@pergunta_id, 'C', '50% amarelos e 50% rosas.', 0),
(@pergunta_id, 'D', '75% amarelos e 25% rosas.', 0),
(@pergunta_id, 'E', '25% amarelos e 75% rosas.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 8, '8) O mel de uruçu é produzido por abelhas nativas e destaca-se pelo sabor bastante açucarado. O principal componente de sua composição possui como principal função no organismo humano:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Estrutural.', 0),
(@pergunta_id, 'B', 'Reguladora.', 0),
(@pergunta_id, 'C', 'Energética.', 1),
(@pergunta_id, 'D', 'Imunológica.', 0),
(@pergunta_id, 'E', 'Catalítica.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 9, '9) A cor da pele da Morena Tropicana é determinada pela atividade de células especiais denominadas melanócitos. A pele morena traz vantagem adaptativa nos trópicos uma vez que:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Aumenta a ativação da vitamina D.', 0),
(@pergunta_id, 'B', 'Protege contra os raios ultravioleta.', 1),
(@pergunta_id, 'C', 'Aumenta a produção de queratina.', 0),
(@pergunta_id, 'D', 'Promove camuflagem em ambientes florestais.', 0),
(@pergunta_id, 'E', 'Diminui a necessidade de pelos protetores.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 10, '10) Manga, sapoti, juá e uruçu possuem em comum a seguinte característica:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Cloroplastos.', 0),
(@pergunta_id, 'B', 'Celulose.', 0),
(@pergunta_id, 'C', 'Ausência de núcleo celular.', 0),
(@pergunta_id, 'D', 'Nutrição heterotrófica.', 0),
(@pergunta_id, 'E', 'Produção de gametas.', 1);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 11, '11) A criatura aquática do filme possui membranas interdigitais (entre os dedos) que facilitam sua natação. A espécie humana possui estas membranas ao longo do seu desenvolvimento embrionário, mas estas regridem devido à atividade de enzimas presentes no(a):', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Lisossomo.', 1),
(@pergunta_id, 'B', 'Retículo endoplasmático.', 0),
(@pergunta_id, 'C', 'Complexo golgiense.', 0),
(@pergunta_id, 'D', 'Peroxissomo.', 0),
(@pergunta_id, 'E', 'Centríolo.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 12, '12) Digamos que um diretor de filme explique que a necessidade de respirar debaixo d''água tenha orientado a evolução da espécie humana neste sentido. Tal explicação se encaixaria nas ideias evolutivas de:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Lamarck.', 1),
(@pergunta_id, 'B', 'Darwin.', 0),
(@pergunta_id, 'C', 'Malthus.', 0),
(@pergunta_id, 'D', 'Morgan.', 0),
(@pergunta_id, 'E', 'Dawkins.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 13, '13) No fim do filme, Elisa consegue sobreviver na água devido à abertura de fendas branquiais no seu pescoço. Fendas branquiais funcionais e desprotegidas podem ser encontradas em:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Atum.', 0),
(@pergunta_id, 'B', 'Robalo.', 0),
(@pergunta_id, 'C', 'Larva de mosquito.', 0),
(@pergunta_id, 'D', 'Pinguim.', 0),
(@pergunta_id, 'E', 'Raia.', 1);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 14, '14) O processo desenvolvido pelos cientistas mimetiza a fotossíntese. A organela responsável por este processo nas plantas é o(a):', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Ribossomo.', 0),
(@pergunta_id, 'B', 'Retículo endoplasmático.', 0),
(@pergunta_id, 'C', 'Complexo golgiense.', 0),
(@pergunta_id, 'D', 'Mitocôndria.', 0),
(@pergunta_id, 'E', 'Cloroplasto.', 1);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 15, '15) A conversão da energia luminosa em energia química depende de complexos denominados antenas. Graças a eles, a energia luminosa captada excita elétrons, cujo transporte permite a produção de ATP. A energia do ATP posteriormente utilizada na produção de carboidratos provém do(a):', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Adenosina.', 0),
(@pergunta_id, 'B', 'Ribose.', 0),
(@pergunta_id, 'C', 'Desoxirribose.', 0),
(@pergunta_id, 'D', 'Ligações fosfato.', 1),
(@pergunta_id, 'E', 'CO2.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 16, '16) O agravamento do efeito estufa preocupa grande parte da comunidade científica mundial. A atividade que contribui com a redução da emissão do principal gás estufa é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Aumento do consumo de carne.', 0),
(@pergunta_id, 'B', 'Diminuição do uso de aerossóis.', 0),
(@pergunta_id, 'C', 'Diminuição do uso de combustíveis fósseis.', 1),
(@pergunta_id, 'D', 'Aumento do uso de derivados de petróleo.', 0),
(@pergunta_id, 'E', 'Diminuição das áreas florestadas.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 17, '17) Uma importante consequência do superaquecimento global é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Aumento do nível dos oceanos.', 1),
(@pergunta_id, 'B', 'Acidificação das chuvas.', 0),
(@pergunta_id, 'C', 'Aumento da taxa de fotossíntese.', 0),
(@pergunta_id, 'D', 'Aumento do assoreamento dos rios.', 0),
(@pergunta_id, 'E', 'Diminuição das áreas áridas.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 18, '18) De acordo com o texto, a ação contraceptiva do anel vaginal ocorre devido ao:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Bloqueio da passagem dos espermatozoides pelo canal vaginal.', 0),
(@pergunta_id, 'B', 'Inibição da maturação e ruptura do folículo ovariano.', 1),
(@pergunta_id, 'C', 'Morte dos espermatozoides no canal vaginal.', 0),
(@pergunta_id, 'D', 'Morte dos ovócitos na tuba uterina.', 0),
(@pergunta_id, 'E', 'Morte do embrião após sua implantação.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 19, '19) O uso do anel vaginal pode ser comparado ao de preservativos uma vez que ambos:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Evitam a transmissão de doenças sexualmente transmissíveis.', 0),
(@pergunta_id, 'B', 'Possuem eficiência semelhante.', 1),
(@pergunta_id, 'C', 'Atuam de forma semelhante no organismo da mulher.', 0),
(@pergunta_id, 'D', 'Contêm hormônios que interferem no ciclo menstrual.', 0),
(@pergunta_id, 'E', 'Podem promover o aborto.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 20, '20) Os principais hormônios utilizados nas pílulas, anéis e adesivos anticoncepcionais são:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Estrogênios e progesterona.', 1),
(@pergunta_id, 'B', 'Gonadotrofinas coriônicas.', 0),
(@pergunta_id, 'C', 'Gonadotrofinas hipofisárias.', 0),
(@pergunta_id, 'D', 'FSH e LH.', 0),
(@pergunta_id, 'E', 'GnRH.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 21, '21) O uso de métodos anticoncepcionais hormonais aumenta o risco da ocorrência de trombose venosa. A ocorrência deste problema está diretamente relacionada à atividade de:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Hemácias.', 0),
(@pergunta_id, 'B', 'Leucócitos.', 0),
(@pergunta_id, 'C', 'Plaquetas.', 1),
(@pergunta_id, 'D', 'Neurônios.', 0),
(@pergunta_id, 'E', 'Osteócitos.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 22, '22) O hematócrito de cinco homens sedentários foi analisado em laboratório, sendo quatro deles moradores da cidade de São Paulo (760 m de altitude) e um deles morador de La Paz (3640 m de altitude). A alternativa que contém o número esperado de eritrócitos (x10^6/mm^3) no indivíduo homem morador de La Paz é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', '3,5.', 0),
(@pergunta_id, 'B', '4.', 0),
(@pergunta_id, 'C', '4,5.', 0),
(@pergunta_id, 'D', '5.', 0),
(@pergunta_id, 'E', '6.', 1);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 23, '23) Nos meses de junho e julho deste ano ocorrerá a Copa do Mundo da FIFA. Comparando a musculatura do goleiro Alisson com a do lateral Marcelo, espera-se encontrar em Alisson proporcionalmente:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Maior quantidade de mitocôndrias.', 0),
(@pergunta_id, 'B', 'Menor quantidade de mioglobina.', 1),
(@pergunta_id, 'C', 'Maior capacidade pulmonar.', 0),
(@pergunta_id, 'D', 'Menor capacidade fermentativa.', 0),
(@pergunta_id, 'E', 'Maior quantidade de hemoglobina.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 24, '24) A estratégia presente no besouro é somente uma dentre as diversas encontradas na natureza para evitar a predação. Identifique a alternativa abaixo que NÃO contém uma estratégia típica de predadores/presas:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Camuflagem.', 0),
(@pergunta_id, 'B', 'Mimetismo.', 0),
(@pergunta_id, 'C', 'Coloração de advertência.', 0),
(@pergunta_id, 'D', 'Perda de parte do corpo (autotomia).', 0),
(@pergunta_id, 'E', 'Indução de mutações.', 1);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 25, '25) Uma característica comum do besouro bombardeiro com os demais insetos é:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Excreção por nefrídios.', 0),
(@pergunta_id, 'B', 'Respiração por brânquias.', 0),
(@pergunta_id, 'C', 'Exoesqueleto de celulose.', 0),
(@pergunta_id, 'D', 'Três pares de patas.', 1),
(@pergunta_id, 'E', 'Aparelho bucal picador-sugador.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 26, '26) Atualmente, o número de óbitos após o transplante de órgãos é bem menor. O uso de medicamentos imunossupressores contribui para este sucesso. Esses medicamentos agem:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Diminuindo a rejeição.', 1),
(@pergunta_id, 'B', 'Aumentando a atividade leucocitária.', 0),
(@pergunta_id, 'C', 'Aumentando a produção de anticorpos.', 0),
(@pergunta_id, 'D', 'Diminuindo a formação de trombos.', 0),
(@pergunta_id, 'E', 'Aumentando a cicatrização.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 27, '27) Ainda hoje, muitos dos pacientes que aguardam transplante cardíaco possuem complicações relacionadas à doença de Chagas. A propagação desta doença pode ser evitada com:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Aumento das construções de alvenaria.', 1),
(@pergunta_id, 'B', 'Tratamento de água e esgoto.', 0),
(@pergunta_id, 'C', 'Lavar bem as mãos antes das refeições.', 0),
(@pergunta_id, 'D', 'Combate ao mosquito transmissor.', 0),
(@pergunta_id, 'E', 'Vacinação da população.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 28, '28) Suponha um indivíduo que tenha que receber um cateter em seu átrio direito. Caso o cateter seja inserido em uma veia do braço e siga o sentido do fluxo sanguíneo, o caminho percorrido por este será:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Veias cavas -> átrio direito.', 1),
(@pergunta_id, 'B', 'Veias pulmonares -> átrio direito.', 0),
(@pergunta_id, 'C', 'Veias cavas -> átrio esquerdo -> ventrículo esquerdo -> artéria pulmonar -> pulmões -> veias pulmonares -> átrio direito.', 0),
(@pergunta_id, 'D', 'Veias pulmonares -> átrio esquerdo -> ventrículo esquerdo -> artéria pulmonar -> pulmões -> veias cavas -> átrio direito.', 0),
(@pergunta_id, 'E', 'Veias cavas -> átrio esquerdo -> ventrículo direito -> artéria pulmonar -> pulmões -> veias pulmonares -> átrio direito.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 29, '29) A energia solar é fundamental para a manutenção dos ecossistemas. Pode-se afirmar que em uma cadeia alimentar a energia:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Mantém-se constante ao longo dos níveis tróficos.', 0),
(@pergunta_id, 'B', 'Diminui ao longo da cadeia alimentar.', 1),
(@pergunta_id, 'C', 'Aumenta ao longo da cadeia alimentar.', 0),
(@pergunta_id, 'D', 'É maior nos animais do que nas plantas.', 0),
(@pergunta_id, 'E', 'Sempre é maior nos decompositores.', 0);

INSERT INTO perguntas (questionario_id, numero, enunciado, tipo, pontos, tema, imagem_path) VALUES
(@questionario_id, 30, '30) Mais de um ano e meio após o acidente da barragem de Fundão, o Rio Doce sofre uma recuperação lenta e gradual. Este processo pode ser acelerado pelo homem ou mesmo ocorrer naturalmente. A recuperação de ecossistemas ao longo do tempo denomina-se:', 'multipla_escolha', 1, NULL, NULL);
SET @pergunta_id = LAST_INSERT_ID();
INSERT INTO opcoes (pergunta_id, letra, texto, correta) VALUES
(@pergunta_id, 'A', 'Zonação.', 0),
(@pergunta_id, 'B', 'Evolução.', 0),
(@pergunta_id, 'C', 'Sucessão ecológica.', 1),
(@pergunta_id, 'D', 'Bioacumulação.', 0),
(@pergunta_id, 'E', 'Eutrofização.', 0);

COMMIT;

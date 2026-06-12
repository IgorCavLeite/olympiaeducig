# OlympIA 🧠🧬

O **OlympIA** é um aplicativo mobile completo (Fullstack) projetado para atuar como um tutor inteligente e personalizado para estudantes que se preparam para olimpíadas acadêmicas brasileiras, com foco especial na **OBB (Olimpíada Brasileira de Biologia)**. 

O projeto é construído em uma arquitetura moderna dividida entre um aplicativo móvel desenvolvido em **React Native (Expo)** e um servidor **Node.js (Express) com TypeScript**, integrado ao banco de dados **MySQL** e utilizando a API do **Google Gemini** para as interações inteligentes.

---

## 🚀 Funcionalidades Principais

- 🔑 **Autenticação Segura:** Cadastro e Login de usuários com senhas criptografadas (via `bcrypt`) e autenticação baseada em tokens JWT.
- 🧑‍💻 **Perfil de Usuário:** Painel para gerenciamento de perfil, permitindo alteração dinâmica do nome cadastrado e atualização segura de senha.
- 💬 **Tutor Inteligente (IA):** Chat integrado com o modelo `gemini-2.5-flash-lite`, configurado com instruções de sistema (System Prompt) específicas para atuar como tutor didático da OBB, estimulando o raciocínio clínico e biológico do estudante.
- 📱 **Interface Fluida:** Layout amigável com um Grid central de navegação no menu principal.
- ⚙️ **Conexão Dinâmica:** Detecção automática do endereço IP da rede local para facilitar o teste em dispositivos móveis reais via Expo Go.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** com **Expo** (v54.0.33)
- **Expo Router** (Roteamento baseado em arquivos)
- **TypeScript** para tipagem estática
- **Axios** para consumo de APIs
- **AsyncStorage** para persistência de sessão local (Tokens e dados de perfil)

### Backend (API)
- **Node.js** com **Express** e **TypeScript**
- **MySQL** (Driver `mysql2`) para armazenamento persistente
- **JSON Web Tokens (JWT)** para controle de sessões
- **Bcrypt** para hashing seguro de senhas
- **Google Generative AI SDK** (Integração com Gemini)

---

## 📂 Estrutura de Diretórios

A estrutura do repositório está organizada da seguinte forma:

```text
olympiaeducig/
├── backend/                  # Servidor Express.js (TypeScript)
│   ├── config/               # Configurações de banco de dados e JWT
│   │   ├── db.ts             # Conexão e pooling do MySQL
│   │   └── jwtConfig.ts      # Configurações de expiração e chaves secretas
│   ├── controllers/          # Lógica de controle das requisições
│   │   ├── authController.ts # Registro, Login e Alterações de Perfil
│   │   └── chatController.ts # Integração com o Google Gemini
│   ├── routes/               # Definição das rotas da API
│   │   ├── authRoutes.ts     # Rotas de autenticação e perfil
│   │   └── chatRoutes.ts     # Rotas do Chat do tutor
│   ├── .env                  # Variáveis de ambiente do backend
│   ├── server.ts             # Arquivo de entrada do servidor
│   ├── package.json          # Dependências do backend
│   └── tsconfig.json         # Configuração TypeScript do backend
│
├── frontend/                 # Aplicativo Mobile (Expo + React Native)
│   ├── app/                  # Telas do aplicativo (Expo Router)
│   │   ├── index.tsx         # Tela inicial (Welcome)
│   │   ├── LoginScreen.tsx   # Login de usuário
│   │   ├── Cadastro.tsx      # Cadastro de novo usuário
│   │   ├── Home.tsx          # Menu principal com Grid de opções
│   │   ├── Chat.tsx          # Chat interativo com a IA tutor
│   │   └── Perfil.tsx        # Gerenciamento de dados do perfil
│   ├── assets/               # Imagens, logos e ícones
│   ├── components/           # Componentes visuais reutilizáveis
│   ├── constants/            # Constantes globais (Config.ts, Colors.ts)
│   │   └── Config.ts         # Detecção automática do IP da API
│   ├── package.json          # Dependências do app mobile
│   └── tsconfig.json         # Configuração TypeScript do frontend
│
├── iniciar_tudo.bat          # Script batch para inicialização simultânea do projeto
├── package.json              # Dependências da raiz do projeto
└── tsconfig.json             # Configuração TypeScript da raiz
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
1. [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendada)
2. [MySQL Server](https://www.mysql.com/) ativo localmente ou na nuvem

---

### 1. Banco de Dados MySQL

Antes de ligar o servidor, crie o banco de dados e a tabela de usuários necessária executando o seguinte script SQL em seu cliente MySQL (ex: MySQL Workbench, DBeaver, phpMyAdmin):

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS OlympIA;
USE OlympIA;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Configurando o Backend (`/backend`)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Verifique ou crie o arquivo `.env` na raiz da pasta `backend` com as seguintes credenciais:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=OlympIA
   DB_PORT=3306
   JWT_SECRET=sua_chave_secreta_jwt
   GEMINI_API_KEY=sua_chave_api_do_gemini
   ```

---

### 3. Configurando o Frontend (`/frontend`)

1. Navegue até a pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

> [!NOTE]
> O arquivo [Config.ts](file:///c:/Users/Usuario/OneDrive/Área de Trabalho/olympiaeducig/frontend/constants/Config.ts) tenta extrair o IP local do seu computador de forma automática a partir dos metadados do Expo. Caso utilize um emulador ou o app não conecte, você pode ajustar o fallback manual configurando a variável `IP_DA_REDE` diretamente naquele arquivo.

---

## 🏃 Como Rodar o Projeto

Para facilitar o desenvolvimento, existe um script automatizado na raiz do projeto chamado `iniciar_tudo.bat`. Ele se encarrega de ligar o backend e o frontend simultaneamente.

1. Vá para a raiz do repositório.
2. Dê duplo clique no arquivo **`iniciar_tudo.bat`** (ou execute-o pelo terminal Windows):
   ```cmd
   iniciar_tudo.bat
   ```
3. Duas novas janelas de comando (Prompt) serão abertas:
   - **Janela 1 (Backend):** Executa o servidor TypeScript em `http://localhost:3001`
   - **Janela 2 (Frontend):** Inicia o bundler do Expo (`npx expo start --host lan`)
4. Escaneie o **QR Code** exibido no terminal utilizando o aplicativo **Expo Go** em seu celular (iOS ou Android) conectado à mesma rede Wi-Fi do computador.

---

## 🤖 Regras de Comportamento da IA (Tutor)

O tutor inteligente responde com as seguintes diretrizes configuradas no `chatController.ts`:
- **Nome:** OlympIA
- **Especialidade:** Olimpíada OBB (Biologia)
- **Estilo de Escrita:**
  - Conciso e didático (respostas limitadas a no máximo 3 frases curtas e diretas).
  - Linguagem amigável em português brasileiro.
  - Incentiva a resolução de exercícios mostrando o passo a passo.
  - Provoca reflexões e convida o estudante a aprofundar se desejar.

---

## 🗺️ Roadmap de Desenvolvimento

No painel inicial (Home) do aplicativo, estão mapeados botões para novas funcionalidades que podem ser integradas no futuro:
- [x] **Chat (Tutor):** Totalmente funcional.
- [x] **Perfil:** Totalmente funcional com edição de dados.
- [ ] **Conquistas:** Histórico de medalhas e marcos de estudo (Em desenvolvimento).
- [ ] **Quiz:** Sistema de perguntas e respostas estilo simulado (Em desenvolvimento).
- [ ] **Calendário:** Cronograma de datas importantes de olimpíadas acadêmicas (Em desenvolvimento).
- [ ] **Configurações:** Customizações avançadas do aplicativo (Em desenvolvimento).

# OlympIA - Backend API 🧠

Este diretório contém o servidor e API REST do **OlympIA**, construído em **Node.js** utilizando **Express** e escrito inteiramente em **TypeScript**. 

O backend é responsável por gerenciar a lógica de autenticação dos usuários (utilizando JWT e criptografia bcrypt), realizar o gerenciamento de sessões e mediar o contato com o banco de dados MySQL, além de integrar o SDK do **Google Generative AI (Gemini)** para o chat didático personalizado.

Para ver a documentação geral do projeto de forma consolidada, consulte o [README principal da raiz do projeto](../README.md).

---

## 🛠️ Tecnologias Utilizadas

- **Express.js** (v5.2.1)
- **TypeScript** & **npx tsx** para desenvolvimento e execução rápida de arquivos TypeScript.
- **MySQL2** para conexão ao banco de dados relacional.
- **Bcrypt** para hashing de senhas seguro.
- **JSON Web Tokens (JWT)** para autenticação de requisições.
- **Google Generative AI SDK** para consumir a inteligência do Gemini.
- **Dotenv** para gerenciamento seguro de variáveis de ambiente.

---

## 📡 Endpoints da API

### Autenticação & Perfil (`/api/auth`)

- **`POST /api/auth/register`**
  - **Descrição:** Registra um novo usuário no banco de dados.
  - **Body:** `{ "nome": "Exemplo", "email": "exemplo@email.com", "senha": "senha_segura" }`
- **`POST /api/auth/login`**
  - **Descrição:** Autentica o usuário e retorna o Token JWT e informações básicas do perfil.
  - **Body:** `{ "email": "exemplo@email.com", "senha": "senha_segura" }`
- **`PUT /api/auth/perfil/:id`**
  - **Descrição:** Altera o nome cadastrado do usuário.
  - **Body:** `{ "nome": "Novo Nome" }`
- **`PUT /api/auth/senha/:id`**
  - **Descrição:** Altera de forma segura a senha do usuário, exigindo a senha atual correspondente.
  - **Body:** `{ "senhaAtual": "antiga", "novaSenha": "nova" }`

### Chat Inteligente (`/api/chat`)

- **`POST /api/chat`** (ou `/api/auth/chat`)
  - **Descrição:** Envia uma mensagem para o tutor inteligente de biologia, incluindo o histórico da conversa para manter o contexto.
  - **Body:**
    ```json
    {
      "message": "O que é mitose?",
      "history": [
        { "sender": "user", "text": "Olá!" },
        { "sender": "ai", "text": "Olá! Qual tema vamos estudar hoje?" }
      ]
    }
    ```
  - **Resposta:** `{ "reply": "A mitose é um processo de divisão celular..." }`

---

## 🗄️ Estrutura do Banco de Dados (MySQL)

As tabelas do banco de dados são mapeadas em SQL da seguinte forma:

```sql
CREATE DATABASE IF NOT EXISTS OlympIA;
USE OlympIA;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏃 Como Iniciar Apenas o Backend

Para rodar o servidor Express separadamente durante o desenvolvimento:

1. Certifique-se de preencher o arquivo `.env` com as configurações corretas de banco de dados e as chaves de API:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=OlympIA
   DB_PORT=3306
   JWT_SECRET=chave_mestra_secreta
   GEMINI_API_KEY=sua_chave_do_gemini
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor em modo de desenvolvimento:
   ```bash
   npx tsx server.ts
   ```
4. O console indicará o status da conexão com o banco de dados e a porta ativa:
   `Local: http://localhost:3001`

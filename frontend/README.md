# OlympIA - Mobile Client 📱

Este diretório contém o código-fonte do aplicativo móvel **OlympIA**, construído com **React Native** e **Expo**. O aplicativo é a interface principal onde os alunos podem interagir com o tutor inteligente de biologia, gerenciar seus perfis e navegar pelos recursos de preparação para as olimpíadas.

Para obter a documentação completa do projeto, incluindo a arquitetura do backend, configuração de banco de dados e instruções detalhadas de instalação, consulte o [README principal da raiz do projeto](../README.md).

---

## 🛠️ Tecnologias Utilizadas

- **React Native** (v0.81.5) & **Expo** (v54.0.33)
- **Expo Router** para roteamento de telas baseado em arquivos.
- **TypeScript** para desenvolvimento tipado e seguro.
- **Axios** para chamadas assíncronas de API para o backend do projeto.
- **AsyncStorage** para armazenamento persistente local.
- **React Native Reanimated** para animações e micro-interações fluidas.

---

## 📂 Estrutura de Telas (`/app`)

As telas do aplicativo estão localizadas dentro da pasta `app/` e seguem o sistema de roteamento do **Expo Router**:

1. 🏠 **`index.tsx`**: Tela de boas-vindas do aplicativo. Oferece as opções básicas de navegação para a tela de Login ou Cadastro.
2. 🔑 **`LoginScreen.tsx`**: Formulário de autenticação. Realiza a requisição ao backend e armazena de forma segura o token JWT e dados do usuário no `AsyncStorage`.
3. 📝 **`Cadastro.tsx`**: Tela de criação de nova conta contendo validações simples, como o requisito de no mínimo 8 caracteres para a senha.
4. 🧭 **`Home.tsx`**: Menu principal após o login. Apresenta o logotipo do projeto e um grid de botões para acessar as ferramentas de estudo.
5. 💬 **`Chat.tsx`**: Chat em tempo real conectado com a inteligência artificial. Mantém o histórico de mensagens da conversa ativa e exibe um indicador visual enquanto a resposta está sendo gerada.
6. 👤 **`Perfil.tsx`**: Painel de gerenciamento do aluno. Permite alterar o nome de usuário (exibido no topo e nas mensagens), trocar a senha com modais dinâmicos ou efetuar o Logout limpando as credenciais salvas.

---

## 🏃 Como Iniciar Apenas o Frontend

Se você deseja rodar apenas a interface móvel isoladamente, certifique-se de que o backend já esteja executando (para que as requisições de autenticação e chat funcionem):

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npm start
   ```
   *Ou use `npx expo start --host lan` para forçar o IP local e facilitar o escaneamento no celular físico.*
3. Abra o app **Expo Go** no seu celular e escaneie o QR Code gerado no terminal.

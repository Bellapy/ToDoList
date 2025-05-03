# ToDoList

# To-Do List Web Application 📝

Esta é uma aplicação web simples para gerenciamento de tarefas (To-Do List) construída com Node.js, Express e EJS para renderização no lado do servidor. Ela permite aos usuários autenticados criar, visualizar, atualizar e excluir tarefas, interagindo com um banco de dados MongoDB.

A aplicação utiliza sessões para autenticação de usuários e inclui uma mistura de renderização de páginas HTML via EJS e um endpoint de API JSON para a funcionalidade de exclusão.

## Funcionalidades ✨

*   **Autenticação de Usuário:** Sistema de login simples baseado em sessão.
*   **Gerenciamento de Tarefas (CRUD):**
    *   **C**reate: Adicionar novas tarefas.
    *   **R**ead: Listar todas as tarefas existentes.
    *   **U**pdate: Editar o texto de tarefas existentes (acessado via link na lista).
    *   **D**elete: Remover tarefas (via botão na interface, que dispara uma requisição `DELETE` para a API).
*   **Interface Web:** Páginas renderizadas no servidor usando EJS.
*   **Persistência:** Tarefas e usuários são armazenados em um banco de dados MongoDB.
*   **Rotas Protegidas:** A maioria das funcionalidades de tarefas requer que o usuário esteja logado.
*   **API Endpoint:** Exclusão de tarefas (`DELETE /delete/:id`) funciona como um endpoint de API REST retornando JSON.

## Tecnologias Utilizadas 🚀

*   **Backend:** Node.js, Express.js
*   **View Engine:** EJS (Embedded JavaScript templates)
*   **Banco de Dados:** MongoDB
*   **ODM (Object Data Modeling):** Mongoose
*   **Gerenciamento de Sessão:** express-session

## Pré-requisitos 📋

*   **Node.js:** Versão LTS recomendada (inclui npm).
*   **MongoDB:**
    *   Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (serviço de nuvem gratuito).
    *   OU uma instância local do MongoDB rodando na sua máquina.

## Configuração e Instalação ⚙️

1.  **Clone o Repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta-do-projeto>
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure a Conexão com o Banco de Dados:**
    *   Abra o arquivo `database/db.js`.
    *   Localize a linha `mongoose.connect(...)`.
    *   **Substitua a string de conexão atual** pela sua string de conexão do MongoDB Atlas ou do seu MongoDB local.
        ```javascript
        // Exemplo:
        mongoose.connect(
          "SUA_STRING_DE_CONEXAO_MONGODB_AQUI", // <-- SUBSTITUA AQUI
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }
        )
        ```
    *   **⚠️ Segurança Importante:** Para aplicações reais, **NUNCA** coloque sua string de conexão diretamente no código. Use variáveis de ambiente (com um pacote como `dotenv`). Veja a seção "Variáveis de Ambiente Recomendadas" abaixo.

4.  **Configure o Segredo da Sessão:**
    *   Abra o arquivo `index.js`.
    *   Localize a configuração do `express-session`: `secret: 'chave-simples'`.
    *   **Altere `'chave-simples'` para um segredo mais forte e único.**
    *   **⚠️ Segurança Importante:** Para aplicações reais, use variáveis de ambiente para o segredo da sessão também.

5.  **Crie um Usuário (Manual):**
    *   Como não há rota de registro, você precisará adicionar um usuário manualmente ao seu banco de dados MongoDB para poder fazer login.
    *   Use uma ferramenta como MongoDB Compass, o Mongo Shell, ou a interface do Atlas.
    *   Crie um documento na coleção `users` com a seguinte estrutura:
        ```json
        {
          "username": "seu_nome_de_usuario",
          "password": "sua_senha"
        }
        ```
    *   **Nota:** Este exemplo armazena senhas em texto plano, o que **NÃO é seguro** para produção. Em um app real, use hashing (ex: com `bcrypt`).

## Executando a Aplicação ▶️

1.  **Inicie o Servidor:**
    ```bash
    node index.js
    ```
    (Ou `npm start` se você configurar um script no `package.json`).

2.  **Acesse no Navegador:**
    Abra seu navegador e vá para `http://localhost:3000`.

## Como Usar 🧑‍💻

1.  Você será redirecionado para a página de `/login`.
2.  Faça login com o `username` e `password` que você criou manualmente no banco de dados.
3.  Após o login, você será direcionado para a página inicial (`/`) que lista as tarefas existentes.
4.  Use o formulário na página inicial para **criar novas tarefas**.
5.  Clique no ícone de edição (lápis) ao lado de uma tarefa para carregá-la no formulário e poder **atualizar seu texto**.
6.  Clique no ícone de exclusão (lixeira) ao lado de uma tarefa. Uma confirmação aparecerá. Se confirmar, uma requisição `DELETE /delete/:id` será enviada para a API para **excluir a tarefa**.
7.  Use o link "Logout" para encerrar sua sessão.

## Documentação da API (Postman)  P

Uma documentação detalhada das interações HTTP, incluindo autenticação, o endpoint de exclusão (`DELETE /delete/:id`), e exemplos das outras interações (mesmo que retornem HTML/Redirects), foi criada usando Postman.

**Consulte a coleção Postman e sua documentação gerada para:**

*   Ver detalhes exatos de cada endpoint (método, URL, parâmetros, corpo esperado).
*   Entender o fluxo de autenticação baseado em cookies (`connect.sid`).
*   Ver exemplos de respostas JSON (para o endpoint de delete) e entender o comportamento de redirect/HTML das outras rotas.

*(Opcional: Se você publicou a documentação do Postman, adicione o link aqui)*
*   **[Link para a Documentação Publicada do Postman](URL_DA_SUA_DOC_POSTMAN_AQUI)**

## Estrutura do Projeto 📁

/
├── controller/
│ └── TaskController.js # Lógica de controle para tarefas
├── database/
│ └── db.js # Configuração da conexão MongoDB
├── models/
│ ├── Task.js # Schema Mongoose para Tarefas
│ └── user.js # Schema Mongoose para Usuários
├── node_modules/ # Dependências do Node.js
├── public/ # Arquivos estáticos (CSS, JS do lado do cliente)
│ └── script.js # Exemplo: Script para confirmação de delete
├── routes/
│ └── routes.js # Definição das rotas da aplicação
├── views/ # Arquivos de template EJS
│ ├── index.ejs # Página principal (lista/cria/edita tarefas)
│ └── login.ejs # Página de login
├── .gitignore # Arquivos/pastas a serem ignorados pelo Git
├── index.js # Ponto de entrada principal da aplicação Express
├── package.json # Metadados do projeto e dependências
├── package-lock.json # Lockfile de dependências
└── README.md # Este arquivo


## Variáveis de Ambiente Recomendadas (Melhor Prática) ⭐️

Para melhorar a segurança e a configuração, é altamente recomendado usar variáveis de ambiente em vez de colocar informações sensíveis diretamente no código.

1.  Instale o pacote `dotenv`:
    ```bash
    npm install dotenv
    ```
2.  Crie um arquivo `.env` na raiz do projeto:
    ```ini
    # .env
    MONGODB_URI=SUA_STRING_DE_CONEXAO_MONGODB_AQUI
    SESSION_SECRET=SEU_SEGREDO_DE_SESSAO_FORTE_E_UNICO_AQUI
    PORT=3000
    ```
3.  Adicione `.env` ao seu arquivo `.gitignore`.
4.  Modifique seu código para carregar e usar essas variáveis:

    *   No início do `index.js`:
        ```javascript
        require('dotenv').config(); // Carrega variáveis do .env
        // ... outros requires
        ```
    *   Em `database/db.js`:
        ```javascript
        mongoose.connect(process.env.MONGODB_URI, { /* ... opções ... */ });
        ```
    *   Em `index.js` (configuração da sessão):
        ```javascript
        app.use(session({
          secret: process.env.SESSION_SECRET,
          // ... outras opções ...
        }));
        ```
    *   Em `index.js` (porta):
        ```javascript
        const port = process.env.PORT || 3000;
        ```

---
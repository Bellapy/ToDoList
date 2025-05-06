require('dotenv').config(); // Carrega as variáveis do arquivo .env para process.env
const express = require("express");
const path = require("path");
const session = require("express-session");
const routes = require("./routes/routes");
const conectToDb = require("./database/db");

// --- Adições para Swagger ---
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
// --- Fim das Adições para Swagger ---

conectToDb();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares para parsing de requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET, // Certifique-se que SESSION_SECRET está no seu .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Adicione 'secure: true' em produção se usar HTTPS
}));

// Configuração do View Engine e arquivos estáticos
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); // Garante que o Express sabe onde procurar as views
app.use(express.static(path.join(__dirname, "public")));

// --- Configuração do Swagger UI ---
try {
    // Caminho para o seu arquivo openapi.yaml (assumindo que está em uma pasta 'docs' na raiz)
    const openApiPath = path.join(__dirname, 'openapi.yaml');

    // Verifica se o arquivo existe antes de tentar carregá-lo
    if (fs.existsSync(openApiPath)) {
        const openApiDocument = YAML.load(fs.readFileSync(openApiPath, 'utf8'));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
        console.log(`Documentação da API (Swagger UI) disponível em http://localhost:${port}/api-docs`);
    } else {
        console.warn(`Arquivo openapi.yaml não encontrado em ${openApiPath}. O Swagger UI não será iniciado.`);
    }
} catch (e) {
    console.error('Falha ao carregar ou configurar o Swagger UI:', e);
}
// --- Fim da Configuração do Swagger UI ---

// Uso das rotas da aplicação
app.use(routes);

// Inicialização do servidor
app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
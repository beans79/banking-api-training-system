const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const accountRoutes = require('./routes/accounts');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// DEBUG: Verifica pastas (CORRIGIDO com ..)
console.log('✅ Pastas verificadas:');
console.log('frontend-web:', fs.existsSync(path.join(__dirname, '..', 'frontend-web')) ? '✅ OK' : '❌ FALTA!');
console.log('frontend-mobile:', fs.existsSync(path.join(__dirname, '..', 'frontend-mobile')) ? '✅ OK' : '❌ FALTA!');
console.log('routes/accounts.js:', fs.existsSync(path.join(__dirname, 'routes', 'accounts.js')) ? '✅ OK' : '❌ FALTA!');

// 1. SERVE FRONTEND WEB (/) - CORRIGIDO
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend-web', 'index.html');
  console.log('Tentando servir:', filePath); // DEBUG
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: `frontend-web/index.html não encontrado em: ${filePath}` });
  }
});

// 2. SERVE FRONTEND MOBILE (/mobile) - CORRIGIDO
app.get('/mobile', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend-mobile', 'index.html'); // ← MUDOU ..
  console.log('Tentando mobile:', filePath); // DEBUG
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: `frontend-mobile/index.html não encontrado em: ${filePath}` });
  }
});

// 3. API DOCS (Swagger)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banking API',
      version: '1.0.0',
      description: 'API simples de banco para treino de QA'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 4. ROTAS API
app.use('/accounts', accountRoutes);

// 5. Fallback
app.use('*', (req, res) => {
  res.status(404).json({ error: `Rota ${req.path} não encontrada. Tente: /, /mobile, /api-docs` });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando: http://localhost:${PORT}`);
  console.log(`📱 Web: http://localhost:${PORT}/`);
  console.log(`📱 Mobile: http://localhost:${PORT}/mobile`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const accountRoutes = require('./routes/accounts');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banking API',
      version: '1.0.0',
      description: 'API simples de banco para treino de QA'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/accounts', accountRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Banking API rodando! Acesse /api-docs para a documentação.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger em http://localhost:${PORT}/api-docs`);
});

const express = require('express');
const routes = require('./equipamentos.routes');
const roomRoutes = require('./routes/salas.routes.js');
// const { mongooseApp } = require('./database/index');
const { connectDB } = require('./database/index');
const app = express();

// iniciando o banco de dados
(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados', err);
  }
})();

// iniciando as rotas
app.use(express.json());
app.use('/salas', roomRoutes);
app.use('/api', routes); // Adicionando o prefixo '/api' para as rotas

// iniciando o server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!!! 🚀`);
});
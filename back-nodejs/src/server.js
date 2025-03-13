const express = require('express');
const cors = require('cors');
const roomRoutes = require('./routes/salas.routes.js');
const equipamentosRoutes = require('./routes/equipamentos.routes.js');
const equipSalaRoutes = require('./routes/equipsala.routes.js');
const reservasRoutes = require('./routes/reservas.routes.js');
const verificarReservasRoutes = require('./routes/verificarreservas.routes.js');
const { connectDB } = require('./database/index');

const app = express();

// ✅ Configuração do CORS deve vir antes de qualquer rota
app.use(cors({
  origin: 'http://localhost:5173', // Altere para a URL correta do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Iniciando o banco de dados
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados', err);
  }
})();

// Middleware para processar JSON
app.use(express.json());

// Iniciando as rotas (após configurar o CORS)
app.use('/salas', roomRoutes);
app.use('/equipamentos', equipamentosRoutes);
app.use('/equipsala', equipSalaRoutes);
app.use('/reservas', reservasRoutes);
app.use('/verificarreservas', verificarReservasRoutes);

// Iniciando o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!!! 🚀`);
});

module.exports = { app };

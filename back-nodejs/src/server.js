const express = require('express');
const { mongooseApp } = require('./database');
const app = express();

app.use(express.json());

// rota basica
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// iniciando o server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!!! 🚀`);
});
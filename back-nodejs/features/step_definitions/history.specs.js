const mongoose = require('mongoose');
const { strictEqual } = require("assert/strict");
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const request = require('supertest');
const { app } = require('../../src/server');
const { connectDB, disconnectDB } = require('../../src/database');
const History = require('../../src/models/History');
const Room = require('../../src/models/Salas');
const Reserva = require('../../src/models/Reserva');

let server;

Before(async () => {
  await connectDB(process.env.MONGO_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal

  await mongoose.connection.db.dropCollection("histories");
  await mongoose.connection.db.dropCollection("rooms");
  await mongoose.connection.db.dropCollection("reservas");
});

After(async () => {
  await server.close();
  await disconnectDB();
});

// Cenário: Visualizar histórico
Given('eu estou logado como {string} com o login {string} e senha {string}', async function (role, login, senha) {
  // Simulação de autenticação (pode ser implementada conforme necessário)
  this.auth = { login, senha };
});

Given('eu estou na página {string}', function (page) {
  this.currentPage = page;
});

When('eu seleciono {string}', async function (option) {
  if (option === 'Histórico') {
    this.response = await request(server).get('/historico');
  } else if (option === 'Buscar') {
    this.response = await request(server).get('/historico/buscar');
  } else if (option === 'Realizar Busca') {
    this.response = await request(server).get('/historico/buscar').query(this.filters || {});
  } else if (option === 'Redefinir filtros') {
    this.response = await request(server).get('/historico/redefinir');
  }
});

Then('eu estou na página {string}', function (page) {
  expect(this.currentPage).to.equal(page);
});

Then('eu consigo ver uma lista com {string}', function (listType) {
  expect(this.response.body).to.be.an('array');
  if (listType === 'Histórico completo') {
    expect(this.response.body).to.have.lengthOf(2);
  } else if (listType === 'histórico filtrado') {
    expect(this.response.body).to.have.lengthOf(1);
  }
});

// Cenário: Busca com filtro
When('eu seleciono o filtro {string}', function (filter) {
  this.filters = this.filters || {};
  this.filters[filter.toLowerCase()] = '';
});

When('eu preencho com {string}', function (value) {
  const lastFilter = Object.keys(this.filters).pop();
  this.filters[lastFilter] = value;
});

Then('apenas ocorrências com o atributo {string} no campo {string} aparecem', function (value, field) {
  this.response.body.forEach((item) => {
    expect(item[field.toLowerCase()]).to.equal(value);
  });
});

// Cenário: Busca vazia
Given('não há ocorrências com o atributo {string} no campo {string}', async function (value, field) {
  await History.deleteMany({ [field.toLowerCase()]: value });
});

Then('não há itens na lista', function () {
  expect(this.response.body).to.be.an('array').that.is.empty;
});

// Cenário: Redefinir filtros
Then('eu consigo ver uma lista com {string}', function (listType) {
  expect(this.response.body).to.be.an('array');
  if (listType === 'Histórico completo') {
    expect(this.response.body).to.have.lengthOf(2);
  }
});

// Dados de teste
Before(async () => {
  await History.insertMany([
    {
      id: '1',
      proprietario: 'Luiza',
      sala: 'D003',
      data: new Date('2024-12-10'),
      hora: '10h-12h',
    },
    {
      id: '2',
      proprietario: 'Carlos',
      sala: 'A101',
      data: new Date('2024-12-11'),
      hora: '14h-16h',
    },
  ]);
});

const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
let chai;
(async ()  => {
  chai = await import('chai');
})();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const History = require('../../src/models/History');
const app = require('../../src/server');

let server;
let mongoServer;
let dbConnection;

Before(async () => {
  if (!mongoose.connection.readyState) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

After(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});


// Dados de teste padrão para todos os cenários
Before({ tags: '@history' }, async () => {
  await History.deleteMany(); // Limpa o banco antes de inserir os novos dados
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

// Simulação de autenticação
Given('eu estou logado como {string} com o login {string} e senha {string}', async function (role, login, senha) {
  this.authHeader = { Authorization: 'Bearer token_simulado' };
});

// Navegação entre páginas
Given('eu estou na página {string}', function (page) {
  this.currentPage = page;
});

// Seleção de opções
When('eu seleciono {string}', async function (option) {
  switch (option) {
    case 'Histórico':
      this.response = await request(server).get('/historico').set(this.authHeader);
      break;
    case 'Buscar':
      this.response = await request(server).get('/historico/buscar').set(this.authHeader);
      break;
    case 'Realizar Busca':
      this.response = await request(server)
        .get('/historico/buscar')
        .query(this.filters || {})
        .set(this.authHeader);
      break;
    case 'Redefinir filtros':
      this.response = await request(server).get('/historico/redefinir').set(this.authHeader);
      break;
    default:
      throw new Error(`Opção "${option}" não reconhecida.`);
  }
});

// Validação de redirecionamento
Then('eu estou na página {string}', function (page) {
  expect(this.currentPage).to.equal(page);
});

// Validação da lista de histórico
Then('eu consigo ver uma lista com {string}', function (listType) {
  expect(this.response.body).to.be.an('array');
  if (listType === 'Histórico completo') {
    expect(this.response.body).to.have.lengthOf(2);
  } else if (listType === 'histórico filtrado') {
    expect(this.response.body).to.have.lengthOf(1);
  }
});

// Filtros de busca
When('eu seleciono o filtro {string}', function (filter) {
  this.filters = this.filters || {};
  this.filters[filter.toLowerCase()] = '';
});

When('eu preencho com {string}', function (value) {
  const lastFilter = Object.keys(this.filters).pop();
  this.filters[lastFilter] = value;
});

// Validação de filtros
Then('apenas ocorrências com o atributo {string} no campo {string} aparecem', function (value, field) {
  this.response.body.forEach((item) => {
    expect(item[field.toLowerCase()]).to.equal(value);
  });
});

// Cenário de busca vazia
Given('não há ocorrências com o atributo {string} no campo {string}', async function (value, field) {
  await History.deleteMany({ [field.toLowerCase()]: value });
});

Then('não há itens na lista', function () {
  expect(this.response.body).to.be.an('array').that.is.empty;
});

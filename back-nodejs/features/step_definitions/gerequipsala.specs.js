const { Given, When, Then, Before, After } = require('cucumber');
const request = require('supertest');
const { app } = require('../../src/server');
const { connectDB, disconnectDB } = require('../../src/database');
const GerEquipSala = require('../../src/models/GerEquipSala');
const Equipamento = require('../../src/models/Equipamento');
const Room = require('../../src/models/Salas');

let server;
let salaId;
let equipamentoId;
let response;

Before(async () => {
  await connectDB(process.env.MONGODB_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal
});

After(async () => {
  await server.close();
  await disconnectDB();
});

Given('uma sala com identificador {string} está cadastrada', async function (identificador) {
  const sala = new Room({ identificador, predio: 'Prédio A', capacidade: 30 });
  await sala.save();
  salaId = sala._id;
});

Given('um equipamento com nome {string} está cadastrado', async function (nome) {
  const equipamento = new Equipamento({ nome });
  await equipamento.save();
  equipamentoId = equipamento._id;
});

When('eu adiciono o equipamento à sala com quantidade {int}', async function (quantidade) {
  response = await request(server)
    .post('/gerequipsala')
    .send({ salaId, equipamentoId, quantidade });
});

Then('o equipamento deve ser adicionado à sala com sucesso', function () {
  expect(response.status).toBe(201);
  expect(response.body.msg).toBe('Equipamento adicionado à sala com sucesso');
});

When('eu removo o equipamento da sala', async function () {
  response = await request(server)
    .delete(`/gerequipsala/${salaId}/${equipamentoId}`);
});

Then('o equipamento deve ser removido da sala com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Equipamento removido da sala com sucesso');
});

When('eu removo {int} unidades do equipamento da sala', async function (quantidade) {
  response = await request(server)
    .delete(`/gerequipsala/${salaId}/${equipamentoId}`)
    .send({ quantidade });
});

Then('a quantidade de equipamento deve ser atualizada com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Quantidade de equipamento atualizada com sucesso');
});

When('eu listo os equipamentos da sala', async function () {
  response = await request(server)
    .get(`/gerequipsala/${salaId}`);
});

Then('os equipamentos da sala devem ser listados com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Equipamentos listados com sucesso');
  expect(response.body.data).toContainEqual(expect.objectContaining({ _id: equipamentoId.toString() }));
});

When('eu atualizo a quantidade do equipamento na sala para {int}', async function (quantidade) {
  response = await request(server)
    .put(`/gerequipsala/${salaId}/${equipamentoId}`)
    .send({ quantidade });
});

Then('o equipamento deve ser atualizado com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Equipamento atualizado com sucesso');
  if (quantidade > 0) {
    expect(response.body.data.quantidade).toBe(quantidade);
  } else {
    expect(response.body.data).toBeUndefined();
  }
});

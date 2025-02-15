const mongoose = require("mongoose");
const { Given, When, Then, Before, After } = require('cucumber');
const request = require('supertest');
const { app } = require('../../src/server');
const { connectDB, disconnectDB } = require('../../src/database');
const EquipSala = require('../../src/models/EquipSala');
const Equipamento = require('../../src/models/Equipamento');
const Room = require('../../src/models/Salas');

let server;
let salaId;
let equipamentoId;
let response;

Before(async () => {
  await connectDB(process.env.MONGO_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal
});

After(async () => {
  await server.close();
  await disconnectDB();
});

Given('o sistema tem as seguintes salas e recursos cadastrados:', async function (dataTable) {
  const listaRecursos = dataTable.hashes(); // Converte para array de objetos

  for (const recurso of listaRecursos) {
    let sala = await Room.findOne({ identificador: recurso.Sala });
    if (!sala) {
      sala = new Room({ identificador: recurso.Sala, predio: 'Prédio A', capacidade: 30 });
      await sala.save();
    }

    let equipamento = await Equipamento.findOne({ nome: recurso.Recurso });
    if (!equipamento) {
      equipamento = new Equipamento({ nome: recurso.Recurso });
      await equipamento.save();
    }

    const equipSala = new EquipSala({
      salaId: sala._id,
      equipamentoId: equipamento._id,
      quantidade: recurso.Quantidade,
    });
    await equipSala.save();
  }
});

When('o administrador associa o recurso {string} à sala {string} com quantidade {int}', async function (recurso, sala, quantidade) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .post('/equipsala')
    .send({ salaId: salaObj._id, equipamentoId: equipamento._id, quantidade });
});

Then('o sistema registra o recurso {string} com quantidade {int} na sala {string}', async function (recurso, quantidade, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipamento._id });

  expect(equipSala).not.toBeNull();
  expect(equipSala.quantidade).toBe(quantidade);
});

Then('o recurso {string} é adicionado à base de dados de recursos disponíveis', async function (recurso) {
  const equipamento = await Equipamento.findOne({ nome: recurso });
  expect(equipamento).not.toBeNull();
});

Then('o sistema retorna a mensagem {string} com status {int}', function (mensagem, status) {
  expect(response.status).toBe(status);
  expect(response.body.msg).toBe(mensagem);
});

When('o administrador remove o recurso {string} da sala {string}', async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .delete(`/equipsala/${salaObj._id}/${equipamento._id}`);
});

Then('o sistema remove o recurso {string} da lista de recursos associados à sala {string}', async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipamento._id });

  expect(equipSala).toBeNull();
});

Then('o recurso {string} permanece na base de dados geral para associações futuras', async function (recurso) {
  const equipamento = await Equipamento.findOne({ nome: recurso });
  expect(equipamento).not.toBeNull();
});

When('o administrador tenta associar o recurso {string} à sala {string} sem informar a quantidade', async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .post('/equipsala')
    .send({ salaId: salaObj._id, equipamentoId: equipamento._id });
});

Then('o sistema rejeita a operação', function () {
  expect(response.status).toBe(400);
});

Then('o sistema exibe a mensagem de erro {string}', function (mensagem) {
  expect(response.body.msg).toBe(mensagem);
});

Then('não adiciona {string} à sala {string}', async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipamento._id });

  expect(equipSala).toBeNull();
});

When('o administrador tenta remover o recurso {string} da sala {string}', async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .delete(`/equipsala/${salaObj._id}/${equipamento._id}`);
});

Then('o sistema rejeita a remoção', function () {
  expect(response.status).toBe(400);
});

Then('exibe a mensagem de erro {string}', function (mensagem) {
  expect(response.body.msg).toBe(mensagem);
});

When('o administrador tenta associar o recurso {string} com quantidade {int} à sala {string}', async function (recurso, quantidade, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .post('/equipsala')
    .send({ salaId: salaObj._id, equipamentoId: equipamento._id, quantidade });
});

Then('registra o erro {string}', function (mensagem) {
  expect(response.body.msg).toBe(mensagem);
});

When('o administrador consulta os recursos da sala {string}', async function (sala) {
  const salaObj = await Room.findOne({ identificador: sala });

  response = await request(server)
    .get(`/equipsala/${salaObj._id}`);
});

Then('o sistema retorna a lista de recursos da sala {string}:', async function (sala, dataTable) {
  const listaRecursos = dataTable.hashes(); // Converte para array de objetos
  const salaObj = await Room.findOne({ identificador: sala });

  const equipamentos = await EquipSala.find({ salaId: salaObj._id });

  listaRecursos.forEach(recurso => {
    const equipamento = equipamentos.find(e => e.equipamentoId.toString() === recurso.Recurso);
    expect(equipamento).not.toBeNull();
    expect(equipamento.quantidade).toBe(parseInt(recurso.Quantidade));
  });
});

Then('o sistema retorna uma mensagem com status {int}', function (status) {
  expect(response.status).toBe(status);
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
    .post('/equipsala')
    .send({ salaId, equipamentoId, quantidade });
});

Then('o equipamento deve ser adicionado à sala com sucesso', function () {
  expect(response.status).toBe(201);
  expect(response.body.msg).toBe('Equipamento adicionado à sala com sucesso');
});

When('eu removo o equipamento da sala', async function () {
  response = await request(server)
    .delete(`/equipsala/${salaId}/${equipamentoId}`);
});

Then('o equipamento deve ser removido da sala com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Equipamento removido da sala com sucesso');
});

When('eu removo {int} unidades do equipamento da sala', async function (quantidade) {
  response = await request(server)
    .delete(`/equipsala/${salaId}/${equipamentoId}`)
    .send({ quantidade });
});

Then('a quantidade de equipamento deve ser atualizada com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Quantidade de equipamento atualizada com sucesso');
});

When('eu listo os equipamentos da sala', async function () {
  response = await request(server)
    .get(`/equipsala/${salaId}`);
});

Then('os equipamentos da sala devem ser listados com sucesso', function () {
  expect(response.status).toBe(200);
  expect(response.body.msg).toBe('Equipamentos listados com sucesso');
  expect(response.body.data).toContainEqual(expect.objectContaining({ _id: equipamentoId.toString() }));
});

When('eu atualizo a quantidade do equipamento na sala para {int}', async function (quantidade) {
  response = await request(server)
    .put(`/equipsala/${salaId}/${equipamentoId}`)
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

const mongoose = require('mongoose');
const { strictEqual } = require("assert/strict");
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const request = require('supertest');
const { app } = require('../../src/server');
const { connectDB, disconnectDB } = require('../../src/database');
const EquipSala = require('../../src/models/EquipSala');
const Equipamento = require('../../src/models/Equipamento');
const Room = require('../../src/models/Salas');
const { getEquipSalabyName } = require('../../src/controllers/EquipSala/EquipSalaController');

let server;
let salaId;
let equipamentoId;
let response;
let salaObj;
let equipObj;
let equipsalaObj;
let testAddGiven;

Before(async () => {
  await connectDB(process.env.MONGO_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal
  
  await mongoose.connection.db.dropCollection("equipamentos");
  await mongoose.connection.db.dropCollection("rooms");
  await mongoose.connection.db.dropCollection("equipsalas");  
  await mongoose.connection.db.dropCollection("reservas");
});

After(async () => {
  await server.close();
  await disconnectDB();
});

Given('o sistema tem as seguintes salas e recursos cadastrados:', 
  async function (dataTable) {
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

Given('a sala com identificador {string} está cadastrada', 
  async function (identificador) {
  const sala = new Room({ identificador, predio: 'Prédio A', capacidade: 30 });
  await sala.save();
  testAddGiven = await Room.findOne({identificador});
  strictEqual(testAddGiven._id.toString(), sala._id.toString());
});

Given('o recurso com nome {string} está cadastrado', 
  async function (nome) {
  const equipamento = new Equipamento({ nome });
  await equipamento.save();
  testAddGiven = await Equipamento.findOne({nome})._id;
  strictEqual(testAddGiven, equipamento._id);
});

Given('a sala {string} tem uma reserva ativa para o recurso {string}', 
  async function (sala, recurso) {
  salaObj = await Room.findOne({ identificador: sala });
  equipObj = await Equipamento.findOne({ nome: recurso });
  if(!equipObj){ equipObj = new Equipamento({ nome: recurso }); }
  if(!salaObj){ salaObj = new Room({ identificador: sala, predio: 'Prédio A', capacidade: 30}); }
  
  equipsalaObj = await EquipSala.findOne({salaId: salaObj._id, equipamentoId: equipObj._id});
  
  if(!equipsalaObj){
    equipsalaObj = new EquipSala({
      salaId: salaObj._id,
      equipamentoId: equipObj._id,
      datasReservas: []
    });
    await equipsalaObj.save();
    
  }
  
  response = await request(server)
    .post('/reservas')
    .send({ tipo: 'equipamento', equipSalaId: equipsalaObj._id.toString(), dataReserva: '08/03/2025' });

  strictEqual(response.status, 201);
});

When('o administrador tenta associar o recurso {string} à sala {string} com quantidade {string}', 
  async function (recurso, sala, quantidade) {
  salaObj = await Room.findOne({ identificador: sala });
  if(!salaObj){
    response = await request(server)
      .post('/equipsala')
      .send({ salaId: null, equipamentoId: "", equipNome: recurso, quantidade});
  }
  else{
    response = await request(server)
      .post('/equipsala')
      .send({ salaId: salaObj._id, equipamentoId: "", equipNome: recurso, quantidade});
  }
});

Then('o sistema registra o recurso {string} com quantidade {string} na sala {string}', 
  async function (recurso, quantidade, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipamento._id });

  strictEqual(equipSala !== null, true);
  strictEqual(equipSala.quantidade, parseInt(quantidade));
});

Then('o recurso {string} é adicionado à base de dados de recursos disponíveis', 
  async function (recurso) {
  const equipamento = await Equipamento.findOne({ nome: recurso });
  strictEqual(equipamento !== null, true);
});

Then('o sistema retorna a mensagem {string} com status {string}', 
  async function (mensagem, status) {
  strictEqual(response.status, parseInt(status, 10));
  strictEqual(response.body.msg, mensagem);
});


Then('o sistema remove o recurso {string} da lista de recursos associados à sala {string}', 
  async function (recurso, sala) {
  salaObj = await Room.findOne({ identificador: sala });
  equipObj = await Equipamento.findOne({ nome: recurso });
  equipsalaObj = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipObj._id });

  strictEqual(equipsalaObj, null);
});

Then('o recurso {string} permanece na base de dados geral para associações futuras', 
  async function (recurso) {
  const equipamento = await Equipamento.findOne({ nome: recurso });
  strictEqual(equipamento !== null, true);
});

When('o administrador tenta associar o recurso {string} à sala {string} sem informar a quantidade', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .post('/equipsala')
    .send({ salaId: salaObj._id, equipamentoId: equipamento._id });
});

Then('o sistema rejeita a operação', function () {
  strictEqual(response.status, 400);
});

Then('o sistema exibe a mensagem de erro {string}', function (mensagem) {
  strictEqual(response.body.msg, mensagem);
});

Then('não adiciona {string} à sala {string}', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipamento._id });

  strictEqual(equipSala, null);
});

When('o administrador tenta remover o recurso {string} da sala {string}', 
  async function (recurso, sala) {
  salaObj = await Room.findOne({ identificador: sala }); 
  equipObj = await Equipamento.findOne({ nome: recurso });  

  response = await request(server)
    .delete(`/equipsala/${salaObj._id}/${equipObj._id}`);
});

When('o administrador tenta consultar os recursos da sala {string}', 
  async function (sala) {
  salaObj = await Room.findOne({ identificador: sala });

  response = await request(server)
    .get(`/equipsala/${salaObj._id}`);
});

Then('o sistema retorna a lista de recursos da sala {string}:', 
  async function (sala, dataTable) {
  const listaRecursos = dataTable.hashes(); // Converte para array de objetos
  
  const equipamentos = response.body.data; // lista [ {Equipamento, quantidade}, ... ]
  
  listaRecursos.forEach( (recurso) => {
    let equipinst = null;
    for (let i = 0; i < equipamentos.length; i++) {
      
      if (equipamentos[i].equipamento.nome == recurso.Recurso && 
        equipamentos[i].quantidade == recurso.Quantidade
      ) {
        equipinst = equipamentos[i];
        break;
      }
    }
    strictEqual(equipinst.equipamento.nome, recurso.Recurso);
    strictEqual(equipinst.quantidade, parseInt(recurso.Quantidade));
  });
});

When('eu atualizo a quantidade do equipamento na sala para {int}', 
  async function (quantidade) {
  response = await request(server)
    .put(`/equipsala/${salaId}/${equipamentoId}`)
    .send({ quantidade });
});



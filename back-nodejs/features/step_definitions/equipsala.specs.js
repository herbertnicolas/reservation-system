const mongoose = require('mongoose');
const { strictEqual } = require("assert/strict");
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const request = require('supertest');
const { app } = require('../../src/server');
const { connectDB, disconnectDB } = require('../../src/database');
const EquipSala = require('../../src/models/EquipSala');
const Equipamento = require('../../src/models/Equipamento');
const Reserva = require('../../src/models/Reserva');
const Room = require('../../src/models/Salas');
const { 
  getSalaIdByName, 
  getEquipIdByName, 
  getEquipSalaByName 
} = require('../../src/controllers/EquipSala/EquipSalaController');

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

Given('o sistema tem salas com os seguintes recursos cadastrados:', 
  async function (dataTable) {
  const listaRecursos = dataTable.hashes(); // Converte para array de objetos

  for (const recurso of listaRecursos) {
    let sala = await Room.findOne({ identificador: recurso.Sala });
    if (!sala) {
      sala = new Room({ identificador: recurso.Sala, localizacao: 'Prédio A', capacidade: 30 });
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

Given('a sala com nome {string} está cadastrada', 
  async function (identificador) {
  const salaObj = new Room({ identificador, localizacao: 'Prédio A', capacidade: 30 });
  await salaObj.save();
});

Given('a sala com nome {string} não está cadastrada', 
  async function (identificador) {
  const salaObj = await Room.findOne({ identificador });
  strictEqual(salaObj, null);
});

Given('o recurso com nome {string} está cadastrado', 
  async function (nome) {
  const equipObj = new Equipamento({ nome });
  await equipObj.save();
});

Given('o recurso com nome {string} não está cadastrado', 
  async function (nome) {
  const equipObj = await Equipamento.findOne({ nome });
  strictEqual(equipObj, null);
});

Given('a sala {string} tem uma reserva ativa para o recurso {string}', 
  async function (sala, recurso) {
  let salaObj = await Room.findOne({ identificador: sala });
  let equipObj = await Equipamento.findOne({ nome: recurso });
  if(!equipObj){ equipObj = new Equipamento({ nome: recurso }); }
  if(!salaObj){ salaObj = new Room({ identificador: sala, predio: 'Prédio A', capacidade: 30 }); }

  const reservaObj = new Reserva({
    equipSalaId: equipObj._id, 
    salaId: salaObj._id, 
    tipo: 'equipamento', 
    dataReserva: new Date().toLocaleDateString('pt-BR') 
  });
  await reservaObj.save();
});

When('o administrador faz uma requisição POST do recurso {string} à sala {string} com quantidade {string}', 
  async function (recurso, sala, quantidade) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);
  
  response = await request(server)
      .post('/equipsala')
      .send({ 
        salaId: salaId, 
        equipamentoId: equipId, 
        equipNome: recurso, 
        quantidade
      });
});

When('o administrador faz uma requisição POST do recurso {string} à sala {string} sem informar a quantidade', 
  async function (recurso, sala) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);

  response = await request(server)
    .post('/equipsala')
    .send({ 
      salaId: salaId, 
      equipamentoId: equipId
    });
});

When('o administrador faz uma requisição DELETE para o recurso {string} da sala {string}', 
  async function (recurso, sala) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);

  response = await request(server)
    .delete(`/equipsala/${salaId}/${equipId}`);
});

When('o administrador faz uma requisição GET para a sala {string}', 
  async function (sala) {
  const salaId = await getSalaIdByName(sala);

  response = await request(server)
    .get(`/equipsala/${salaId}`);
});

When('o administrador faz uma requisição PUT para o recurso {string} na sala {string} com quantidade {string}' , 
  async function (recurso, sala, quantidade) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);
  
  response = await request(server)
    .put(`/equipsala/${salaId}/${equipId}`)
    .send({ quantidade });
});

Then('o sistema registra o recurso {string} na sala {string} com quantidade {string}', 
  async function (recurso, sala, quantidade) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);
  const equipSalaObj = await EquipSala.findOne({ salaId: salaId, equipamentoId: equipId });
  
  strictEqual(equipSalaObj.equipamentoId.toString(), equipId.toString());
  strictEqual(equipSalaObj.salaId.toString(), salaId.toString());
  strictEqual(equipSalaObj.quantidade, parseInt(quantidade, 10));
});

Then('o recurso {string} é adicionado à base de dados de recursos disponíveis', async function (recurso) {
  const equipId = await getEquipIdByName(recurso);
  strictEqual(equipId !== null, true);
});

Then('o sistema retorna a mensagem {string} com status {string}', async function (mensagem, status) {
  strictEqual(response.body.msg, mensagem);
  strictEqual(response.status, parseInt(status, 10));
});

Then('o sistema remove o recurso {string} dos recursos associados à sala {string}', async function (recurso, sala) {
  const salaId = await getSalaIdByName(sala);
  const equipId = await getEquipIdByName(recurso);
  const equipsalaObj = await EquipSala.findOne({ salaId: salaId, equipamentoId: equipId });

  strictEqual(equipsalaObj, null);
});

Then('o recurso {string} permanece na base de dados geral para associações futuras', async function (recurso) {
  const equipId = await getEquipIdByName(recurso);
  strictEqual(equipId !== null, true);
});


Then('o sistema retorna a lista de recursos da sala:', async function (dataTable) {
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





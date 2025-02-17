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
const { resourceUsage } = require('process');


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
  const salaObj = await Room.findOne({ identificador: sala });
  const equipObj = await Equipamento.findOne({nome: recurso})
  
  response = await request(server)
      .post('/equipsala')
      .send({ 
        salaId: salaObj? salaObj._id : '' , 
        equipamentoId: equipObj? equipObj._id : '', 
        equipNome: recurso, 
        quantidade
      });
});

When('o administrador faz uma requisição POST do recurso {string} à sala {string} sem informar a quantidade', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipamento = await Equipamento.findOne({ nome: recurso });

  response = await request(server)
    .post('/equipsala')
    .send({ 
      salaId: salaObj? salaObj._id : null, 
      equipamentoId: equipamento? equipamento._id : null 
    });
});

When('o administrador faz uma requisição DELETE para o recurso {string} da sala {string}', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala }); 
  const equipObj = await Equipamento.findOne({ nome: recurso });  

  response = await request(server)
    .delete(`/equipsala/${salaObj._id}/${equipObj._id}`);
});

When('o administrador faz uma requisição GET para a sala {string}', 
  async function (sala) {
  const salaObj = await Room.findOne({ identificador: sala });

  response = await request(server)
    .get(`/equipsala/${salaObj._id}`);
});

When('o administrador faz uma requisição PUT para o recurso {string} na sala {string} com quantidade {string}' , 
  async function (recurso, sala, quantidade) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipObj = await Equipamento.findOne({nome: recurso});
  response = await request(server)
    .put(`/equipsala/${salaObj._id}/${equipObj._id}`)
    .send({ quantidade });
});

Then('o sistema registra o recurso {string} na sala {string} com quantidade {string}', 
  async function (recurso, sala, quantidade) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipObj = await Equipamento.findOne({ nome: recurso });
  const equipSalaObj = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipObj._id });
  
  strictEqual(equipSalaObj.equipamentoId.toString(), equipObj._id.toString());
  strictEqual(equipSalaObj.salaId.toString(), salaObj._id.toString());
  strictEqual(equipSalaObj.quantidade, parseInt(quantidade, 10));
});

Then('o recurso {string} é adicionado à base de dados de recursos disponíveis', 
  async function (recurso) {
  const equipamento = await Equipamento.findOne({ nome: recurso });
  strictEqual(equipamento.nome, recurso);
});

Then('o sistema retorna a mensagem {string} com status {string}', 
  async function (mensagem, status) {
    strictEqual(response.body.msg, mensagem);
  strictEqual(response.status, parseInt(status, 10));
});

Then('o sistema remove o recurso {string} dos recursos associados à sala {string}', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipObj = await Equipamento.findOne({ nome: recurso });
  const equipsalaObj = await EquipSala.findOne({ salaId: salaObj._id, equipamentoId: equipObj._id });

  strictEqual(equipsalaObj, null);
});

Then('o recurso {string} permanece na base de dados geral para associações futuras', 
  async function (recurso) {
  const equipObj = await Equipamento.findOne({ nome: recurso });
  strictEqual(equipObj.nome, recurso);
});

Then('não adiciona {string} à sala {string}', 
  async function (recurso, sala) {
  const salaObj = await Room.findOne({ identificador: sala });
  const equipObj = await Equipamento.findOne({ nome: recurso });
  const equipSala = await EquipSala.findOne({ 
    salaId: salaObj? salaObj._id : null, 
    equipamentoId: equipObj? equipObj._id : null  
  });

  strictEqual(equipSala, null);
});

Then('o sistema retorna a lista de recursos da sala:', 
  async function (dataTable) {
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





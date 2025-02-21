const { Given, When, Then, Before } = require('cucumber');
const assert = require('assert');
const request = require('supertest');
const app = require('../../src/server').app;
const Reserva = require('../../src/models/Reserva');
const Sala = require('../../src/models/Salas');
const EquipSala = require('../../src/models/EquipSala');
const Equipamento = require('../../src/models/Equipamento');

let response;
let targetReserva;
let tempSalaId;
let equipamentosCadastrados = [];
// ------------------- PASSOS COMUNS -------------------
Given('as seguintes salas cadastradas:', async function (dataTable) {
  for (const item of dataTable.hashes()) {
      const novaSala = await new Sala({
        identificador: item.identificador,
        localizacao: item.localização,
        capacidade: parseInt(item.capacidade)
      }).save();

      tempSalaId = novaSala._id;
  }
});

Given('os seguintes equipamentos cadastrados:', async function (dataTable) {
  for (const item of dataTable.hashes()) {
    const equip = await new Equipamento({ nome: item.nome }).save();
    equipamentosCadastrados.push(equip);

    const novoEquipamento = new EquipSala({
      salaId: tempSalaId,
      equipamentoId: equip._id,
      quantidade: 5,
      datasReservas: []
    })
    await novoEquipamento.save();
  }
});

Given('as seguintes reservas existem:', async function (dataTable) {
  for (const reserva of dataTable.hashes()) {
    const novaReserva = new Reserva({
      salaId: tempSalaId,
      equipamentoId: equipamentosCadastrados[0]._id,
      dataReserva: reserva.dataReserva,
      tipo: reserva.tipo,
    });
    await novaReserva.save();
  }
});

Given('uma reserva existente para {string}', async function (data) {
  targetReserva = await Reserva.findOne({ dataReserva: data });
});

// ------------------- PASSOS DE AÇÃO -------------------
When('envio uma request {string} para o endpoint {string}', async function (method, endpoint) {
  const url = endpoint.replace('{reservaId}', targetReserva?._id || 'invalid_id');
  response = await request(app)[method.toLowerCase()](url);
});

When ('envio uma request {string} para o endpoint de uma reserva {string}',
  async function (method, endpoint) {
    const novaReserva = new Reserva({
      salaId: tempSalaId,
      // equipamentoId: equipamentosCadastrados[0]._id,
      dataReserva: "2025-03-08",
      tipo: "sala",
    });
    await novaReserva.save();
    const url = endpoint.replace('{reservaId}', novaReserva._id.toString() || 'invalid_id');
    console.log("&&&&&&&&&&&&&&&&", url);

    response = await request(app)[method.toLowerCase()](url);
  }
);


// When('envio uma request {string} para o endpoint {string} com o corpo:', async function (method, endpoint, docString) {
//   response = await request(app)[method.toLowerCase()](endpoint).send({
//     tipo,
//     dataReserva,
//     salaId: tempSalaId,
//     equipamentoId: equipamentosCadastrados[0]._id
//   });
// });

// ------------------- VERIFICAÇÕES -------------------
Then('recebo a response com status {string}', function (status) {
  assert.strictEqual(response.status, parseInt(status));
});

Then('o corpo da resposta contém uma lista com {int} reservas', function (quantidade) {
  assert.strictEqual(response.body.data.length, quantidade);
});

Then('cada reserva possui os campos {string}', function (campos) {
  const camposArray = campos.replace(/"/g, '').split(', ');
  response.body.data.forEach(reserva => {
    camposArray.forEach(campo => {
      assert.ok(reserva.hasOwnProperty(campo), `Campo ${campo} não encontrado`);
    });
  });
});

Then('o corpo da resposta contém a mensagem {string}', function (mensagem) {
  assert.ok(response.body.msg.includes(mensagem));
});

Then('o corpo da resposta possui:', function (docString) {
  const expected = JSON.parse(docString);
  assert.deepStrictEqual(response.body, expected);
});

When('envio uma request {string} para o endpoint {string} com os atributos tipo {string}, dataReserva {string} salaId e equipamentoId existentes no banco',
  async function (method, endpoint, tipo, dataReserva) {
    console.log("&&&&&&&&&&&&&&&&", endpoint);
    response = await request(app)[method.toLowerCase()](endpoint).send({
      tipo,
      dataReserva,
      salaId: tempSalaId.toString(),
    });    
});

When('envio uma request {string} para o endpoint {string} com o corpo:', async function (method, endpoint, docString) {
  const corpo = JSON.parse(docString);
  response = await request(app)[method.toLowerCase()](endpoint).send(corpo);
});


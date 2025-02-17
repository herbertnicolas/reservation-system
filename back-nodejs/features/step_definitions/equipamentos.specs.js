const { Given, When, Then, Before } = require('cucumber');
const assert = require('assert');
const request = require('supertest');
const app = require('../../src/server').app;
const Equipamento = require('../../src/models/Equipamento');

let response;
let targetEquipamento;

Given('os seguintes equipamentos estão cadastrados:', async function (dataTable) {
  for (const equipamento of dataTable.hashes()) {
    await new Equipamento({ nome: equipamento.nome }).save();
  }
});

Given('o equipamento {string} está cadastrado', async function (nome) {
  targetEquipamento = await Equipamento.findOne({ nome });
  if (!targetEquipamento) {
    targetEquipamento = await new Equipamento({ nome }).save();
  }
});

When('envio uma requisição do tipo {string} para o endpoint {string}', async function (method, endpoint) {
  const url = endpoint.replace('{_id}', targetEquipamento?._id || '507f1f77bcf86cd799439011');
  response = await request(app)[method.toLowerCase()](url);
});

When('envio uma requisição do tipo {string} para o endpoint {string} com o corpo:', async function (method, endpoint, docString) {
  const corpo = JSON.parse(docString);
  response = await request(app)[method.toLowerCase()](endpoint).send(corpo);
});

Then('o response deve ter status {string}', function (status) {
  assert.strictEqual(response.status, parseInt(status));
});

Then('o body da resposta deve conter:', function (docString) {
  const expected = JSON.parse(docString);
  // Clona o corpo da resposta para evitar alterar o original
  const actual = JSON.parse(JSON.stringify(response.body));
  // Substitui os campos dinâmicos por "<any>"
  actual.data._id = "<any>";
  actual.data.__v = "<any>";
  assert.deepStrictEqual(actual, expected);
});

Then('o body da resposta deve ser:', function (docString) {
  const expected = JSON.parse(docString);
  const actual = JSON.parse(JSON.stringify(response.body));

  assert.deepStrictEqual(actual, expected);
});


Then('o body da resposta deve ser uma lista com {int} equipamentos', function (quantidade) {
  assert.strictEqual(response.body.data.length, quantidade);
});

Then('cada equipamento possui os campos {string}, {string} e {string}', function (campo1, campo2, campo3) {
  const camposArray = [campo1, campo2, campo3];
  response.body.data.forEach(equipamento => {
    camposArray.forEach(campo => {
      assert.ok(equipamento.hasOwnProperty(campo), `Campo ${campo} não encontrado`);
    });
  });
});

Then('o body da resposta deve ser os dados do {string}', function (nomeEquipamento) {
  assert.strictEqual(response.body.data.nome, nomeEquipamento);
});

Then('o body da resposta deve ser a mensagem {string}', function (mensagem) {
  assert.ok(response.body.msg.includes(mensagem));
});
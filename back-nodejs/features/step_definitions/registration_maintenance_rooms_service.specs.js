const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const assert = require('assert');
const request = require('supertest');
const app = require('../../src/server').app;
const Room = require('../../src/models/Salas');

let response;

Given('as seguintes salas estão cadastradas:', async function (dataTable) {
  for (const sala of dataTable.hashes()) {
    await request(app)
      .post('/salas')
      .send({
        identificador: sala.identificador,
        localizacao: sala.localização,
        capacidade: parseInt(sala.capacidade),
      });
  }
});

Given('a sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (identificador, localizacao, capacidade) {
  const existingRoom = await Room.findOne({ identificador, localizacao, capacidade });
  if(existingRoom){
    assert.strictEqual(res.status, 404, `A sala com identificador ${identificador} e ${localizacao} já está cadastrada.`);
  }
});

When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (method, endpoint, docString) {
  const corpo = JSON.parse(docString);
  response = await request(app)[method.toLowerCase()](endpoint).send(corpo);
});

Then('o serviço responde com status {string}', async function (status) {
  assert.strictEqual(response.status, parseInt(status), `Status esperado: ${status}, Status recebido: ${response.status}`);
});

Then('o corpo da resposta contém:', async function (docString) {
  const expected = JSON.parse(docString);
  assert.deepStrictEqual(response.body, expected, `Corpo da resposta não corresponde ao esperado.`);
});

// Cenário: Tentar criar uma sala já existente
Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (identificador, localizacao, capacidade) {
  await request(app)
    .post('/salas')
    .send({
      identificador,
      localizacao,
      capacidade: parseInt(capacidade),
    });
});

When('envio uma requisição {string} para o endpoint {string}', async function (method, endpoint) {
  const url = endpoint.replace('{_id}', 'teste');
  response = await request(app)[method.toLowerCase()](url);
});
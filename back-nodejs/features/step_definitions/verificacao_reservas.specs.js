const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const { expect } = require('chai');
let chai;
(async () => {
  chai = await import('chai');
})();
const app = require('../../src/server').app;
const Reserva = require('../../src/models/Reserva');
const mongoose = require('mongoose');

let response;
let token;

Given('Existem as seguintes reservas cadastradas:', async function (reservasTable) {
    await Reserva.deleteMany({});

    const reservas = reservasTable.hashes();
    for (const reserva of reservas) {
        await Reserva.create({
            _id: new mongoose.Types.ObjectId(),
            tipo: reserva.Tipo,
            statusReserva: reserva.Status.toLowerCase()
        });
    }
});

Given('Existe uma reserva de ID {string} com tipo {string} e status {string}', async function (id, tipo, status) {
    const reserva = await Reserva.findById( id );
    expect(reserva).to.not.be.null;
    expect(reserva.statusReserva).to.equal(status.toLowerCase());
});


When('Eu faço uma requisição GET para o endpoint {string}', async function (endpoint) {
    this.response = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${this.token}`);
});

When('Eu faço uma requisição GET para o endpoint "/verificarreservas/status?status={string}"', async function (status) {
    this.response = await request(app)
        .get('/status?status=${status}')
        .set('Authorization', `Bearer ${this.token}`);
});

When('Eu faço uma requisição PUT para o endpoint {string} com o corpo:', async function (endpoint, body) {
    this.response = await request(app)
        .put(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(JSON.parse(body));
});


Then('Eu recebo uma resposta com status {int} OK', async function (codStatus) {
    expect(this.response.status).to.equal(codStatus);
});

//listagem de todas as reservas
Then('O corpo da resposta contém uma lista de todas as reservas com status {string}, {string} e {string}:', async function (status1, status2, status3, docString) {
    const responseBody = JSON.parse(docString);
    const reservas = responseBody.reservas;
    expect(reservas).to.be.an('array').that.is.not.empty;
    const statusEsperados = [status1.toLowerCase(), status2.toLowerCase(), status3.toLowerCase()];
    reservas.forEach(reserva => {
      expect(statusEsperados).to.include(reserva.statusReserva.toLowerCase());
    });
});
  
//confirmar/cancelar reserva
Then('Uma requisição GET para o endpoint {string} retorna o status da reserva como {string}', async function (endpoint, statusEsperado) {
    const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.statusReserva).to.equal(statusEsperado.toLowerCase());
});

//filtragem das reservas pendentes
Then('O corpo da resposta contém uma lista de todas as reservas com status {string}', function (statusFiltro) {
    const reservas = this.response.body.data;
    expect(reservas).to.be.an('array').that.is.not.empty;
    reservas.forEach(reserva => {
        expect(reserva.statusReserva).to.equal(statusFiltro.toLowerCase());
    });
});
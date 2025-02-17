const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const { expect } = require('chai');
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
            identificador: reserva.Identificador,
            tipo: reserva.Tipo,
            statusReserva: reserva.Status.toLowerCase()
        });
    }
});

Given('Existe uma reserva com identificador {string} e status {string}', async function (identificador, status) {
    const reserva = await Reserva.findOne({ identificador });
    expect(reserva).to.not.be.null;
    expect(reserva.statusReserva).to.equal(status.toLowerCase());
});

When('Eu faço uma requisição GET para o endpoint "/reservas"', async function () {
    response = await request(app)
        .get('/reservas')
        .set('Authorization', `Bearer ${token}`);
});

When('Eu faço uma requisição GET para o endpoint "/reservas?status=Pendente"', async function () {
    response = await request(app)
        .get('/reservas?status=Pendente')
        .set('Authorization', `Bearer ${token}`);
});

When('Eu faço uma requisição PUT para o endpoint \\/reservas\\/{string} com o corpo:', async function (identificador, docString) {
    const body = JSON.parse(docString);
    response = await request(app)
        .put(`/reservas/${identificador}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
});

Then('Eu recebo uma resposta com status {int} OK', function (statusCode) {
    expect(response.status).to.equal(statusCode);
});
//listagem de todas as reservas
Then('O corpo da resposta contém uma lista de todas as reservas com status "Confirmada", "Cancelada" e "Pendente"', function () {
    const reservas = response.body;
    expect(reservas).to.be.an('array').that.is.not.empty;
    reservas.forEach(reserva => {
        expect(['confirmada', 'cancelada', 'pendente']).to.include(reserva.statusReserva);
    });
});
//filtragem das reservas pendentes
Then('O corpo da resposta contém uma lista de todas as reservas com status "Pendente"', function () {
    const reservas = response.body;
    expect(reservas).to.be.an('array').that.is.not.empty;
    reservas.forEach(reserva => {
        expect(reserva.statusReserva).to.equal('pendente');
    });
});
//confirmar/cancelar reserva
Then('Uma requisição GET para o endpoint \\/reservas\\/{string} retorna o status da reserva como {string}', async function (identificador, statusEsperado) {
    const res = await request(app)
        .get(`/reservas/${identificador}`)
        .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.statusReserva).to.equal(statusEsperado.toLowerCase());
});

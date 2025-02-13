const mongoose = require('mongoose');
const { Given, When, Then, Before, After } = require("cucumber");
const request = require("supertest");
const { app } = require("../../src/server");
const { connectDB, disconnectDB } = require("../../src/database");

let RoomID;
let response;
let server;

// Hooks para gerenciar a conexão do banco
Before(async () => {
  await connectDB(process.env.MONGODB_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal

  await mongoose.connection.db.dropCollection("rooms");
});


After(async () => {
  await server.close();
  await disconnectDB();
});

// Funções para cadastrar salas
Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (identificador, localizacao, capacidade) {
    try{
        const resBusca = await request(server).get(`/salas?identificador=${identificador}`);
        if (resBusca.status === 200 && resBusca.body.length > 0) {
            const sala = resBusca.body[0];

            if(sala.capacidade != Number(capacidade)){
                throw new Error(
                    `Capacidade não coincide. Esperado:${capacidade}, recebeu:${sala.capacidade}`
                )
            }
            if(sala.localizacao != localizacao){
                throw new Error(
                    `Localização não coincide. Esperado:${localizacao}, recebeu:${sala.localizacao}`
                )
            }
            
            return true;
        }
        throw new Error(
            `Sala com id:${identificador} não cadastrada`
        )
    }
    catch(error){
        console.log(error.message);
    }
});

Given('sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (identificador, localizacao, capacidade) {
    try{
        const resBusca = await request(server).get(`/salas?identificador=${identificador}`);
        if (resBusca.status === 200 && resBusca.body.length > 0) {
            const sala = resBusca.body[0];
            throw new Error(
                `Sala com id:${identificador} cadastrada`
            )
            
        }
        return true;
    }
    catch(error){
        console.log(error.message);
    }
});

When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (method, endpoint, docString) {
    const body = JSON.parse(docString); 

    this.response = await request(server)[method.toLowerCase()](endpoint).send(body);
});


When('envio uma requisição {string} para o endpoint {string}', async function (method, endpoint) {
    this.response = await request(server)[method.toLowerCase()](endpoint);
});


Then('o serviço responde com status {string}', async function (status) {
    const expectedStatus = Number(status); 

    if (this.response.status !== expectedStatus) {
        throw new Error(`Esperado status ${expectedStatus}, mas recebido ${this.response.status}`);
    }
});


Then('o corpo da resposta contém:', async function (docString) {
    const expectedBody = JSON.parse(docString); 
    const actualBody = this.response.body; 
   
    if (JSON.stringify(expectedBody) !== JSON.stringify(actualBody)) {
        throw new Error(`Esperado corpo ${JSON.stringify(expectedBody)}, mas recebido ${JSON.stringify(actualBody)}`);
    }
});


// Funções para edição de salas
Given('a sala com identificador {string} e localização {string} e capacidade {string} já está cadastrada no sistema', async function (identificador, localizacao, capacidade) {
    try{
        const resBusca = await request(server).get(`/salas?identificador=${identificador}`);
        if (resBusca.status === 200 && resBusca.body.length > 0) {
            const sala = resBusca.body[0];

            if(sala.capacidade != Number(capacidade)){
                throw new Error(
                    `Capacidade não coincide. Esperado:${capacidade}, recebeu:${sala.capacidade}`
                )
            }
            if(sala.localizacao != localizacao){
                throw new Error(
                    `Localização não coincide. Esperado:${localizacao}, recebeu:${sala.localizacao}`
                )
            }
            return true;
        }
        throw new Error(
            `Sala com id:${identificador} não cadastrada`
        )
    }
    catch(error){
        console.log(error.message);
    }
});

When('o administrador envia uma requisição PUT para {string} para tentar criar uma sala com identificador {string}, localização {string} e capacidade {string}', async function (endpoint, identificador, localizacao, capacidade) {
    const sala = {
        identificador,
        predio: localizacao, 
        capacidade: Number(capacidade) 
    };

    const res = await request(server)
        .put(endpoint)
        .send(sala);

    this.respostaPut=res;
});

Then('a requisição não é aceita, pois o valor fornecido para {string} não é {string}', async function (campo, tipo) {
    
    if (!this.respostaPut) {
        throw new Error("Nenhuma requisição PUT foi realizada antes deste passo.");
    }

    if (this.respostaPut.status !== 400) {
        throw new Error(`Esperado status 400, mas recebido ${this.respostaPut.status}`);
    }

    const mensagemErro = this.respostaPut.body.message || JSON.stringify(this.respostaPut.body);
    
    if (!mensagemErro.includes(campo) || !mensagemErro.includes(tipo)) {
        throw new Error(`A mensagem de erro esperada deveria mencionar que o campo '${campo}' não é do tipo '${tipo}', mas foi recebida: ${mensagemErro}`);
    }
});
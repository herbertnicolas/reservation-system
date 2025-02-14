// const mongoose = require("mongoose");
// const { Given, When, Then, Before, After } = require("cucumber");
// const request = require("supertest");
// const { app } = require("../../src/server");
// const { connectDB, disconnectDB } = require("../../src/database");
// const EquipSala = require("../../src/models/EquipSala");
// const Equipamento = require("../../src/models/Equipamento");
// const Sala = require("../../src/models/Salas");

// let equipSalaId;
// let response;
// let server;

// // Hooks para gerenciar a conexão do banco
// Before(async () => {
//   await connectDB(process.env.MONGODB_URI);
//   server = app.listen(4001); // Porta diferente do ambiente normal

//   await mongoose.connection.db.dropCollection("equipamentos");
// });

// After(async () => {
//   await server.close();
//   await disconnectDB();
// });
// Given(
//   "que existe um equipamento com o nome {string} cadastrado e disponível para reserva no dia {string}",
//   async function (equipamentoNome, data) {
//     const equipamento = new Equipamento({ nome: equipamentoNome });
//     await equipamento.save();

//     const sala = new Sala({
//       identificador: "Sala1",
//       predio: "Prédio A",
//       capacidade: 10,
//     });
//     await sala.save();

//     const equipSala = new EquipSala({
//       salaId: sala._id,
//       equipamentoId: equipamento._id,
//       quantidade: 1,
//       datasReservas: [],
//     });
//     await equipSala.save();

//     equipSalaId = equipSala._id;
//   }
// );

// When(
//   "eu seleciono o equipamento de nome {string} e escolho a data {string} para a reserva",
//   async function (equipamentoNome, data) {
//     response = await request(server).post("/reservas").send({
//       tipo: "equipamento",
//       equipSalaId: equipSalaId,
//       dataReserva: data,
//     });
//   }
// );

// Then(
//   "o equipamento {string} deve ter solicitação de reserva para o dia {string}",
//   async function (equipamentoNome, data) {
//     const equipSala = await EquipSala.findById(equipSalaId);
//     if (!equipSala.datasReservas.includes(data)) {
//       throw new Error(`Data ${data} não encontrada nas reservas`);
//     }
//   }
// );

// Then("uma confirmação de solicitação de reserva deve ser exibida", function () {
//   if (response.status !== 201 || !response.body.msg.includes("sucesso")) {
//     throw new Error("Confirmação não exibida");
//   }
// });

// Given(
//   "que existe um equipamento com o nome {string} cadastrado e já reservado para o dia {string}",
//   async function (equipamentoNome, data) {
//     const equipamento = new Equipamento({ nome: equipamentoNome });
//     await equipamento.save();

//     const sala = new Sala({
//       identificador: "Sala1",
//       predio: "Prédio A",
//       capacidade: 10,
//     });
//     await sala.save();

//     const equipSala = new EquipSala({
//       salaId: sala._id,
//       equipamentoId: equipamento._id,
//       quantidade: 1,
//       datasReservas: [data],
//     });
//     await equipSala.save();

//     equipSalaId = equipSala._id;
//   }
// );

// When(
//   "eu tento reservar o equipamento {string} para a data {string}",
//   async function (equipamentoNome, data) {
//     response = await request(server).post("/reservas").send({
//       tipo: "equipamento",
//       equipSalaId: equipSalaId,
//       dataReserva: data,
//     });
//   }
// );

// Then("a solicitação de reserva não deve ser concluída", function () {
//   if (response.status < 400 || response.status >= 500) {
//     throw new Error(`Resposta inesperada: ${response.status}`);
//   }
// });

// Then("uma mensagem de {string} deve ser exibida", function (mensagem) {
//   if (!response.body.msg.includes(mensagem)) {
//     throw new Error(`Mensagem "${mensagem}" não encontrada`);
//   }
// });

// Given(
//   "que existe um equipamento com o nome {string} cadastrado e disponível para reserva",
//   async function (equipamentoNome) {
//     const equipamento = new Equipamento({ nome: equipamentoNome });
//     await equipamento.save();

//     const sala = new Sala({
//       identificador: "Sala1",
//       predio: "Prédio A",
//       capacidade: 10,
//     });
//     await sala.save();

//     const equipSala = new EquipSala({
//       salaId: sala._id,
//       equipamentoId: equipamento._id,
//       quantidade: 1,
//       datasReservas: [],
//     });
//     await equipSala.save();

//     equipSalaId = equipSala._id;
//   }
// );

// When(
//   "eu tento reservar o equipamento {string} sem escolher uma data",
//   async function (equipamentoNome) {
//     response = await request(server).post("/reservas").send({
//       tipo: "equipamento",
//       equipSalaId: equipSalaId,
//     });
//   }
// );

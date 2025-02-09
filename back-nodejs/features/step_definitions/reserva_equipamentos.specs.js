const mongoose = require('mongoose');
const { Given, When, Then, Before, After } = require("cucumber");
const request = require("supertest");
const { app } = require("../../src/server");
const { connectDB, disconnectDB } = require("../../src/database");

let equipamentoId;
let response;
let server;

// Hooks para gerenciar a conexão do banco
Before(async () => {
  await connectDB(process.env.MONGODB_URI);
  server = app.listen(4000); // Porta diferente do ambiente normal

  await mongoose.connection.db.dropCollection("equipamentos");
});


After(async () => {
  await server.close();
  await disconnectDB();
});
Given(
  "que existe um equipamento {string} com ID {string} cadastrado e disponível para reserva no dia {string}",
  async function (equipamento, id, data) {
    try {
      const response = await request(server).post("/equipamentos").send({
        nome: equipamento,
        disponibilidade: [data],
      });

      console.log("response:", response.body);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Falha ao buscar equipamento");
      }

      if (response.body.data.nome !== equipamento) {
        throw new Error(
          `Nome do equipamento não coincide. Esperado: ${equipamento}, Recebido: ${response.body.data.nome}`
        );
      }

      if (response.body.data.datasReservas.includes(data)) {
        throw new Error(`Equipamento já reservado para a data ${data}`);
      }
    } catch (err) {
      // Falha o teste explicitamente
      throw new Error(`Erro no passo Given: ${err.message}`);
    }
  }
);

When(
  "eu seleciono o equipamento {string} com ID {string} e escolho a data {string} para a reserva",
  async function (equipamento, id, data) {
    response = await request(server)
      .put(`/equipamentos/${id}`)
      .send({ datasReservas: data });

    if (response.status === 400) {
      throw new Error("Equipamento indisponível para esta data");
    }
  }
);

Then(
  "o equipamento {string} com ID {string} deve ser marcado como reservado para {string}",
  async function (equipamento, id, data) {
    const res = await request(server).get(`/equipamentos/${id}`);
    const equipamentoReservado = res.body.data;
    if (!equipamentoReservado.datasReservas.includes(data)) {
      throw new Error(`Equipamento não reservado para a data ${data}`);
    }
    return true;
  }
);

Then("uma confirmação de reserva deve ser exibida", function () {
  return response.body.msg === "Equipamento reservado com sucesso";
});

Given(
  "que existe um equipamento {string} com ID {string} cadastrado e já reservado para o dia {string}",
  async function (equipamento, id, data) {
    const res = await request(server).get(`/equipamentos/${id}`);

    const checkEquipamento = res.body.data;

    if (checkEquipamento.datasReservas.includes(data)) {
      //satisfaz o gherkin
      return true;
    } else {
      return false;
    }
  }
);

When(
  "eu tento reservar o equipamento {string} com ID {string} para a data {string}",
  async function (equipamento, id, data) {
    response = await request(server)
      .put(`/equipamentos/${id}`)
      .send({ datasReservas: data });
  }
);

Then("a reserva não deve ser concluída", function () {
  return response.status === 400;
});

Then("uma mensagem de {string} deve ser exibida", function (mensagem) {
  return response.body.msg === mensagem;
});

Given(
  "que existe um equipamento {string} com ID {string} cadastrado e disponível para reserva",
  async function (equipamento, id) {
    const response = await request(server).get(`/equipamentos/${id}`);

    //talvez validar se disponibilidade == true
    console.log("response:", response.body);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Falha ao buscar equipamento");
    }

    if (!data) {
      throw new Error("Selecione uma data válida");
    }

    return res.status === 201;
  }
);

When(
  "eu tento reservar o equipamento {string} com ID {string} sem escolher uma data",
  async function (equipamento, id) {
    response = await request(server)
      .put(`/equipamentos/${id}`)
      .send({});

    if (response.status !== 400) {
      throw new Error(`Esperado status 400, mas recebeu ${response.status}`);
    }

    const mensagemEsperada = "Selecione uma data válida";
    if (!response.body.message.includes(mensagemEsperada)) {
      throw new Error(`Esperado mensagem "${mensagemEsperada}", mas recebeu "${response.body.message}"`);
    }

    return true;
  }
);
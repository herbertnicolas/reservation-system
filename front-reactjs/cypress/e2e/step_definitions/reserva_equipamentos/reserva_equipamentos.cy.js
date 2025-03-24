const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

// Background steps
Given("que o usuário está na página inicial", function () {
  cy.visit(`http://localhost:5173`);
});

When("seleciona a opção Alunos", function () {
  cy.get("#card-alunos").click();
});

When(
  "seleciona a opção Equipamentos para reservar um equipamento",
  function () {
    cy.get("#card-res-equipamentos").click();
  }
);

Then(
  "o usuário deve ser redirecionado para a página de reserva de equipamento {string}",
  function (endpoint) {
    cy.url().should("include", endpoint);
  }
);

// Given("o usuário está na página de reserva de equipamentos", () => {
//   cy.visit("/reservar-sala");
//   cy.url().should("include", "/reservar-sala");
// });

// Visualizar tabela
Then("o usuário deve ver uma tabela com equipamentos disponíveis", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length.greaterThan", 0);
});

Then("a tabela deve conter colunas com informações dos equipamentos", () => {
  cy.get("table th").should("contain", "SALA ALOCADO");
  cy.get("table th").should("contain", "NOME EQUIPAMENTO");
  cy.get("table th").should("contain", "QUANTIDADE");
});

// Reservar equipamento
When("o usuário seleciona o botão {string} de um equipamento", (buttonText) => {
  // Clica no primeiro botão "Reservar" encontrado
  cy.get("tbody tr").first().find("button").contains(buttonText).click();
});

When("o usuário seleciona o dia {string} do mês atual", (day) => {
  // Simular uma resposta de sucesso para a reserva
  cy.intercept("POST", "http://localhost:3001/reservas", {
    statusCode: 200,
    body: { msg: "Solicitação de reserva realizada com sucesso" },
  }).as("reservaSucesso");

  // Seletor para encontrar o botão do dia no calendário
  // O calendário da biblioteca normalmente renderiza os dias como botões
  cy.get('[role="dialog"] [role="grid"] button')
    .filter(`:not([disabled])`)
    .contains(new RegExp(`^${day}$`))
    .click();

  // Logs para depuração
  cy.log(`Selecionado o dia ${day} do mês atual`);
});

When("o usuário seleciona novamente o dia {string} do mês atual", (day) => {
  // Seletor para encontrar o botão do dia no calendário
  // O calendário da biblioteca normalmente renderiza os dias como botões
  cy.get('[role="dialog"] [role="grid"] button')
    .filter(`:not([disabled])`)
    .contains(new RegExp(`^${day}$`))
    .click();

  // Logs para depuração
  cy.log(`Selecionado o dia ${day} do mês atual`);

  // Simular uma resposta de sucesso para a reserva
  cy.intercept("POST", "http://localhost:3001/reservas", {
    statusCode: 400,
    body: { msg: "Reserva indisponível para esta data" },
  }).as("reservaFalha");
});

Then("um calendário deve ser exibido", () => {
  cy.get("[role='dialog']").should("be.visible");
  cy.get(".rounded-md.border").should("be.visible"); // Calendário
});

When("o usuário seleciona uma data disponível", () => {
  // Seleciona uma data não desabilitada
  cy.get("[role='dialog'] button:not([disabled])").first().click();
});

When("o usuário seleciona uma data já reservada", () => {
  // Simular data reservada (intercept API para retornar erro)
  cy.intercept("POST", "http://localhost:3001/reservas", {
    statusCode: 400,
    body: { msg: "Reserva indisponível para esta data" },
  }).as("reservaFalha");

  // Selecionar qualquer data (o intercept simulará o erro)
  cy.get("[role='dialog'] button:not([disabled])").first().click();
});

When("seleciona o botão {string}", (buttonText) => {
  cy.get("[role='dialog'] button").contains(buttonText).click();
});

Then("uma mensagem de {string} deve ser exibida", (mensagem) => {
  if (mensagem === "Solicitação de reserva enviada com sucesso") {
    cy.get(".Toastify__toast--success").should("be.visible");
    cy.get(".Toastify__toast--success").should("contain", mensagem);
  } else {
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".Toastify__toast--error").should("contain", mensagem);
  }
});

Then("uma mensagem de erro {string} deve ser exibida", (mensagem) => {
  cy.get('.Toastify__toast--error')
  .should('be.visible')
  .and('contain.text', mensagem);
});

When("fecha o toast de confirmação", () => {
  // Localiza e clica no botão de fechar do toast de sucesso
  cy.get(".Toastify__toast--success .Toastify__close-button")
    .should("be.visible")
    .click();
  
  // Garante que o toast foi removido do DOM
  cy.get(".Toastify__toast--success").should("not.exist");
});


Then("o modal deve ser fechado", () => {
  cy.get("[role='dialog']").should("not.exist");
});

Then("o usuário deve retornar para a tabela de equipamentos", () => {
  cy.get("table").should("be.visible");
  cy.get("[role='dialog']").should("not.exist");
});

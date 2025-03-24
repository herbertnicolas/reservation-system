const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

// Background steps
Given("que o usuário está na página inicial", function () {
  cy.visit(`http://localhost:5173`);
});

When("seleciona a opção Alunos", function () {
  cy.get("#card-alunos").click();
});

When("seleciona a opção Salas para reservar uma sala", function () {
  cy.get("#card-res-salas").click();
});

When("o usuário seleciona o dia {string} do mês atual", (day) => {
  // Simular uma resposta de sucesso para a reserva
  cy.intercept("POST", "http://localhost:3001/reservas", {
    statusCode: 200,
    body: { msg: "Reserva realizada com sucesso" }
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

When("seleciona o botão {string}", (button) => {
  cy.get("button").contains(button).click();
});

Then("o usuário deve ser redirecionado para a página de reserva de sala {string}", function (endpoint) {
  cy.url().should("include", endpoint);
});

// Given("o usuário está na página de reserva de salas", () => {
//   cy.visit("/reservar-sala");
//   cy.url().should("include", "/reservar-sala");
// });

// Visualizar tabela
Then("o usuário deve ver uma tabela com salas disponíveis", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length.greaterThan", 0);
});

Then("a tabela deve conter colunas com informações das salas", () => {
  cy.get("table th").should("contain", "IDENTIFICADOR");
  cy.get("table th").should("contain", "LOCALIZACAO");
  cy.get("table th").should("contain", "CAPACIDADE");
});

// Reservar sala
When("o usuário seleciona o botão {string} de uma sala", (buttonText) => {
  // Clica no primeiro botão "Reservar" encontrado
  cy.get("tbody tr").first().find("button").contains(buttonText).click();
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
    body: { msg: "Esta sala já está reservada para esta data" }
  }).as("reservaFalha");
  
  // Selecionar qualquer data (o intercept simulará o erro)
  cy.get("[role='dialog'] button:not([disabled])").first().click();
});

When("o usuário seleciona a data futura ", (date) => {
  // Simular data reservada (intercept API para retornar erro)
  cy.intercept("POST", "http://localhost:3001/reservas", {
    statusCode: 400,
    body: { msg: "Esta sala já está reservada para esta data" }
  }).as("reservaFalha");
  
  // Selecionar qualquer data (o intercept simulará o erro)
  cy.get("[role='dialog'] button:not([disabled])").first().click();
});

When("seleciona o botão {string}", (buttonText) => {
  cy.get("[role='dialog'] button").contains(buttonText).click();
});

Then("uma mensagem de sucesso deve ser exibida", () => {
  cy.get(".Toastify__toast--success").should("be.visible");
  cy.get(".Toastify__toast--success").should("contain", "Solicitação de reserva enviada com sucesso");
});

Then("uma mensagem de erro deve ser exibida", () => {
  cy.get(".Toastify__toast--error").should("be.visible");
});

Then("o modal deve ser fechado", () => {
  cy.get("[role='dialog']").should("not.exist");
});

Then("o usuário deve retornar para a tabela de salas", () => {
  cy.get("table").should("be.visible");
  cy.get("[role='dialog']").should("not.exist");
});
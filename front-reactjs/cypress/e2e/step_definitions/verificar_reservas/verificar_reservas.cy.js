const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

const reservasMock = require("C:/Users/rroca/reservation-system/front-reactjs/cypress/fixtures/reservas.json");

// backgroung
Given("o usuário está na página inicial", () => {
  cy.intercept("GET", "http://localhost:3001/verificarreservas", {
    statusCode: 200,
    body: reservasMock,
  }).as("listarReservas");

  cy.visit(`http://localhost:5173`);
});

When("seleciona a opção Administrador", () => {
  cy.get("#card-administrador").click();
});

When("seleciona a opção Verificar reservas para editar as resevas já criadas", () => {
  cy.get("#card-verificar-reservas").click();
});

Then("o usuário é redirecionado para a página de gestão de reservas {string}", (endpoint) => {
  cy.url().should("include", endpoint);
});

// visualizar tabela de reservas
Then("o usuário vê uma tabela com as reservas", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length", reservasMock.length);
});

Then("a tabela contém colunas com as informações das reservas", () => {
  cy.get("table th").should("contain", "Identificador");
  cy.get("table th").should("contain", "Tipo");
  cy.get("table th").should("contain", "Status");
  cy.get("table th").should("contain", "Editar");
});

// confirmar ou cancelar reserva
When("o usuário seleciona o botão {string} de uma reserva", (buttonText) => {
  cy.get("tbody tr").first().find("button").contains(buttonText).click();
});

Then("o modal de edição de status de reserva é exibido", () => {
  cy.get('[role="dialog"]').should('be.visible');
});

When("o usuário clica no botão {string}", (buttonText) => {
    cy.intercept("PUT", "http://localhost:3001/verificarreservas/*", (req) => {
      const status = req.body.statusReserva;
      req.reply({
        statusCode: 200,
        body:{
          msg: `Status da reserva atualizado para '${status.toUpperCase()}'.`,
          data: {}
        },
      });
    }). as("updateReservationStatus");

    cy.contains("button", buttonText).click();
    cy.wait("@updateReservationStatus", {timeout: 10000});
});

Then("uma mensagem de sucesso deve ser exibida", () => {
  cy.get(".Toastify__toast--success", {timeout:1000}).should("be.visible");
  cy.get(".Toastify__toast--success").should("contain", "Status da reserva atualizado para");
});

Then("o usuário deve retornar para a tabela de reservas", () => {
  cy.get("table").should("be.visible");
  cy.get('[role="dialog"]').should("not.exist");
});

// filtragem de reservas por status
When("o usuário seleciona o botão {string}", (buttonText) => {
  cy.contains("button", buttonText).click();
});

When("o modal de filtragem de reservas por status é exibido", () => {
  cy.get('[role="dialog"]').should('be.visible');
});

When("o usuário seleciona o status {string}", (status) => {
  cy.get('[role="dialog"] select').select(status);
});

When("o usuário pressiona o botão {string}", (buttonText) => {
  cy.get('[role="dialog"] select').then(($select) => {

    const status = $select.val();
    const reservasFiltradas = reservasMock.filter((reserva) => reserva.statusReserva===status);

    cy.intercept("GET", `http://localhost:3001/verificarreservas/status?status=${status}`, {
      statusCode: 200,
      body: reservasFiltradas,
    }).as("filterReservations");

    cy.contains("button", buttonText).click();
    cy.wait("@filterReservations", {timeout: 10000});
  });
});

Then("a tabela de reservas exibe somente reservas com o status {string}", (status) => {
  const reservasFiltradas = reservasMock.filter((reserva)=>reserva.statusReserva===status);

  cy.get("table tbody tr").should("have.length", reservasFiltradas.length);
  cy.get("table tbody tr").each(($row, index) => {
    cy.wrap($row).within(() => {
      cy.get("td").eq(2).should("contain", status);
    });
  });

  cy.get('[role="dialog"]').should("not.exist");
});

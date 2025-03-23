import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor/steps";

// backgroung
Given("o usuário está na página inicial", () => {
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

// tabela de reservas
Then("o usuário vê uma tabela com as reservas", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").then(($rows) => {
    if ($rows.length > 0) {
      cy.wrap($rows).should("have.length.greaterThan", 0);
    } else {
      cy.get("tbody").should("contain", "Nenhuma reserva encontrada.");
    }
  });
});

Then("a tabela contém colunas com as informações das reservas", () => {
  cy.get("table th").should("contain", "Identificador");
  cy.get("table th").should("contain", "Tipo");
  cy.get("table th").should("contain", "Status");
});

// confirmar ou cancelar reservas
When("o usuário seleciona o botão {string} de uma reserva", (buttonText) => {
  cy.get("tbody tr").first().find("button").contains(buttonText).click();
});

Then("o modal de edição de status de reserva é exibido", () => {
  cy.get('[role="dialog"]').should('be.visible');
});

When("o usuário clica no botão {string}", (buttonText) => {
    cy.contains("button", buttonText).click();
});

Then("uma mensagem de sucesso deve ser exibida", () => {
    cy.get(".Toastify__toast--success").should("be.visible");
    cy.get(".Toastify__toast--success").should("contain", "Status da reserva atualizado com sucesso!");
  });

Then("o usuário deve retornar para a tabela de reservas", () => {
  cy.get("table").should("be.visible");
  cy.get("[role='dialog']").should("not.exist");
});

//filtragem
When("o modal de filtragem de reservas por status é exibido", () => {
  cy.get('[role="dialog"]').should('be.visible');
});

When("o usuário seleciona o status {string}", (status) => {
  cy.get('[role="dialog"] select').select(status);
});

When("o usuário clica no botão {string}", (buttonText) => {
  cy.get('[role="dialog"]').contains(buttonText).click();
});

Then("a tabela de reservas exibe somente reservas com o status {string}", (status) => {
  cy.get("table tbody tr").each(($row) => {
    cy.wrap($row).within(() => {
      cy.get('td').eq(2).should('contain', status);
    });
  });
  cy.get('[role="dialog"]').should("not.exist");
});

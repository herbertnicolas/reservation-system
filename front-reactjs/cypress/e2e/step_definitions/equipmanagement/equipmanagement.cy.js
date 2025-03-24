const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");
const API_URL = 'http://localhost:3001'; 

const formatDate = (date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
};

Given("que eu estou na página de Gestão de Equipamentos", () => {
    cy.intercept('GET', `${API_URL}/equipsala*`).as('getEquipamentos');
    cy.visit(`http://localhost:5173/equipamento-gestao`);
    cy.wait('@getEquipamentos');
});

Given("a sala {string} não possui equipamentos cadastrados", (sala) => {
    cy.wait('@getEquipamentos');

    cy.get('input[placeholder="Inserir valor do parâmetro de busca..."]')
    .click()
    .type(sala);
    
    cy.get('table tbody tr:first')
      .should('contain', 'Nenhum resultado encontrado.');

});

Given("os seguintes equipamentos estão cadastrados:", (dataTable) => {
    cy.wait('@getEquipamentos');
    dataTable.hashes().forEach((row) => {
        cy.get('table').should('contain', row.Sala)
          .and('contain', row.Equipamento)
          .and('contain', row.Quantidade);
    });
});

Given("o equipamento {string} da sala {string} possui uma reserva ativa", (equipamento, sala) => {
  // Get equipSala ID first
  cy.request('GET', `${API_URL}/equipsala`)
      .then((response) => {
          const equipSala = response.body.data.find(
              es => es.equipamento.nome === equipamento && es.sala.identificador === sala
          );
          // Create reservation for the equipment
          cy.request('POST', `${API_URL}/reservas`, {
              tipo:'equipamento',
              salaId: equipSala.sala._id,
              equipamentoId: equipSala.equipamento._id,
              status: 'pendente',
              dataReserva: formatDate(new Date())
          });
      });
});

When("eu seleciono {string}", (option) => {
    cy.contains(option).click();
});

When("eu adiciono o equipamento {string} para a sala {string} com quantidade {string}", 
  (equipamento, sala, quantidade) => {
    //cy.intercept('POST', `${API_URL}/equipsala*`).as('addEquipamento');
    
    // Select room
    cy.get('.gap-5 > :nth-child(1) > .flex').click();
    cy.contains(sala).click();

    // Type equipment in Input box then deselect it
    cy.get('.gap-5 > :nth-child(2) > .flex').click();
    cy.get('.mb-2 > .flex').click().type(equipamento).as('insEquip');
    cy.get('@insEquip').type('{esc}');

    // Add amount
    cy.get('.gap-5 > :nth-child(3) > .flex').click().type(quantidade);
});

When("eu adiciono o equipamento existente {string} para a sala {string} com quantidade {string}", 
  (equipamento, sala, quantidade) => {
    // Select room
    cy.get('.gap-5 > :nth-child(1) > .flex').click();
    cy.contains(sala).click();

    // Select existing equipment from dropdown
    cy.get('.gap-5 > :nth-child(2) > .flex').click();
    cy.get('[role="option"]').contains(equipamento).click();

    // Add amount
    cy.get('.gap-5 > :nth-child(3) > .flex').click().type(quantidade);
});


When("eu adiciono o equipamento {string} para a sala {string} sem quantidade", 
    (equipamento, sala) => {
      // Select room
      cy.get('.gap-5 > :nth-child(1) > .flex').click();
      cy.contains(sala).click();
      
      // Type equipment in Input box then deselect it
      cy.get('.gap-5 > :nth-child(2) > .flex').click();
      cy.get('.mb-2 > .flex').click().type(equipamento).as('insEquip');
      cy.get('@insEquip').type('{esc}');
});

When("eu seleciono a opção de editar do equipamento {string} da sala {string}", 
    (equipamento, sala) => {

    cy.get(`tr:contains("${sala}"):contains("${equipamento}")`)
    .find('button[aria-haspopup="menu"]')
    .click();

    cy.get('[role="menu"]')
    .contains('[role="menuitem"]', 'Editar')
    .click();
});

When("eu altero a quantidade para {string}", (quantidade) => {
    cy.get('.gap-5 > :nth-child(2) > .flex').clear().type(quantidade);
});

When("eu seleciono a opção de remover do equipamento {string} da sala {string}", 
  (equipamento, sala) => {

    // Find row and click dropdown menu button
    cy.get(`tr:contains("${sala}"):contains("${equipamento}")`)
    .find('button[aria-haspopup="menu"]')
    .click();

    // Click remove option in dropdown
    cy.get('[role="menu"]')
    .contains('[role="menuitem"]','Excluir')
    .click();
});

When("eu confirmo a remoção selecionando {string}", 
  (option) => {

    cy.get('div[role="dialog"]')
      .should('be.visible')
      .should('contain', 'Deseja realmente remover este equipamento da sala?')
      .within(() => {
        cy.contains(option).click();
    });
});

When("eu seleciono a opção de ordenar por salas", () => {
  cy.get('th').contains('Sala').click();
});

Then("o sistema aceita a operação retornando a mensagem {string}", (msg) => {
    cy.get('.Toastify__toast--success', { timeout: 10000 }).should('contain', msg);
});

Then("o sistema rejeita a operação retornando a mensagem {string}", (msg) => { 
    cy.get('.Toastify__toast--error', { timeout: 10000 }).should('contain', msg);
});

Then("eu sou redirecionado para a página de Gestão de Equipamentos", () => {
    cy.wait('@getEquipamentos');
    cy.url().should('include', 'equipamento-gestao');
});

Then("eu permaneço na página de Gestão de Equipamentos", () => {
    cy.url().should('include', 'equipamento-gestao');
});

Then("eu permaneço na página de Cadastro de Equipamentos", () => {
    cy.url().should('include', 'equipamento-cadastro');
});

Then("eu posso ver o equipamento {string} da sala {string} com quantidade {string}", 
  (equipamento, sala, quantidade) => {
    cy.wait('@getEquipamentos');
    cy.get('table', { timeout: 10000 }).within(() => {
      cy.get(`tr:contains("${sala}"):contains("${equipamento}")`)
        .should('contain', quantidade);
    });
});

Then("o equipamento {string} não aparece na lista da sala {string}", 
    (equipamento, sala) => {
      cy.get('input[placeholder="Inserir valor do parâmetro de busca..."]')
      .click()
      .type(sala);
        
      cy.get('table tbody tr:first')
        .should('not.contain', equipamento);
});

Then("eu vejo os equipamentos seguindo a ordem salas", () => {

  cy.get('tbody tr td:first-child').then($cells => {
      const salas = [...$cells].map(cell => cell.textContent);
      const sortedSalas = [...salas].sort();

      salas.forEach((sala, index) => {
            cy.wrap(sala).should('eq', sortedSalas[index]);
      });
  });
});


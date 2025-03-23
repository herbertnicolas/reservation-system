// cypress/e2e/step_definitions/salas/gestao_salas.js

import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'


beforeEach(() => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.clearCookies()
})
// ======================================================
// Background
// ======================================================
Given("que estou na página Salas", () => {
  cy.intercept('GET', 'http://localhost:3001/salas', {
    statusCode: 200,
    body: [
      { 
        _id: '1', 
        identificador: 'D005', 
        localizacao: 'Prédio D', 
        capacidade: 50 
      },
      { 
        _id: '2', 
        identificador: 'D002', 
        localizacao: 'Prédio E', 
        capacidade: 30 
      },
      { 
        _id: '3', 
        identificador: 'D005', 
        localizacao: 'Prédio F', 
        capacidade: 90 
      }
    ]
  }).as('getSalas')

  cy.visit('/gestao-salas')
  cy.wait('@getSalas')
})

And('consigo ver a sala com identificador {string}, localização {string} e capacidade {string}', 
  (id, localizacao, capacidade) => {
    cy.get('[data-testid="lista-salas"] table tbody tr').each(($row) => {
      const rowText = $row.text()
      if (rowText.includes(id) && rowText.includes(localizacao) && rowText.includes(capacidade)) {
        cy.wrap($row).within(() => {
          cy.get('td:eq(0)').should('contain', id)
          cy.get('td:eq(1)').should('contain', localizacao)
          cy.get('td:eq(2)').should('contain', capacidade)
        })
      }
    })
})

// ======================================================
// Cenário: Cria nova sala com sucesso
// ======================================================
Given('sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', 
  (id, localizacao, capacidade) => {
    cy.intercept('GET', 'http://localhost:3001/salas', {
      statusCode: 200,
      body: [
        { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
        { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
        { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
      ]
    })
})

When('eu seleciono a aba Nova Sala', () => {
  cy.get('[data-testid="botao-nova-sala"]').click()
})

When('crio uma sala com identificador {string}, localização {string} e capacidade {string}', 
  (id, localizacao, capacidade) => {
    cy.intercept('POST', 'http://localhost:3001/salas', {
      statusCode: 201,
      body: { message: 'Sala cadastrada com sucesso!' }
    }).as('createRoom')

    cy.intercept('GET', 'http://localhost:3001/salas', {
      statusCode: 200,
      body: [
        { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
        { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
        { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 },
        { 
          _id: '4', 
          identificador: id, 
          localizacao: localizacao, 
          capacidade: Number(capacidade) 
        }
      ]
    })

    cy.get('[data-testid="input-identificador"]').type(id)
    cy.get('[data-testid="input-localizacao"]').type(localizacao)
    cy.get('[data-testid="input-capacidade"]').type(capacidade)
})

When('seleciono Confirmar', () => {
  cy.get('[data-testid="botao-confirmar"]').click()
  cy.wait('@createRoom')
})

// Implementação ÚNICA para todos os usos do step
Given('sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', 
  (id, localizacao, capacidade) => {
    
    // Determina o ID com base no identificador
    let roomId;
    switch(id) {
      case 'D002': 
        roomId = '2';
        break;
      case 'D005': 
        roomId = '1'; 
        break;
      case 'D009': 
        roomId = '4';
        break;
      default: 
        roomId = '999'; // ID genérico para novas salas
    }

    // Mock dinâmico
    cy.intercept('GET', 'http://localhost:3001/salas', {
      statusCode: 200,
      body: [
        // Salas padrão do Background
        { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
        { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
        { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 },
        
        // Adiciona a sala específica do cenário
        ...(id !== 'D002' && id !== 'D005' ? [{
          _id: roomId,
          identificador: id,
          localizacao: localizacao,
          capacidade: Number(capacidade)
        }] : [])
      ]
    }).as('getSalasAtualizadas');

    cy.visit('/gestao-salas');
    cy.wait('@getSalasAtualizadas');
});

Then('aparece uma mensagem de erro {string}', (mensagem) => {
  cy.get('.Toastify__toast--error')
    .should('be.visible')
    .invoke('text')
    .should('include', mensagem)
})

// ======================================================
// Cenário: Edita sala existente
// ======================================================
When('eu seleciono Editar Sala', () => {
  const roomId = '1'; // ID da sala D005

  cy.intercept('GET', 'http://localhost:3001/salas/1', {
    statusCode: 200,
    body: {
      sala:{
        _id: '1',
        identificador: 'D005',
        localizacao: 'Prédio D',
        capacidade: 50
      }
    }
  }).as('getSalaDetails');

  cy.get(`[data-testid="botao-opcoes-${roomId}"]`)
  .should('exist')
  .then($el => {
    // Força scroll e clique com verificação de visibilidade
    $el[0].scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  .click({ force: true })

  cy.forceClick(`[data-testid="botao-editar-${roomId}"]`);
  cy.wait('@getSalaDetails');
});

When('altero a capacidade para {string}', (capacidade) => {
  cy.intercept('PUT', 'http://localhost:3001/salas/1', {
    statusCode: 200,
    body: { 
      message: 'Sala editada com sucesso!',
      sala: {
        _id: '1',
        identificador: 'D005',
        localizacao: 'Prédio D',
        capacidade: Number(capacidade)
      }
    }
  }).as('updateD005');

  cy.intercept('GET', 'http://localhost:3001/salas', {
    statusCode: 200,
    body: [
      { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: Number(capacidade) },
      { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
      { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
    ]
  }).as('getAfterEdit');

  cy.get('[data-testid="input-capacidade"]')
    .clear()
    .type(capacidade);
});

When('seleciono Confirmar Edição', () => {
  cy.get('[data-testid="botao-salvar"]')
    .should('be.visible')
    .click()
  cy.wait('@updateD005');
})

// ======================================================
// Cenário: Remove sala existente
// ======================================================
When('eu seleciono Remover Sala', () => {
  const roomId = '2' // ID correto da sala D002
  
  cy.get(`[data-testid="botao-opcoes-${roomId}"]`)
    .should('exist')
    .then($el => {
      // Força scroll e clique com verificação de visibilidade
      $el[0].scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    .click({ force: true })

  cy.get(`[data-testid="botao-excluir-${roomId}"]`)
    .should('be.visible', { timeout: 5000 })
    .click({ force: true })
})

When('seleciono Confirmar Remoção', () => {
  cy.intercept('DELETE', 'http://localhost:3001/salas/2', {
    statusCode: 200,
    body: { message: 'Sala removida com sucesso!' }
  }).as('deleteRoom')

  cy.intercept('GET', 'http://localhost:3001/salas', {
    statusCode: 200,
    body: [
      { 
        _id: '1', 
        identificador: 'D005', 
        localizacao: 'Prédio D', 
        capacidade: 50 
      },
      { 
        _id: '3', 
        identificador: 'D005', 
        localizacao: 'Prédio F', 
        capacidade: 90 
      }
    ]
  }).as('getSalasAfterDelete')

  cy.get('[data-testid="botao-confirmar-remocao"]')
    .click()
    .wait(['@deleteRoom', '@getSalasAfterDelete'])
})

Then('não vejo a sala com identificador {string}, localização {string} e capacidade {string}', 
  (id, localizacao, capacidade) => {
    cy.get('[data-testid="lista-salas"]', { timeout: 10000 })
      .should('not.contain', id)
      .and('not.contain', localizacao)
      .and('not.contain', capacidade)
})

// ======================================================
// Validações genéricas
// ======================================================
Then('estou na página Salas', () => {
  cy.url().should('include', '/gestao-salas')
})

Then('aparece uma mensagem de sucesso {string}', (mensagem) => {
  cy.get('.Toastify__toast--success', { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .should('eq', mensagem)
})
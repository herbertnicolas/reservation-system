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

// ======================================================
// Cenário: Tenta criar sala existente
// ======================================================
Given('sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', 
  (id, localizacao, capacidade) => {
    cy.intercept('POST', 'http://localhost:3001/salas', {
      statusCode: 400,
      body: { 
        erro: `Sala com identificador ${id}, localização ${localizacao} e capacidade ${capacidade} já existe!`
      }
    }).as('createRoomError')

    cy.intercept('GET', 'http://localhost:3001/salas', {
      statusCode: 200,
      body: [
        { 
          _id: '4', 
          identificador: id, 
          localizacao: localizacao, 
          capacidade: Number(capacidade) 
        }
      ]
    })
})

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
  const roomId = '2'; // Use o mesmo ID do mock
  
  // 1. Abre o dropdown
  cy.get(`[data-testid="botao-opcoes-${roomId}"]`).click({ force: true });
  
  // 2. Clica no botão de edição
  cy.get(`[data-testid="botao-editar-${roomId}"]`)
    .click({ force: true });
});

When('altero a capacidade para {string}', (capacidade) => {
  cy.intercept('PUT', 'http://localhost:3001/salas/2', {
    statusCode: 200,
    body: { message: 'Sala atualizada com sucesso!' }
  }).as('updateRoom')

  cy.intercept('GET', 'http://localhost:3001/salas', {
    statusCode: 200,
    body: [
      { 
        _id: '4', 
        identificador: 'D009', 
        localizacao: 'Prédio E', 
        capacidade: 80 
      },
      { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
      { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
      { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
    ]
  })

  cy.get('[data-testid="input-capacidade"]')
    .clear()
    .type(capacidade)
})


When('seleciono Confirmar Edição', () => {
  cy.get('[data-testid="botao-salvar"]').click()
  cy.wait('@updateRoom')
})

// ======================================================
// Cenário: Remove sala existente
// ======================================================
When('eu seleciono Remover Sala', () => {
  const roomId = '4'; // Use o mesmo ID do mock
  
  // 1. Abre o dropdown
  cy.get(`[data-testid="botao-opcoes-${roomId}"]`).click({ force: true });
  
  // 2. Clica no botão de exclusão
  cy.get(`[data-testid="botao-excluir-${roomId}"]`)
    .should('be.visible')
    .click({ force: true });
});

When('seleciono Confirmar Remoção', () => {
  cy.intercept('DELETE', 'http://localhost:3001/salas/4', {
    statusCode: 200,
    body: { message: 'Sala removida com sucesso!' }
  }).as('deleteRoom')

  cy.intercept('GET', 'http://localhost:3001/salas', {
    statusCode: 200,
    body: [
      { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
      { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
      { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
    ]
  })

  cy.get('[data-testid="botao-confirmar-remocao"]')
    .click()
    .wait('@deleteRoom')
    .wait(1000) // Espera para atualização da UI
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
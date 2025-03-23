// cypress/e2e/step_definitions/salas/gestao_salas.js

import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

// Background steps
// Background
Given('que estou na página {string}', () => {
    // Mock da API para retornar salas iniciais
    cy.intercept('GET', 'http://localhost:3001/salas', {
      statusCode: 200,
      body: [
        { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
        { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
        { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
      ]
    }).as('getSalas')
  
    cy.visit('/gestao-salas') // Navega para a página
    cy.wait('@getSalas') // Espera a requisição da API terminar
  })
  
  // Verificação de salas no Background
  And('consigo ver a sala com identificador {string}, localização {string} e capacidade {string}', 
    (identificador, localizacao, capacidade) => {
      cy.get('table') // Seleciona a tabela
        .should('contain', identificador) // Verifica se o identificador existe
        .and('contain', localizacao) // Verifica a localização
        .and('contain', capacidade) // Verifica a capacidade
  })
  
  // Cenário: Cria nova sala com sucesso
  Given('sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', 
    (id, localizacao, capacidade) => {
      // Mock da API para garantir que a sala não existe
      cy.intercept('GET', 'http://localhost:3001/salas', (req) => {
        req.reply({
          statusCode: 200,
          body: [
            { _id: '1', identificador: 'D005', localizacao: 'Prédio D', capacidade: 50 },
            { _id: '2', identificador: 'D002', localizacao: 'Prédio E', capacidade: 30 },
            { _id: '3', identificador: 'D005', localizacao: 'Prédio F', capacidade: 90 }
          ]
        })
      })
  })
  
  When('eu seleciono a aba "Criar Sala"', () => {
    cy.get('[data-testid="botao-nova-sala"]').click() // Clique no botão usando data-testid
  })
  
  When('crio uma sala com identificador {string}, localização {string} e capacidade {string}', 
    (id, localizacao, capacidade) => {
      // Mock da resposta de sucesso da API
      cy.intercept('POST', 'http://localhost:3001/salas', {
        statusCode: 201,
        body: { message: 'Sala criada com sucesso!' }
      }).as('createRoom')
  
      // Preenchimento do formulário
      cy.get('[data-testid="input-identificador"]').type(id)
      cy.get('[data-testid="input-localizacao"]').type(localizacao)
      cy.get('[data-testid="input-capacidade"]').type(capacidade)
  })
  
  When('seleciono "Confirmar"', () => {
    cy.get('[data-testid="botao-confirmar"]').click() // Clique no botão de confirmação
    cy.wait('@createRoom') // Espera a requisição POST terminar
  })
  
  Then('estou na página "Salas"', () => {
    cy.url().should('include', '/gestao-salas') // Verifica a URL
  })
  
  Then('aparece uma mensagem de sucesso {string}', (mensagem) => {
    cy.get('.Toastify__toast--success').should('contain', mensagem) // Verifica a notificação
  })
  
  Then('consigo ver a sala com identificador {string}, localização {string} e capacidade {string}', 
    (id, localizacao, capacidade) => {
      cy.get('[data-testid="lista-salas"]') // Seleciona a tabela
        .should('contain', id)
        .and('contain', localizacao)
        .and('contain', capacidade)
  })
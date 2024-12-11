Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores
  
  I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover)
  So that eu possa gerenciar melhor as salas 
  
  Background:
    Given que estou na página "Salas"
    And estou logado como administrador com login "Rafael" e senha "123456"
    And consigo ver uma lista de todas as salas já cadastradas

  Scenario: Administrador edita uma sala existente
    Given sala com identificador "D009" e localização "Prédio E" está cadastrada
    When eu seleciono a aba "Editar Sala"
    And altero a capacidade para "80"
    And clico em "Salvar Edição"
    Then estou na página "Salas"
    And vejo uma mensagem de sucesso "Sala editada com sucesso!"
    And consigo ver as salas cadastradas previamente
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "80"

  Scenario: Administrador tenta editar uma sala não existente
    Given sala com identificador "D009" e localização "Prédio E" não está cadastrada
    When eu seleciono a aba "Editar Sala"
    And altero a capacidade para "80"
    And clico em "Salvar Edição"
    Then estou na página "Salas"
    And vejo uma mensagem de erro "Sala com identificador ‘D009’ e localização ‘Prédio E’ não existe!’"
    And consigo ver as salas cadastradas previamente
    And não vejo a sala com identificador "D009", localização "Prédio E" e capacidade "80"

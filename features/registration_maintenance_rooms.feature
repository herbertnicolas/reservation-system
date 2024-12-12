Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores
  
  I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover)
  So that eu possa gerenciar melhor as salas 
  
  Background:
    Given que estou na página "Salas"
    And estou logado como administrador com login "Rafael" e senha "123456"
    And consigo ver uma lista de todas as salas já cadastradas

  Scenario: Administrador cria nova sala
    Given sala com identificador "D009" e localização "Prédio E" não está cadastrada
    When eu seleciono a aba "Criar Sala"
    And crio uma sala com identificador "D009", localização "Prédio E" e capacidade "50"
    And clico em "Confirmar Criação"
    Then estou na página "Salas"
    And aparece uma mensagem de sucesso "Sala criada com sucesso!"
    And consigo ver as salas cadastradas previamente
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "50"
  
  Scenario: Administrador tenta criar uma sala já existente
    Given sala com identificador "D009" e localização "Prédio E" está cadastrada
    When eu seleciono a aba "Criar Sala"
    And crio uma sala com identificador "D009", localização "Prédio E" e capacidade "50"
    And clico em "Confirmar Criação"
    Then estou na página "Salas"
    And aparece uma mensagem de erro "Sala com identificador D009 e localização Prédio E já existe!"
    And consigo ver as salas cadastradas previamente
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "50"
  
  Scenario: Administrador edita uma sala existente
    Given sala com identificador "D009" e localização "Prédio E" está cadastrada
    When eu seleciono a aba "Editar Sala"
    And altero a capacidade para "80"
    And clico em "Salvar Edição"
    Then estou na página "Salas"
    And vejo uma mensagem de erro "Sala com identificador ‘D009’ e localização ‘Prédio E’ não existe!’"
    And vejo uma mensagem de erro "Sala com identificador D009 e localização Prédio E não existe!"
    And consigo ver as salas cadastradas previamente
    And não vejo a sala com identificador "D009", localização "Prédio E" e capacidade "80"
  
  Scenario: Administrador remove sala existente
    Given sala com identificador "D009" e localização "Prédio E" está cadastrada
    When eu seleciono a aba "Remover Sala"
    And clico em "Confirmar Remoção"
    Then estou na página "Salas"
    And vejo uma mensagem de sucesso "Sala removida com sucesso!"
    And consigo ver as salas cadastradas previamente
    And não vejo a sala com identificador "D009" e localização "Prédio E"

  Scenario: Administrador tenta remover sala não existente
    Given sala com identificador "D009" e localização "Prédio E" não está cadastrada
    When eu seleciono a aba "Remover Sala"
    And clico em "Confirmar Remoção"
    Then estou na página "Salas"
    And vejo uma mensagem de erro "Sala com identificador D009 e localização Prédio E não existe!"
    And consigo ver as salas cadastradas previamente
    And não vejo a sala com identificador "D009" e localização "Prédio E"

    Scenario: Aleatorio
      Given teste

    Scenario: Aleatorio
      Given teste
    
Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores, GUI

  I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover)
  So that eu possa gerenciar melhor as salas

  Background:
    Given que estou na página Salas
    And consigo ver a sala com identificador "D005", localização "Prédio D" e capacidade "50"
    And consigo ver a sala com identificador "D002", localização "Prédio E" e capacidade "30"
    And consigo ver a sala com identificador "D005", localização "Prédio F" e capacidade "90"

  Scenario: Cria nova sala com sucesso
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
    When eu seleciono a aba Nova Sala
    And crio uma sala com identificador "D009", localização "Prédio E" e capacidade "50"
    And seleciono Confirmar
    Then estou na página Salas
    And aparece uma mensagem de sucesso "Sala cadastrada com sucesso!"
    And consigo ver a sala com identificador "D005", localização "Prédio D" e capacidade "50"
    And consigo ver a sala com identificador "D002", localização "Prédio E" e capacidade "30"
    And consigo ver a sala com identificador "D005", localização "Prédio F" e capacidade "90"
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "50"

  Scenario: tenta criar uma sala já existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When eu seleciono a aba Nova Sala
    And crio uma sala com identificador "D009", localização "Prédio E" e capacidade "50"
    And seleciono Confirmar
    Then estou na página Salas
    And aparece uma mensagem de erro "Sala com identificador D009, localização Prédio E e capacidade 50 já existe!"
    And consigo ver a sala com identificador "D005", localização "Prédio D" e capacidade "50"
    And consigo ver a sala com identificador "D002", localização "Prédio E" e capacidade "30"
    And consigo ver a sala com identificador "D005", localização "Prédio F" e capacidade "90"
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "50"

  Scenario: edita uma sala existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When eu seleciono Editar Sala
    And altero a capacidade para "80"
    And seleciono Confirmar
    Then estou na página Salas
    And aparece uma mensagem de sucesso "Sala editada com sucesso!"
    And consigo ver a sala com identificador "D005", localização "Prédio D" e capacidade "50"
    And consigo ver a sala com identificador "D002", localização "Prédio E" e capacidade "30"
    And consigo ver a sala com identificador "D005", localização "Prédio F" e capacidade "90"
    And consigo ver a sala com identificador "D009", localização "Prédio E" e capacidade "80"

  Scenario: Administrador remove sala existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When eu seleciono Remover Sala
    And seleciono Confirmar Remoção
    Then estou na página Salas
    And vejo uma mensagem de sucesso "Sala removida com sucesso!"
    And consigo ver a sala com identificador "D005", localização "Prédio D" e capacidade "50"
    And consigo ver a sala com identificador "D002", localização "Prédio E" e capacidade "30"
    And consigo ver a sala com identificador "D005", localização "Prédio F" e capacidade "90"
    And não vejo a sala com identificador "D009", localização "Prédio E" e capacidade "50"

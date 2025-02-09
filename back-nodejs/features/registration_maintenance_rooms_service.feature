Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores, serviço

  I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover)
  So that eu possa gerenciar melhor as salas 

    Background:
      Given a sala com identificador "D005", localização "Prédio D" e capacidade "50" está cadastrada
      And a sala com identificador "D002", localização "Prédio E" e capacidade "30" está cadastrada
      And a sala com identificador "D005", localização "Prédio F" e capacidade "90" está cadastrada

    Scenario: Administrador cria nova sala
      Given sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
      When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
        """
        {
          "identificador": "D009",
          "localizacao": "Prédio E",
          "capacidade": 50
        }
        """
      Then o serviço responde com status "201 Created"
      And o corpo da resposta contém:
        """
        {
          "mensagem": "Sala criada com sucesso!",
          "sala": {
            "identificador": "D009",
            "localizacao": "Prédio E",
            "capacidade": 50
          }
        }
        """
    Scenario: Administrador tenta criar uma sala já existente
      Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
      When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
        """
        {
          "identificador": "D009",
          "localizacao": "Prédio E",
          "capacidade": 50
        }
        """
      Then o serviço responde com status "400 Bad Request"
      And o corpo da resposta contém:
        """
        {
          "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 já existe!"
        }
        """

  Scenario: Administrador edita uma sala existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
      """
      {
        "capacidade": 80
      }
      """
    Then o serviço responde com status "200 OK"
    And o corpo da resposta contém:
      """
      {
        "mensagem": "Sala editada com sucesso!",
        "sala": {
          "identificador": "D009",
          "localizacao": "Prédio E",
          "capacidade": 80
        }
      }
      """

  Scenario: Administrador edita uma sala não existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
    When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
      """
      {
        "capacidade": 80
      }
      """
    Then o serviço responde com status "404 Not Found"
    And o corpo da resposta contém:
      """
      {
        "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 não existe!"
      }
      """

  Scenario: Administrador remove sala existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When envio uma requisição "DELETE" para o endpoint "/salas/D009"
    Then o serviço responde com status "200 OK"
    And o corpo da resposta contém:
      """
      {
        "mensagem": "Sala removida com sucesso!"
      }
      """

  Scenario: Administrador tenta remover sala não existente
    Given sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
    When envio uma requisição "DELETE" para o endpoint "/salas/D009"
    Then o serviço responde com status "404 Not Found"
    And o corpo da resposta contém:
      """
      {
        "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 não existe!"
      }
      """

  Scenario: Falha em criar nova sala por invalidação
    Given existe um administrador cadastrado no sistema com login "Rafael" e senha "123456"
    When o administrador envia uma requisição POST para "/salas" para tentar criar uma sala com identificador "D009", localização "Prédio E" e capacidade "cinquenta"
    Then a requisição não é aceita, pois o valor fornecido para "capacidade" não é numérico
    And o sistema retorna o status "400"
    And a mensagem de erro no corpo da resposta é "Capacidade deve ser um número!"

  Scenario: Falha em editar sala por invalidação
    Given existe um administrador cadastrado no sistema com login "Rafael" e senha "123456"
    And a sala com identificador "D009" e localização "Prédio E" e capacidade "50" já está cadastrada no sistema
    When o administrador envia uma requisição PUT para "/salas" para tentar criar uma sala com identificador "D009", localização "Prédio E" e capacidade "oitenta"
    Then a requisição não é aceita, pois o valor fornecido para "capacidade" não é "numérico"
    And o sistema retorna o status "400"
    And a mensagem de erro no corpo da resposta é "Capacidade deve ser um número!"

Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores, serviço

  I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover)
  So that eu possa gerenciar melhor as salas 

  Background:
    Given as seguintes salas estão cadastradas:
      | identificador | localização | capacidade |
      | D005          | Prédio D    | 50         |
      | D002          | Prédio E    | 30         |
      | D005          | Prédio F    | 90         |

  Scenario: Criar nova sala com sucesso
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
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

  Scenario: Tentar criar uma sala já existente
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
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

  Scenario: Falha ao criar sala com identificador inválido (número)
    Given a sala com identificador "123", localização "Prédio E" e capacidade "50" não está cadastrada
    When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
      """
      {
        "identificador": 123,
        "localizacao": "Prédio E",
        "capacidade": 50
      }
      """
    Then o serviço responde com status "400 Bad Request"
    And o corpo da resposta contém:
      """
      {
        "erro": "Identificador deve ser uma string!"
      }
      """

  Scenario: Editar uma sala existente com sucesso
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
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

  Scenario: Tentar editar uma sala não existente
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
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

  Scenario: Falha ao editar sala com capacidade inválida (string)
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
      """
      {
        "capacidade": "oitenta"
      }
      """
    Then o serviço responde com status "400 Bad Request"
    And o corpo da resposta contém:
      """
      {
        "erro": "Capacidade deve ser um número!"
      }
      """

  Scenario: Remover sala existente com sucesso
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
    When envio uma requisição "DELETE" para o endpoint "/salas/D009"
    Then o serviço responde com status "200 OK"
    And o corpo da resposta contém:
      """
      {
        "mensagem": "Sala removida com sucesso!"
      }
      """

  Scenario: Tentar remover sala não existente
    Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
    When envio uma requisição "DELETE" para o endpoint "/salas/D009"
    Then o serviço responde com status "404 Not Found"
    And o corpo da resposta contém:
      """
      {
        "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 não existe!"
      }
      """
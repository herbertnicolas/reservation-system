Feature: Verificação de Reservas

  Background: Reservas já cadastradas
    Given Existem as seguintes reservas cadastradas:
      | ID                       | Tipo        | Status     |
      | 507f1f77bcf86cd799439012 | sala        | pendente   |
      | 507f1f77bcf86cd799439013 | sala        | confirmada |
      | 507f1f77bcf86cd799439014 | equipamento | cancelada  |
      | 507f1f77bcf86cd799439015 | equipamento | pendente   |


#funcionando
  Scenario: Visualizar todas as reservas
    When Eu faço uma requisição GET para o endpoint "/verificarreservas"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "confirmada", "cancelada" e "pendente":
    """
    {
      "reservas": [
        { "statusReserva": "pendente", "tipo": "sala" },
        { "statusReserva": "confirmada", "tipo": "sala" },
        { "statusReserva": "cancelada", "tipo": "equipamento" },
        { "statusReserva": "pendente", "tipo": "equipamento" }
      ]
    }
    """

  Scenario: Confirmar reserva
    When Eu faço uma requisição PUT para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" com o corpo:
      """
      {
        "statusReserva": "confirmada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" retorna o status da reserva como "confirmada"

  Scenario: Cancelar reserva
    When Eu faço uma requisição PUT para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" com o corpo:
      """
      {
        "statusReserva": "cancelada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" retorna o status da reserva como "cancelada"

  #funcionando
  Scenario: Visualizar somente reservas Pendentes
    When Eu faço uma requisição GET para o endpoint "/verificarreservas/status?status=pendente"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "pendente"


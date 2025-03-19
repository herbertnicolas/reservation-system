Feature: Verificação de Reservas

  Background: Reservas já cadastradas
    Given Existem as seguintes reservas cadastradas:
      | ID                       | Tipo        | Status     |
      | 507f1f77bcf86cd799439012 | sala        | Pendente   |
      | 507f1f77bcf86cd799439013 | sala        | Confirmada |
      | 507f1f77bcf86cd799439014 | equipamento | Cancelada  |
      | 507f1f77bcf86cd799439015 | equipamento | Pendente   |


  Scenario: Visualizar todas as reservas
    When Eu faço uma requisição GET para o endpoint "/verificarreservas"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "Confirmada", "Cancelada" e "Pendente":
    """
    {
      "reservas": [
        { "statusReserva": "Pendente", "tipo": "sala" },
        { "statusReserva": "Confirmada", "tipo": "sala" },
        { "statusReserva": "Cancelada", "tipo": "equipamento" },
        { "statusReserva": "Pendente", "tipo": "equipamento" }
      ]
    }
    """

  Scenario: Confirmar reserva
    When Eu faço uma requisição PUT para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" com o corpo:
      """
      {
        "statusReserva": "Confirmada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/reservas/507f1f77bcf86cd799439012" retorna o status da reserva como "Confirmada"

  Scenario: Cancelar reserva
    When Eu faço uma requisição PUT para o endpoint "/verificarreservas/507f1f77bcf86cd799439012" com o corpo:
      """
      {
        "statusReserva": "Cancelada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/reservas/507f1f77bcf86cd799439012" retorna o status da reserva como "Cancelada"

  Scenario: Visualizar somente reservas Pendentes
    When Eu faço uma requisição GET para o endpoint "/verificarreservas/status?status=Pendente"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "Pendente"


Feature: Verificação de Reservas

  Background: Reservas já cadastradas
    Given Existem as seguintes reservas cadastradas:
      | Identificador | Tipo        | Status     |
      | RE1001        | sala        | Pendente   |
      | RE1002        | sala        | Confirmada |
      | RE1003        | equipamento | Cancelada  |
      | RE1004        | equipamento | Pendente   |

  Scenario: Visualizar todas as reservas
    When Eu faço uma requisição GET para o endpoint "/reservas"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "Confirmada", "Cancelada" e "Pendente"

  Scenario: Confirmar reserva
    When Eu faço uma requisição PUT para o endpoint "/reservas/RE1001" com o corpo:
      """
      {
        "statusReserva": "Confirmada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/reservas/RE1001" retorna o status da reserva como "Confirmada"

  Scenario: Cancelar reserva
    When Eu faço uma requisição PUT para o endpoint "/reservas/RE1001" com o corpo:
      """
      {
        "statusReserva": "Cancelada"
      }
      """
    Then Eu recebo uma resposta com status 200 OK
    And Uma requisição GET para o endpoint "/reservas/RE1001" retorna o status da reserva como "Cancelada"

  Scenario: Visualizar somente reservas Pendentes
    When Eu faço uma requisição GET para o endpoint "/reservas?status=Pendente"
    Then Eu recebo uma resposta com status 200 OK
    And O corpo da resposta contém uma lista de todas as reservas com status "Pendente"

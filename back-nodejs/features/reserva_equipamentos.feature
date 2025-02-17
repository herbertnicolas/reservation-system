Feature: Gerenciamento de Reservas (solicitação) - Serviço

              Eu como Usuário
     Quero solicitar, visualizar e gerenciar reservas de salas/equipamentos
     Para garantir o uso adequado dos recursos disponíveis

        Background:
            Given as seguintes salas cadastradas:
                  | tipo | identificador | localização | capacidade |
                  | sala | D005          | Prédio D    | 50         |

              And os seguintes equipamentos cadastrados:
                  | nome        |
                  | Microscópio |


              And as seguintes reservas existem:
                  | tipo        | dataReserva | identificador | equipamentoId            |
                  | sala        | 20/05/2024  | D005          | 67b28c7a988ebb5f9240df2f |
                  | equipamento | 20/05/2024  | D005          | 67b28c7a988ebb5f9240df2f |

        Scenario: Buscar reserva inexistente
             When envio uma request "GET" para o endpoint "/reservas/67b29e02df2d2d1fac2fa9a4"
             Then recebo a response com status "404 Not Found"
              And o corpo da resposta possui:
                  """
                  {
                       "msg": "Reserva não encontrado"
                  }
                  """

     # ------------------- CRIAR RESERVA -------------------
        Scenario: Criar reserva de sala com sucesso
             When envio uma request "POST" para o endpoint "/reservas" com os atributos tipo "sala", dataReserva "25/05/2024" salaId e equipamentoId existentes no banco
             Then recebo a response com status "201 Created"
             Then o corpo da resposta contém a mensagem "Reserva de sala criada com sucesso"

        Scenario: Criar reserva de equipamento com sucesso
             When envio uma request "POST" para o endpoint "/reservas" com os atributos tipo "equipamento", dataReserva "25/05/2024" salaId e equipamentoId existentes no banco
             Then recebo a response com status "201 Created"
              And o corpo da resposta contém a mensagem "Reserva de equipamento criada com sucesso"

        Scenario: Falha ao criar reserva sem dados obrigatórios
             When envio uma request "POST" para o endpoint "/reservas" com o corpo:
                  """
                  {
                       "dataReserva": "25/05/2024"
                  }
                  """
             Then recebo a response com status "400 Bad Request"
              And o corpo da resposta contém a mensagem "Selecione uma data válida"

     # ------------------- ATUALIZAR RESERVA -------------------
        Scenario: Atualizar data da reserva com sucesso
            Dado uma reserva existente para "25/05/2024"
             When envio uma request "PUT" para o endpoint "/reservas/{reservaId}" com o corpo:
                  """
                  {
                       "dataReserva": "28/02/2024"
                  }
                  """
             Then recebo a response com status "200 OK"
              And o corpo da resposta contém a mensagem "Reserva atualizada com sucesso"

        Scenario: Tentar atualizar equipamento para data reservada
             When envio uma request "PUT" para o endpoint "/reservas/{reservaId}" com o corpo:
                  """
                  {
                       "dataReserva": "20/05/2024"
                  }
                  """
             Then recebo a response com status "500 Internal Server Error"
              And o corpo da resposta contém a mensagem "já está reservada"

     # ------------------- REMOVER RESERVA -------------------

        Scenario: Tentar remover reserva inexistente
             When envio uma request "DELETE" para o endpoint "/reservas/507f1f77bcf86cd799439011"
             Then recebo a response com status "404 Not Found"
              And o corpo da resposta possui:
                  """
                  {
                       "msg": "Reserva não encontrada"
                  }
                  """
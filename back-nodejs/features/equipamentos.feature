Feature: Gerenciamento de Equipamentos (listar, buscar e criar) - Serviço

              Eu como Administrador
  Quero gerenciar equipamentos (listar, buscar por ID e criar)
  Para manter o controle dos recursos disponíveis para reserva

        Background:
            Given os seguintes equipamentos estão cadastrados:
                  | nome         |
                  | Projetor 4K  |
                  | Notebook i7  |
                  | Mesa Digital |

        Scenario: Listar todos os equipamentos com sucesso
             When envio uma requisição do tipo "GET" para o endpoint "/equipamentos"
             Then o response deve ter status "200 OK"
              And o body da resposta deve ser uma lista com 3 equipamentos
              And cada equipamento possui os campos "_id", "nome" e "datasReservas"

        Scenario: Buscar equipamento existente por ID
            Given o equipamento "Projetor 4K" está cadastrado
             When envio uma requisição do tipo "GET" para o endpoint "/equipamentos/{_id}"
             Then o response deve ter status "200 OK"
              And o body da resposta deve ser os dados do "Projetor 4K"

        Scenario: Buscar equipamento por ID inexistente
             When envio uma requisição do tipo "GET" para o endpoint "/equipamentos/507f1f77bcf86cd799439011"
             Then o response deve ter status "404 Not Found"
              And o body da resposta deve ser:
                  """
                  {
                    "msg": "Equipamento não encontrado"
                  }
                  """

        Scenario: Criar novo equipamento com sucesso
             When envio uma requisição do tipo "POST" para o endpoint "/equipamentos" com o corpo:
                  """
                  {
                    "nome": "Microfone Sem Fio"
                  }
                  """
             Then o response deve ter status "201 Created"
              And o body da resposta deve conter:
                  """
                  {
                    "data": {
                      "_id": "<any>",
                      "__v": "<any>",
                      "datasReservas": [],
                      "nome": "Microfone Sem Fio"
                    },
                    "msg": "Equipamento criado com sucesso"
                  }
                  """

        Scenario: Tentar criar equipamento sem nome
             When envio uma requisição do tipo "POST" para o endpoint "/equipamentos" com o corpo:
                  """
                  {}
                  """
             Then o response deve ter status "500 Internal Server Error"
              And o body da resposta deve ser a mensagem "Erro ao criar equipamento"

Feature: Cadastro e manutenção de salas (criar, editar e remover), do componente Administradores, serviço

              I as a Administrador
  Want to realizar o Cadastro e manutenção de salas (criar, editar e remover) So that eu possa gerenciar melhor as salas 

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

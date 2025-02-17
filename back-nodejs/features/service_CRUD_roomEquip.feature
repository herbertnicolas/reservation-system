Feature: Adicionar, editar e remover recurso ou equipamento de sala 
  As Administrador
  I Want to realizar registros e manutenção de recursos de salas
  So that eu possa gerenciar equipamentos de salas de forma eficiente

  Scenario: Adicionar recurso não cadastrado no sistema
    Given a sala com nome "E112" está cadastrada
    When o administrador faz uma requisição POST do recurso "Microfone" à sala "E112" com quantidade "10"
    Then o sistema registra o recurso "Microfone" na sala "E112" com quantidade "10"
    And o recurso "Microfone" é adicionado à base de dados de recursos disponíveis
    And o sistema retorna a mensagem "Equipamento adicionado à sala com sucesso" com status "201"

  Scenario: Remover recurso de uma sala
    Given o sistema tem salas com os seguintes recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    When o administrador faz uma requisição DELETE para o recurso "Computador" da sala "E104"
    Then o sistema retorna a mensagem "Equipamento removido da sala com sucesso" com status "200"
    And o sistema remove o recurso "Computador" dos recursos associados à sala "E104"
    And o recurso "Computador" permanece na base de dados geral para associações futuras

  Scenario: Registrar erro ao adicionar recurso sem quantidade
    Given o recurso com nome "Projetor" não está cadastrado
    And a sala com nome "D003" está cadastrada
    When o administrador faz uma requisição POST do recurso "Projetor" à sala "D003" sem informar a quantidade
    And o sistema retorna a mensagem "Quantidade deve ser um número inteiro maior que zero" com status "400"
    And não adiciona "Projetor" à sala "D003"

  Scenario: Tentar remover recurso de uma sala com reservas associadas
    Given o sistema tem salas com os seguintes recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
    And a sala "E232" tem uma reserva ativa para o recurso "Projetor"
    When o administrador faz uma requisição DELETE para o recurso "Projetor" da sala "E232"
    Then o sistema retorna a mensagem "Não foi possível remover: Equipamento com reservas ativas" com status "400"

  Scenario: Rejeitar associação de recurso a uma sala inexistente
    Given o sistema tem salas com os seguintes recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
    When o administrador faz uma requisição POST do recurso "Cadeiras" à sala "D999" com quantidade "10"
    Then o sistema retorna a mensagem "ID(s) fornecido(s) inválido(s)" com status "400"

  Scenario: Consultar recursos associados a uma sala
    Given o sistema tem salas com os seguintes recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    When o administrador faz uma requisição GET para a sala "E104"
    Then o sistema retorna a lista de recursos da sala:
      | Recurso    | Quantidade |
      | Computador | 5          |
      | Projetor   | 1          |
    And o sistema retorna a mensagem "Equipamentos listados com sucesso" com status "200"

  # Scenario: Editar a quantidade de recursos de uma sala
  #   Given o sistema tem salas com os seguintes recursos cadastrados:
  #     | Sala | Recurso    | Quantidade |
  #     | E104 | Computador | 5          |
  #     | E104 | Projetor   | 1          |
  #   When o administrador faz uma requisição PUT para atualizar a quantidade do recurso "Computador" na sala "E104" para "10"
  #   Then o sistema retorna a mensagem "Equipamento atualizado com sucesso" com status "200"
  #   And o sistema registra o recurso "Computador" com quantidade "10" na sala "E104"

  # Scenario: Editar quantidade de recursos de uma sala com algum parametro vazio
  #   Given o sistema tem salas com os seguintes recursos cadastrados:
  #     | Sala | Recurso    | Quantidade |
  #     | E104 | Computador | 5          |
  #     | E104 | Projetor   | 1          |
  #   When o administrador faz uma requisição PUT para atualizar a quantidade do recurso "Computador" na sala "E104" sem informar a quantidade
  #   Then o sistema retorna a mensagem "Quantidade deve ser um número inteiro maior que zero" com status "400"
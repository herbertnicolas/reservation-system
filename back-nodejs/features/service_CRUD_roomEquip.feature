Feature: Adicionar, editar e remover recurso ou equipamento de sala 
  As Administrador
  I Want to realizar registros e manutenção de recursos de salas
  So that eu possa gerenciar equipamentos de salas de forma eficiente


  Scenario: Adicionar recurso não cadastrado no sistema
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    And a sala com identificador "E112" está cadastrada
    When o administrador tenta associar o recurso "Microfone" à sala "E112" com quantidade "10"
    Then o sistema registra o recurso "Microfone" com quantidade "10" na sala "E112"
    And o recurso "Microfone" é adicionado à base de dados de recursos disponíveis
    And o sistema retorna a mensagem "Equipamento adicionado à sala com sucesso" com status "201"

  Scenario: Remover recurso de uma sala
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    When o administrador tenta remover o recurso "Computador" da sala "E104"
    Then o sistema retorna a mensagem "Equipamento removido da sala com sucesso" com status "200"
    And o sistema remove o recurso "Computador" da lista de recursos associados à sala "E104"
    And o recurso "Computador" permanece na base de dados geral para associações futuras

  Scenario: Registrar erro ao adicionar recurso sem quantidade
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    And a sala com identificador "D003" está cadastrada
    When o administrador tenta associar o recurso "Projetor" à sala "D003" sem informar a quantidade
    And o sistema retorna a mensagem "Quantidade deve ser um número inteiro maior que zero" com status "400"
    And não adiciona "Projetor" à sala "D003"

  Scenario: Tentar remover recurso de uma sala com reservas associadas
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    And a sala "E232" tem uma reserva ativa para o recurso "Projetor"
    When o administrador tenta remover o recurso "Projetor" da sala "E232"
    Then o sistema retorna a mensagem "Não foi possível remover: Equipamento com reservas ativas" com status "400"

  Scenario: Rejeitar associação de recurso a uma sala inexistente
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          | 
    When o administrador tenta associar o recurso "Cadeiras" à sala "D999" com quantidade "10"
    Then o sistema retorna a mensagem "ID(s) fornecido(s) inválido(s)" com status "400"

  Scenario: Consultar recursos associados a uma sala
    Given o sistema tem as seguintes salas e recursos cadastrados:
      | Sala | Recurso    | Quantidade |
      | E232 | Projetor   | 2          |
      | D005 | Cadeiras   | 20         |
      | E104 | Computador | 5          |
      | E104 | Projetor   | 1          |
    When o administrador tenta consultar os recursos da sala "E104"
    Then o sistema retorna a mensagem "Equipamentos listados com sucesso" com status "200"
    And o sistema retorna a lista de recursos da sala "E104":
      | Recurso    | Quantidade |
      | Computador | 5          |
      | Projetor   | 1          |

  # Scenario: Editar a quantidade de recursos de uma sala 

  # Scenario: Editar quantidade de recursos de uma sala com algum parametro vazio
Background: 
  Given o sistema tem as seguintes salas e recursos cadastrados: 
  ("E232", "Projetor, "2"), ("D005", "Cadeiras", "20"), (" E104", "Computador", "5")

Scenario: Adicionar recurso não cadastrado no sistema
  Given o sistema não tem o recurso "Microfone" cadastrado
  When o administrador associa o recurso "Microfone" à sala "E112" com quantidade "10"
  Then o sistema registra o recurso "Microfone" com quantidade "10" na sala "E112"
  And o recurso "Microfone" é adicionado à base de dados de recursos disponíveis

Scenario: Remover recurso de uma sala
  Given o recurso "Computador" está registrado na sala "E104"
  When o administrador remove o recurso "Computador" da sala "E104"
  Then o sistema remove o recurso "Computador" da lista de recursos associados à sala "E104"
  And o recurso "Computador" permanece na base de dados geral para associações futuras

Scenario: Registrar erro ao adicionar recurso sem quantidade
  Given a sala "D003" está cadastrada no sistema
  When o administrador tenta associar o recurso "Projetor" à sala "D003" sem informar a quantidade
  Then o sistema rejeita a operação
  And não adiciona "Projetor" à sala "D003"

Scenario: Rejeitar associação de recurso a uma sala inexistente
  Given o sistema não tem nenhuma sala cadastrada com o identificador "D999"
  When o administrador tenta associar o recurso "Cadeiras" com quantidade "10" à sala "D999"
  Then o sistema rejeita a operação
  And registra o erro "Sala inexistente"

Scenario: Consultar recursos associados a uma sala
Feature: Adicionar, editar e remover recurso ou equipamento de sala 
  As Administrador
  I Want to realizar registros e manutenção de recursos de salas
  So that eu possa gerenciar equipamentos de salas de forma eficiente

Background: 
  Given o administrador "Luiza" com login "luiza_admin" e senha "senha123" está autenticada
  And as seguintes salas, equipamentos e quantidades estão cadastrados: 
    | Sala    | Recurso     | Quantidade |
    | E233    | Projetor    | 2          |
    | Grad01  | Computador  | 20         |
    | D003    | Cadeira     | 10         |
    | D001    | Impressora  | 1          |

Scenario: Adicionar um novo recurso a uma sala
  Given que eu estou na página "Gerenciar Recursos de Salas"
  When eu seleciono a opção "Adicionar Recurso"
  And eu preencho os campos de sala com "Grad02", equipamento "Computador" com quantidade "5"
  And eu seleciono na opção "Confirmar"
  Then eu vejo uma mensagem de confirmação "Recurso adicionado com sucesso"
  And eu permaneço na página "Gerenciar Recursos de Salas"
  And eu posso ver a sala "Grad02" com o equipamento "Computador" com quantidade "5" na lista atualizada

Scenario: Adicionar um equipamento/recurso não cadastrado na base de dados
  Given o recurso "Microfone" não está registrado na base de dados
  And que eu estou na página "Gerenciar Recursos de Salas"
  When eu seleciono a sala "D003"
  And eu insiro "Microfone" no campo de "Recurso" e "1" em "Quantidade"
  And eu seleciono a opção "Adicionar"
  Then eu vejo uma mensagem de confirmação "Recurso Microfone adicionado com sucesso"
  And eu permaneço na página "Gerenciar Recursos de Salas"
  And eu vejo o recurso "Microfone" com quantidade "1" para a sala "D003"
  And o recurso "Microfone" passa a estar disponível na base de dados para futuras associações

Scenario: Tentar remover um recurso sem especificar uma sala
  Given que eu estou na página "Gerenciar Recursos de Salas"
  When eu seleciono a opção "Remover Recurso"
  And eu insiro o equipamento "Computador"
  And eu seleciono "Remover"
  Then eu vejo uma mensagem de erro "Operação falhou: especifique uma sala."
  And eu permaneço na página "Gerenciar Equipamentos e Recursos" 
  And posso ver que a lista permanece inalterada

Scenario: Editar a quantidade de um recurso existente
  Given que eu estou na página "Gerenciar Recursos de Salas"
  When eu seleciono a sala "Grad01"
  And eu altero o campo "Quantidade" de "Computador" para "15"
  And eu seleciono "Atualizar"
  Then eu vejo uma mensagem de confirmação "Quantidade atualizada com sucesso"
  And eu permaneço na página "Gerenciar Recursos de Salas"
  And eu posso ver a sala "Grad01" exibe o recurso "Computador" com quantidade "15" na lista atualizada

Scenario: Editar um equipamento com campo de quantidade vazio
  Given eu estou na está na página "Gerenciar Recursos de Salas"
  When eu tentar editar os recursos para a sala "E233" 
  And insiro apenas o campo de "Recurso" com "Projetor"
  And seleciono a opção "Atualizar"
  Then o sistema rejeita a operação 
  And registra o erro "O campo Quantidade é obrigatório" 
  And eu posso ver que recurso o "Projetor" mantém a quantidade "2" na sala "E233"
  And eu permaneço na página "Gerenciar Recursos de Salas"
  Then ...

Scenario: Rejeitar associação de recurso a uma sala inexistente 
  Given o sistema não tem nenhuma sala cadastrada com o identificador "D999"
  When o administrador tenta associar o recurso "Cadeiras" com quantidade "10" à sala "D999"
  Then o sistema rejeita a operação

assignment_configManag_q13a_main
a
assignment_configManag_q13a_dev
 
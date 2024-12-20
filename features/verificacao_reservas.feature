Scenario: Visualizar todas reservas 
Given eu estou logado como "Administrador" com o login "Ana" e senha "123aBc"
And estou na página "Inicial"
When eu seleciono "Reservas"
Then eu estou na página "Reservas"
And eu vejo uma lista com todas as reservas com status "Confirmada", "Cancelada", "Pendente"

Background: 
Given eu estou logado como "Administrador" com o login "Ana" e senha "123aBc"
And estou na página "Reservas"

Scenario: Confirmar reserva
Given uma reserva com identificador "RE531" e status "Pendente" na lista de reservas
When eu eu seleciono "Editar Status"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem de sucesso "Status alterado com sucesso!"
And eu estou na página "Reservas"
And o status da reserva "RE531" é "Confirmada"

Scenario: Cancelar reserva
Given uma reserva com identificador "RE531" e status "pendente" na lista de reservas
When eu seleciono "Editar Status"
And eu seleciono "Cancelar"
Then eu vejo uma mensagem de sucesso "Status alterado com sucesso!"
And eu estou na página "Reservas"
And o status da reserva "RE531" é "Cancelada"

Scenario: Editar reserva já feita
Given uma reserva com identificador "RE531" e status "Confirmada" está feita
When eu seleciono "Editar Reserva"
And eu altero o status para "Cancelada"
And eu seleciono "Salvar Alterações"
Then eu estou na página "Reservas"
And eu vejo uma mensagem de sucesso "Reserva alterada com sucesso!"
And eu consigo ver as reservas feitas previamente
And eu consigo ver a sala com identificador "RE531" e status "Cancelada"

Scenario: Editar reserva já feita
Given uma reserva com identificador "RE531" e status "Cancelada" está feita
When eu seleciono "Editar Reserva"
And eu altero o status para "Confirmada"
And eu seleciono "Salvar Alterações"
Then eu estou na página "Reservas"
And eu vejo uma mensagem de sucesso "Reserva alterada com sucesso!"
And eu consigo ver as reservas feitas previamente
And eu consigo ver a sala com identificador "RE531" e status "Confirmada"

Scenario: Visualizar somente reservas pendentes
When eu seleciono "Filtros"
And eu seleciono "Pendente" 
And eu seleciono "Aplicar Filtro"
Then eu estou na página "Reservas"
And eu vejo uma lista de todas as reservas com status "Pendente"

Scenario: Visualizar somente reservas confirmadas
When eu seleciono "Filtros"
And eu seleciono "Confirmada" 
And eu seleciono "Aplicar Filtro"
Then eu estou na página "Reservas"
And eu vejo uma lista de todas as reservas com status "Confirmada"

Scenario: Visualizar somente reservas canceladas
When eu seleciono "Filtros"
And eu seleciono "Cancelada" 
And eu seleciono "Aplicar Filtro"
Then eu estou na página "Reservas"
And eu vejo uma lista de todas as reservas com status "Cancelada"
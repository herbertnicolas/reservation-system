Feature: Verificar Reservas
     Como um administrador logado
     Eu quero poder verificar as reservas
     Para que eu possa modificá-las 

     Background:
          Given o usuário está na página inicial
          When seleciona a opção Administrador
          And seleciona a opção Verificar reservas para editar as resevas já criadas
          Then o usuário é redirecionado para a página de gestão de reservas "/gerenciamento-reservas"

     Scenario: Visualizar tabela de reservas
          Then o usuário vê uma tabela com as reservas
          And a tabela contém colunas com as informações das reservas

     Scenario: Confirmar reserva com sucesso
          When o usuário seleciona o botão "Editar" de uma reserva
          Then o modal de edição de status de reserva é exibido
          When o usuário clica no botão "Confirmar reserva"
          Then uma mensagem de sucesso deve ser exibida
          And o usuário deve retornar para a tabela de reservas

    Scenario: Cancelar reserva com sucesso
          When o usuário seleciona o botão "Editar" de uma reserva
          And o modal de edição de status de reserva é exibido
          And o usuário clica no botão "Cancelar reserva"
          Then uma mensagem de sucesso deve ser exibida
          And o usuário deve retornar para a tabela de reservas
    
    Scenario: Filtrar reservas pendentes
          When o usuário seleciona o botão "Filtrar Reservas"
          And o modal de filtragem de reservas por status é exibido
          And o usuário seleciona o status "Pendente"
          And o usuário clica no botão "Aplicar Filtro"
          Then a tabela de reservas exibe somente reservas com o status "Pendente"

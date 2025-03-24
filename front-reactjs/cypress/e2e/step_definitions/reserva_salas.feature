Feature: Reserva de Salas
     Como um aluno logado
     Eu quero poder reservar uma sala
     Para que eu possa utilizar o espaço em uma data específica

     Background:
          Given que o usuário está na página inicial
          And seleciona a opção Alunos
          And seleciona a opção Salas para reservar uma sala
          Then o usuário deve ser redirecionado para a página de reserva de sala "/reservar-sala"

     Scenario: Visualizar tabela de salas disponíveis
          Then o usuário deve ver uma tabela com salas disponíveis
          And a tabela deve conter colunas com informações das salas

     Scenario: Reservar uma sala com sucesso
          When o usuário seleciona o botão "Reservar" de uma sala
          Then um calendário deve ser exibido
          When o usuário seleciona o dia "24" do mês atual 
          And seleciona o botão "Confirmar"
          Then uma mensagem de sucesso deve ser exibida
          And o usuário deve retornar para a tabela de salas

     Scenario: Cancelar o ato de reserva de uma sala
          When o usuário seleciona o botão "Reservar" de uma sala
          Then um calendário deve ser exibido
          When seleciona o botão "Cancelar"
          Then o modal deve ser fechado
          And o usuário deve retornar para a tabela de salas
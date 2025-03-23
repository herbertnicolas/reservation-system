Feature: Reserva de Equipamentos
     Como um aluno logado
     Eu quero poder reservar um equipamento
     Para que eu possa utilizar o espaço em uma data específica

     Background:
          Given que o usuário está na página inicial
          And seleciona a opção Alunos
          And seleciona a opção Equipamentos para reservar um equipamento
          Then o usuário deve ser redirecionado para a página de reserva de equipamento "/reservar-equipamento"

     Scenario: Visualizar tabela de equipamentos disponíveis
          Then o usuário deve ver uma tabela com equipamentos disponíveis
          And a tabela deve conter colunas com informações dos equipamentos

     Scenario: Solicitar reserva de equipamento com sucesso
          When o usuário seleciona o botão "Reservar" de um equipamento
          Then um calendário deve ser exibido
          When o usuário seleciona o dia "25" do mês atual 
          And seleciona o botão "Confirmar"
          Then uma mensagem de "Solicitação de reserva enviada com sucesso" deve ser exibida
          And o usuário deve retornar para a tabela de equipamentos

     Scenario: Solicitar reserva de equipamento indisponível
          When o usuário seleciona o botão "Reservar" de um equipamento
          Then um calendário deve ser exibido
          And o usuário seleciona novamente o dia "25" do mês atual 
          And seleciona o botão "Confirmar"
          Then uma mensagem de erro "Reserva indisponível para esta data" deve ser exibida

     Scenario: Cancelar o ato de reserva de um equipamento
          When o usuário seleciona o botão "Reservar" de um equipamento
          Then um calendário deve ser exibido
          When seleciona o botão "Cancelar"
          Then o modal deve ser fechado
          And o usuário deve retornar para a tabela de equipamentos
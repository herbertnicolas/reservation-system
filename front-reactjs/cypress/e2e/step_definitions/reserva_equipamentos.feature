Feature: Reserva de Salas
     Como um aluno logado
     Eu quero poder reservar uma sala
     Para que eu possa utilizar o espaço em uma data específica

     Background:
          Given o usuário está na página de reserva de salas

     Scenario: Visualizar tabela de salas disponíveis
          Then o usuário deve ver uma tabela com salas disponíveis
          And a tabela deve conter colunas com informações das salas

     Scenario: Reservar uma sala com sucesso
          When o usuário clica no botão "Reservar" de uma sala
          Then um calendário deve ser exibido
          When o usuário seleciona uma data disponível
          And clica no botão "Confirmar"
          Then uma mensagem de sucesso deve ser exibida
          And o usuário deve retornar para a tabela de salas

     Scenario: Tentar reservar uma sala em data já reservada
          When o usuário clica no botão "Reservar" de uma sala
          Then um calendário deve ser exibido
          When o usuário seleciona uma data já reservada
          And clica no botão "Confirmar"
          Then uma mensagem de erro deve ser exibida

     Scenario: Cancelar a reserva de uma sala
          When o usuário clica no botão "Reservar" de uma sala
          Then um calendário deve ser exibido
          When o usuário clica no botão "Cancelar"
          Then o modal deve ser fechado
          And o usuário deve retornar para a tabela de salas
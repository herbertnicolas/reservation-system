Feature: Reserva de Equipamentos da Sala
              Eu como um aluno
  Quero reservar um equipamento da sala
  Para que eu possa utilizá-lo na data agendada

        Scenario: Reserva bem-sucedida de um equipamento disponível
            # vou precisar mudar para que seja a partir de uma sala especifica
            Given que existe um equipamento com o nome "microscópio" cadastrado e disponível para reserva no dia "01/10/2025"
             When eu seleciono o equipamento de nome "microscópio" e escolho a data "01/10/2025" para a reserva
             Then o equipamento "microscópio" deve ter solicitação de reserva para o dia "01/10/2025"
              And uma confirmação de solicitação de reserva deve ser exibida

        Scenario: Tentativa de reservar um equipamento já reservado
            Given que existe um equipamento com o nome "microscópio" cadastrado e já reservado para o dia "01/10/2025"
             When eu tento reservar o equipamento "microscópio" para a data "01/10/2025"
             Then a solicitação de reserva não deve ser concluída
              And uma mensagem de "Reserva indisponível para esta data" deve ser exibida
              
        Scenario: Tentativa de reservar um equipamento para uma data inválida
            Given que existe um equipamento com o nome "microscópio" cadastrado e disponível para reserva
             When eu tento reservar o equipamento "microscópio" para a data "01/01/2020"
             Then a solicitação de reserva não deve ser concluída
              And uma mensagem de "Selecione uma data válida" deve ser exibida

        Scenario: Tentativa de reserva sem selecionar uma data
            Given que existe um equipamento com o nome "microscópio" cadastrado e disponível para reserva no dia "01/10/2025"
             When eu tento reservar o equipamento "microscópio" sem escolher uma data
             Then a solicitação de reserva não deve ser concluída
              And uma mensagem de "Selecione uma data válida" deve ser exibida
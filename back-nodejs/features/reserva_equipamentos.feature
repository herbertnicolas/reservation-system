Feature: Reserva de Equipamentos da Sala
    Eu como um aluno
    Quero reservar um equipamento da sala
    Para que eu possa utilizá-lo na data agendada

    Scenario: Reserva bem-sucedida de um equipamento disponível
        Given que existe um equipamento "microscópio" com ID "123" cadastrado e disponível para reserva no dia "01/10/2025"
        When eu seleciono o equipamento "microscópio" com ID "123"
        And escolho a data "01/10/2025" para a reserva
        Then o equipamento "microscópio" com ID "123" deve ser marcado como reservado para "01/10/2025"
        And uma confirmação de reserva deve ser exibida

    Scenario: Tentativa de reservar um equipamento já reservado
        Given que existe um equipamento "microscópio" com ID "123" cadastrado e já reservado para o dia "01/10/2025"
        When eu tento reservar o equipamento "microscópio" com ID "123" para a data "01/10/2025"
        Then a reserva não deve ser concluída
        And uma mensagem de "Equipamento indisponível para esta data" deve ser exibida

    Scenario: Tentativa de reservar um equipamento para uma data inválida
        Given que existe um equipamento "microscópio" com ID "123" cadastrado e disponível para reserva
        When eu tento reservar o equipamento "microscópio" com ID "123" para a data "01/01/2020"
        Then a reserva não deve ser concluída
        And uma mensagem de "Selecione uma data válida" deve ser exibida

    Scenario: Tentativa de reserva sem selecionar uma data
        Given que existe um equipamento "microscópio" com ID "123" cadastrado e disponível para reserva
        When eu tento reservar o equipamento "microscópio" com ID "123" sem escolher uma data
        Then a reserva não deve ser concluída
        And uma mensagem de "Selecione uma data válida" deve ser exibida
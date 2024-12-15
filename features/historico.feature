Feature: Histórico de reservas (com filtro), do componente Administradores

    I, as an Administrator,
    Want to acessar o histórico de reservas (com filtros),
    So that eu posso monitorar e analisar o uso das salas.

    Scenario: Visualizar histórico
    
    Given eu estou logado como "Administrador" com o login "Ana" e senha "123aBc"
    And eu estou na página "Inicial"
    When eu clico em "Histórico"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "Histórico completo"


    Scenario: Abrir página de busca

    Given eu estou na página "Histórico"
    When eu clico em "Buscar"
    Then eu estou na página "Busca"
    And eu consigo ver uma lista com "Filtros"

    Scenario: Busca sem filtro

    Given eu estou na página "Busca"
    And nenhum filtro está selecionado
    When eu clico em "Realizar Busca"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "Histórico completo"

    Scenario: Busca com filtro

    Given eu estou na página "Busca"
    When eu seleciono o filtro "Sala"
    And eu preencho com "D003"
    And eu clico em "Realizar Busca"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "histórico filtrado"
    And apenas ocorrências com o atributo "D003" no campo "Sala" aparecem

    Scenario: Busca com mais de um filtro

    Given eu estou na página "Busca"
    When eu seleciono o filtro "Proprietário"
    And eu preencho com "Luiza"
    And eu seleciono o filtro "Hora"
    And eu preencho com "10h-12h"
    And eu clico em "Realizar Busca"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "histórico filtrado"
    And apenas ocorrências com o atributo "Luiza" no campo "Proprietário" aparecem
    And apenas ocorrências com o atributo "10h-12h" no campo "Hora" aparecem

    Scenario: Busca vazia

    Given eu estou na página "Busca"
    And não há ocorrências com o atributo "15/12/2024" no campo "Data"
    When eu seleciono o filtro "Data"
    And eu preencho com "15/12/2024"
    And eu clico em "Realizar Busca"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "histórico filtrado"
    And não há itens na lista

    Scenario: Redefinir filtros

    Given eu estou na página "Histórico"
    And eu consigo ver uma lista com "histórico filtrado"
    When eu clico em "Redefinir filtros"
    Then eu estou na página "Histórico"
    And eu consigo ver uma lista com "histórico completo"

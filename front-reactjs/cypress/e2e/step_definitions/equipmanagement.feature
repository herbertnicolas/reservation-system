Feature: Adicionar, editar e remover equipamentos de sala 
    As um usuário Administrador
    I Want to gerenciar equipamentos das salas
    So that eu possa manter o controle dos recursos disponíveis

    Scenario: Adicionar um novo equipamento a uma sala
        Given que eu estou na página de Gestão de Equipamentos
        And a sala "E233" não possui equipamentos cadastrados
        When eu seleciono "Novo equipamento"
        And eu adiciono o equipamento "Projetor" para a sala "E233" com quantidade "2"
        And eu seleciono "Adicionar Equipamento"
        Then o sistema aceita a operação retornando a mensagem "Equipamento adicionado com sucesso!"
        And eu sou redirecionado para a página de Gestão de Equipamentos
        And eu posso ver o equipamento "Projetor" da sala "E233" com quantidade "2"

    Scenario: Editar quantidade de um equipamento
        Given que eu estou na página de Gestão de Equipamentos
        And os seguintes equipamentos estão cadastrados:
        | Sala    | Equipamento     | Quantidade |
        | Grad01  | Computador      | 20         |
        | D003    | Cadeira         | 30         |
        | E104    | Impressora      | 1          |
        When eu seleciono a opção de editar do equipamento "Computador" da sala "Grad01"
        And eu altero a quantidade para "15"
        And eu seleciono "Salvar Alterações"
        Then o sistema aceita a operação retornando a mensagem "Equipamento atualizado com sucesso!"
        And eu sou redirecionado para a página de Gestão de Equipamentos
        And eu posso ver o equipamento "Computador" da sala "Grad01" com quantidade "15"

    Scenario: Tentar adicionar equipamento sem quantidade
        Given que eu estou na página de Gestão de Equipamentos
        And os seguintes equipamentos estão cadastrados:
        | Sala    | Equipamento     | Quantidade |
        | E104    | Impressora      | 1          |
        When eu seleciono "Novo equipamento"
        And eu adiciono o equipamento "Impressora" para a sala "E104" sem quantidade
        And eu seleciono "Adicionar Equipamento"
        Then o sistema rejeita a operação retornando a mensagem "Preencha todos os campos"
        And eu permaneço na página de Cadastro de Equipamentos

    Scenario: Remover um equipamento de uma sala
        Given que eu estou na página de Gestão de Equipamentos
        And os seguintes equipamentos estão cadastrados:
        | Sala    | Equipamento     | Quantidade |
        | E104    | Impressora      | 1          |
        When eu seleciono a opção de remover do equipamento "Impressora" da sala "E104"
        And eu confirmo a remoção selecionando "Remover"
        Then o sistema aceita a operação retornando a mensagem "Equipamento removido da sala com sucesso!"
        And o equipamento "Impressora" não aparece na lista da sala "E104"
        And eu permaneço na página de Gestão de Equipamentos

    Scenario: Adicionar um equipamento já existente
        Given que eu estou na página de Gestão de Equipamentos
        And os seguintes equipamentos estão cadastrados:
        | Sala    | Equipamento     | Quantidade |
        | E233    | Projetor        | 2          |
        | Grad01  | Computador      | 15         |
        When eu seleciono "Novo equipamento"
        And eu adiciono o equipamento existente "Projetor" para a sala "E233" com quantidade "1"
        And eu seleciono "Adicionar Equipamento"
        Then o sistema aceita a operação retornando a mensagem "Equipamento adicionado com sucesso!"
        And eu sou redirecionado para a página de Gestão de Equipamentos
        And eu posso ver o equipamento "Projetor" da sala "E233" com quantidade "3"

    Scenario: Ordenar por salas
        Given que eu estou na página de Gestão de Equipamentos
        And os seguintes equipamentos estão cadastrados:
        | Sala    | Equipamento     | Quantidade |
        | E233    | Projetor        | 3          |
        | D003    | Cadeira         | 30         |
        | Grad01  | Computador      | 15         |
        When eu seleciono a opção de ordenar por salas
        Then eu vejo os equipamentos seguindo a ordem salas
        And eu permaneço na página de Gestão de Equipamentos
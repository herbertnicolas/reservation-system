Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:
       
         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (string, string2, string3) {      
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
       """
       {
         "identificador": "D009",
         "localizacao": "Prédio E",
         "capacidade": 50
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "201 Created"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "mensagem": "Sala criada com sucesso!",
         "sala": {
           "identificador": "D009",
           "localizacao": "Prédio E",
           "capacidade": 50
         }
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


2) Scenario: Tentar criar uma sala já existente # features\registration_maintenance_rooms_service.feature:37
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
       """
       {
         "identificador": "D009",
         "localizacao": "Prédio E",
         "capacidade": 50
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "400 Bad Request"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 já existe!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


3) Scenario: Falha ao criar sala com identificador inválido (número) # features\registration_maintenance_rooms_service.feature:55
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "123", localização "Prédio E" e capacidade "50" não está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (string, string2, string3) {      
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "POST" para o endpoint "/salas" com o corpo:
       """
       {
         "identificador": 123,
         "localizacao": "Prédio E",
         "capacidade": 50
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "400 Bad Request"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "erro": "Identificador deve ser uma string!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


4) Scenario: Editar uma sala existente com sucesso # features\registration_maintenance_rooms_service.feature:73
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
       """
       {
         "capacidade": 80
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "200 OK"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "mensagem": "Sala editada com sucesso!",
         "sala": {
           "identificador": "D009",
           "localizacao": "Prédio E",
           "capacidade": 80
         }
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


5) Scenario: Tentar editar uma sala não existente # features\registration_maintenance_rooms_service.feature:94
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (string, string2, string3) {      
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
       """
       {
         "capacidade": 80
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "404 Not Found"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 não existe!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


6) Scenario: Falha ao editar sala com capacidade inválida (string) # features\registration_maintenance_rooms_service.feature:110
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "PUT" para o endpoint "/salas/D009" com o corpo:
       """
       {
         "capacidade": "oitenta"
       }
       """
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string} com o corpo:', async function (string, string2, docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "400 Bad Request"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "erro": "Capacidade deve ser um número!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


7) Scenario: Remover sala existente com sucesso # features\registration_maintenance_rooms_service.feature:126
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} está cadastrada', async function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "DELETE" para o endpoint "/salas/D009"
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string}', async function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "200 OK"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "mensagem": "Sala removida com sucesso!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


8) Scenario: Tentar remover sala não existente # features\registration_maintenance_rooms_service.feature:137
   ? Given as seguintes salas estão cadastradas:
       | identificador | localização | capacidade |
       | D005          | Prédio D    | 50         |
       | D002          | Prédio E    | 30         |
       | D005          | Prédio F    | 90         |
       Undefined. Implement with the following snippet:

         Given('as seguintes salas estão cadastradas:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Given a sala com identificador "D009", localização "Prédio E" e capacidade "50" não está cadastrada
       Undefined. Implement with the following snippet:

         Given('a sala com identificador {string}, localização {string} e capacidade {string} não está cadastrada', async function (string, string2, string3) {      
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When envio uma requisição "DELETE" para o endpoint "/salas/D009"
       Undefined. Implement with the following snippet:

         When('envio uma requisição {string} para o endpoint {string}', async function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then o serviço responde com status "404 Not Found"
       Undefined. Implement with the following snippet:

         Then('o serviço responde com status {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And o corpo da resposta contém:
       """
       {
         "erro": "Sala com identificador D009, localização Prédio E e capacidade 50 não existe!"
       }
       """
       Undefined. Implement with the following snippet:

         Then('o corpo da resposta contém:', async function (docString) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


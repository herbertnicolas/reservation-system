import { loadFeature, defineFeature } from "jest-cucumber";

import supertest from "supertest";
import app from "../../back-nodejs/src/app"
import { di } from "../../back-nodejs/src/di";
import TestRepository from "../../back-nodejs/src/repositories/test.repository";

const feature = loadFeature("../features/test.feature");
const request = supertest(app);

defineFeature(feature, (test) => {
    let mockTestRepository: TestRepository;
    let response: supertest.Response;

    beforeEach(() => {
        mockTestRepository = di.getRepository<TestRepository>(TestRepository);
    });

    test('Create a test', ({ given, when, then, and }) => {
        //verificando que o id de teste já existe e excluindo se existir
        given(/^ o TestRepository não tem um test com nome '{.*}'$/, async (id) => { 
            const test = await mockTestRepository.getTest(id);
            if(test){
                await mockTestRepository.deleteTest(id);
            }
        });
        //when sempre faz a requisição
        when(/^ uma requisição POST for enviada para '{.*}' com o corpo da requisição sendo um JSON com o nome '{.*}'$/, async (rota, testname) => {
            response = await request.post(rota).send({ name: testname});
        });
        //then sempre verifica o resultado da requisição
        then(/^ o código de status da resposta deve ser '{.*}'$/, async (status) => {
            expect(response.status).toBe(parseInt(status, 10));
        });
        
        and(/^ o JSON da resposta de conter o id do test$/, async (testid) => {
            expect(response.body.data).toEqual(
                expect.objectContaining({
                    id: testid,
                }),
            );
        });
    });
});
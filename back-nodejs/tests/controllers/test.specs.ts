import { loadFeature, defineFeature } from "jest-cucumber";

import supertest from "supertest";
import app from "../../src/app";
import { di } from "../../src/di";
import TestRepository from "../../src/repositories/test.repository";
const feature = loadFeature("tests/features/test.feature");
const request = supertest(app);

defineFeature(feature, (test) => {
    let mockTestRepository: TestRepository;
    let response: supertest.Response;

    beforeEach(() => {
        mockTestRepository = di.getRepository<TestRepository>(TestRepository);
    });

    test('Create a test', ({ given, when, then, and }) => {
        //verificando que o id de teste já existe e excluindo se existir
        // given(/^o TestRepository não tem um test com nome '(.*)'$/, async (id) => {
        given(/^o TestRepository não tem um test com nome "(.*)"$/, async(name) => { 
            const test = await mockTestRepository.getTest(name);
            if(test){
                await mockTestRepository.deleteTest(name);
            }
        });
        //when sempre faz a requisição
        when(/^uma requisição POST for enviada para "(.*)" com o corpo da requisição sendo um JSON com o nome "(.*)"$/, 
            async (rota, testname) => {
            response = await request.post(rota).send({ name: testname});
        });
        //then sempre verifica o resultado da requisição
        then(/^o status da resposta deve ser "(.*)"$/, async (status) => {
            expect(response.status).toBe(parseInt(status, 10));
        });
        
        and(/^o JSON da resposta deve conter o nome "(.*)"$/, async (name) => {
            expect(response.body.data).toEqual(
                expect.objectContaining({
                    name: name,
                }),
            );
        });
    });
});
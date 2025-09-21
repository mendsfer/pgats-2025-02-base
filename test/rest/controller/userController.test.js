const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../rest/app');

describe('User Controller', () => {

    const testUser = {
        name: 'Alice',
        email: 'alice@email.com',
        password: '123456'
    };

    let registerUserStub;
    const userService = require('../../../src/services/userService');

    beforeEach(function () {
        if (registerUserStub) registerUserStub.restore();
    });

    afterEach(function () {
        if (registerUserStub) registerUserStub.restore();
    });

    it('Quando informo credenciais válidas de um usuário devo receber 201', async function () {
        registerUserStub = sinon.stub(userService, 'registerUser').callsFake((name, email, password) => {
            return { name, email, password };
        });

        const resposta = await request(app)
            .post('/api/users/register')
            .send(testUser);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('user');
        expect(resposta.body.user).to.have.property('name', testUser.name);
        expect(resposta.body.user).to.have.property('email', testUser.email);
    });

    it('Retorna erro quando o email já está cadastrado', async function () {
        registerUserStub.restore();
        registerUserStub = sinon.stub(userService, 'registerUser').returns(null);

        const resposta = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Alice',
                email: 'alice@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error', 'Email já cadastrado');

        // registerUserStub.restore();
    });

    it('Retorna erro quando as credenciais estão inválidas', async function () {

        const resposta = await request(app)
            .post('/api/users/login')
            .send({
                name: 'Fernanda',
                email: 'fernanda@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error', 'Credenciais inválidas');

        // registerUserStub.restore();
    });
});
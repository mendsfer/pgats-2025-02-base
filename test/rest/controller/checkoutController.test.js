const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../../../rest/app');
const jwt = require('jsonwebtoken');

const payload = { id: 1, name: 'Alice', email: 'alice@email.com', password: '123456' };
const secret = 'supersecret';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

describe('Checkout Controller', () => {
    describe('POST Checkout', () => {

        it('Quando tento fazer um checkout sem informar as credenciais o retorno deve retornar a mensagem "token inválido"', async () => {
            const resposta = await request(app)
                .post('/api/checkout')
                .send({
                    userId: "",
                    items: "",
                    freight: "",
                    paymentMethod: "",
                    cardData: ""
                })

            expect(resposta.status).to.equal(401)
            expect(resposta.body).to.have.property('error', 'Token inválido')
        })

        it('Quando informo dados válidos o checkout é realizado e o retorno será 200', async () => {

            const respostacheckout = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{
                        productId: 2,
                        quantity: 15
                    }],
                    freight: 200,
                    paymentMethod: "boleto"
                });

            expect(respostacheckout.status).to.equal(200);
        });

        it('Quando informo dados um produto inexistente', async () => {

            const respostacheckout = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{
                        productId: 3,
                        quantity: 10
                    }],
                    freight: 200,
                    paymentMethod: "boleto"
                });

            expect(respostacheckout.status).to.equal(400);
            expect(respostacheckout.body).to.have.property('error', 'Produto não encontrado');
        });
    })
});
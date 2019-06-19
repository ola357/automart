import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';

should();
use(chaiHttp);

//  PARENT BLOCK
describe('Orders', () => {
  // Test Post/Create new purcase order Route
  describe('/POST orders', () => {
    it('it should create a new order', (done) => {
      const order = {
        buyer: 2,
        orderId: 4,
        amount: 6550000,
        status: "pending",
      };
      request(server)
        .post('/api/v1/orders')
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('validation logic should kick in', (done) => {
      const order = {
        subject: "Unit Test",
        order: "Install mocha",
        status: "refactor",
      };
      request(server)
        .post('/api/v1/orders')
        .send(order)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  // End Of POST a New Message Route
  // *******************************
  // Test PATC / UPDATE price block
  describe('PATCH/orders/:order-id/price', () => {
    it('it should throw an error wen resource is not available', (done) => {
      chai.request(server)
        .patch('/api/v1/orders/10/price')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      chai.request(server)
        .patch('/api/v1/orders/2/price')
        .send({
          price: "2.5million",
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should PATCH succesfully', (done) => {
      chai.request(server)
        .patch('/api/v1/orders/1/price')
        .send({
          price: 2750000,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

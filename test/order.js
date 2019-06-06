import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';

should();
use(chaiHttp);

//  PARENT BLOCK
describe('Orders', () => {
  //    Test the /GET orders route
  /*  describe('/GET orders', () => {
    it('it should GET all recieved orders', (done) => {
      request(server)
        .get('/api/v1/orders')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // end of get orders test suite
  // ***************************
  // Test the Get unread messsages route
  describe('/GET orders/unread', () => {
    it('it should GET all recieved unread orders', (done) => {
      request(server)
        .get('/api/v1/orders/unread')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End Get unread orders test suite
  // ****************************
  // Test Get Sent orders route
  describe('/GET orders/sent', () => {
    it('it should GET all the sent orders', (done) => {
      request(server)
        .get('/api/v1/orders/sent')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End of Get sent orders route
  // **********************
  // Test Get a Specific Message by it's id Route
  describe('/GET/order/:id ', () => {
    it('it should GET a order by the given id', (done) => {
      request(server)
        .get('/api/v1/orders/2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it give an error when wrong id is sent', (done) => {
      request(server)
        .get('/api/v1/parties/46')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  }); */
  // End of Get specic Message route
  // *******************************
  // Test Post/Create new purcase order Route
  describe('/POST orders', () => {
    it('it should create a new order', (done) => {
      const order = {
        buyer: 2,
        carId: 4,
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
    /* it('validation logic should kick in', (done) => {
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
    }); */
  });
  // End Of Post a New Message Route
  // ****************************************
  // Test Delete A Message Route
  /* describe('/DELETE/orders/:id', () => {
    it('it should DELETE succesfully', (done) => {
      request(server)
        .delete('/api/v1/orders/2')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should throw an error', (done) => {
      request(server)
        .delete('/api/v1/orders/27')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  }); */
});

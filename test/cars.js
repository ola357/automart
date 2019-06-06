import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';

should();
use(chaiHttp);

//  PARENT BLOCK
describe('Cars', () => {
  //    Test the /GET cars route
  /* describe('/GET cars', () => {
    it('it should GET all recieved cars', (done) => {
      request(server)
        .get('/api/v1/cars')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // end of get cars test suite
  // ***************************
  // Test the Get unread messsages route
  describe('/GET cars/unread', () => {
    it('it should GET all recieved unread cars', (done) => {
      request(server)
        .get('/api/v1/cars/unread')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End Get unread cars test suite
  // ****************************
  // Test Get Sent cars route
  describe('/GET cars/sent', () => {
    it('it should GET all the sent cars', (done) => {
      request(server)
        .get('/api/v1/cars/sent')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End of Get sent cars route
  // **********************
  // Test Get a Specific Message by it's id Route
  describe('/GET/car/:id ', () => {
    it('it should GET a car by the given id', (done) => {
      request(server)
        .get('/api/v1/cars/2')
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
  // Test Post/Create new Car sale ad
  describe('/POST cars', () => {
    it('it should create a new car ad', (done) => {
      const car = {
        owner: 2,
        state: "jos",
        status: "new",
        price: 3500000,
        manufacturer: "toyota",
        model: "avensis",
        body: "sedan",
      };
      request(server)
        .post('/api/v1/cars')
        .send(car)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    /* it('validation logic should kick in', (done) => {
      const car = {
        subject: "Unit Test",
        car: "Install mocha",
        status: "refactor",
      };
      request(server)
        .post('/api/v1/cars')
        .send(car)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }); */
  });
  // End Of Post a New Message Route
  // ****************************************
  // Test Delete A Message Route
  /* describe('/DELETE/cars/:id', () => {
    it('it should DELETE succesfully', (done) => {
      request(server)
        .delete('/api/v1/cars/2')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should throw an error', (done) => {
      request(server)
        .delete('/api/v1/cars/27')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  }); */
});

import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';

should();
use(chaiHttp);

//  PARENT BLOCK
describe('Cars', () => {
  // Test Post/Create new Car sale ad
  describe('POST/api/v1/cars', () => {
    it('it should create a new car ad', (done) => {
      const car = {
        state: "new",
        status: "available",
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
    it('validation logic should kick in', (done) => {
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
    });
  });
  // End Of POST a New Message Route
  // ***********************************
  //    Test the /GET cars route
  describe('/GET cars', () => {
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
  // **********************
  // Test Get a Specific Message by it's id Route
  describe('/GET/cars/:id ', () => {
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
        .get('/api/v1/cars/46')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // End of Get specific car route
  // ****************************************
  // Test DELETE A Message Route
  describe('/DELETE/cars/:id', () => {
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
  });
  // End of DELETE Route block
  // ***************************
  // Test PATC route block
  describe('PATCH/:car-id/status', () => {
    /* it('it should UPDATE a book given the id', (done) => {
      let book = new Book({title: "The Chronicles of Narnia",
       author: "C.S. Lewis", year: 1948, pages: 778})
      book.save((err, book) => {
        chai.request(server)
          .put('/book/' + book.id)
          .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Book updated!');
            res.body.book.should.have.property('year').eql(1950);
            done();
          });
      });
    }); */
    it('it should throw an error wen resource is not available', (done) => {
      chai.request(server)
        .patch('/api/v1/cars/10/status')
        .end((err, res) => {
          res.should.have.status(404);
          // res.body.should.be.a('object');
          // res.body.should.have.property('title');
          // res.body.should.have.property('author');
          // res.body.should.have.property('pages');
          // res.body.should.have.property('year');
          // res.body.should.have.property('_id').eql(book.id);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      chai.request(server)
        .patch('/api/v1/cars/2/status')
        .send({
          status: 4,
        })
        .end((err, res) => {
          res.should.have.status(400);
          // res.body.should.be.a('object');
          // res.body.should.have.property('title');
          // res.body.should.have.property('author');
          // res.body.should.have.property('pages');
          // res.body.should.have.property('year');
          // res.body.should.have.property('_id').eql(book.id);
          done();
        });
    });
    it('it should PATCH succesfully', (done) => {
      chai.request(server)
        .patch('/api/v1/cars/1/status')
        .send({
          status: "sold",
        })
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('object');
          // res.body.should.have.property('title');
          // res.body.should.have.property('author');
          // res.body.should.have.property('pages');
          // res.body.should.have.property('year');
          // res.body.should.have.property('_id').eql(book.id);
          done();
        });
    });
  });
  // End of Patc/ Update status Route block
  // ***************************
  // Test PATC / UPDATE price block
  describe('PATCH/:car-id/price', () => {
    it('it should throw an error wen resource is not available', (done) => {
      chai.request(server)
        .patch('/api/v1/cars/10/price')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      chai.request(server)
        .patch('/api/v1/cars/2/price')
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
        .patch('/api/v1/cars/1/price')
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

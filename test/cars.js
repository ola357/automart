import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import server from '../server/app';

import dbConnection from '../server/models/dbConnection';

should();
use(chaiHttp);
dotenv.config();
let token;
dbConnection.query(`SELECT * FROM users WHERE email = 'bond@gmail.com';`).then((res) => {
  token = jwt.sign({
    _id: res.rows[0].id,
    _email: res.rows[0].email,
    _isadmin: false,
  }, process.env.jwtPrivateKey).toString();
  console.log(token);
}).catch(err => console.error("explosion ", err));
/**  const testuser = async () => {
const result = await dbConnection.query(
  `SELECT * FROM users WHERE email = ($1);`, ['lagabja@gmail.com']);
const motors = await dbConnection.query(
  `SELECT * FROM cars WHERE owner = ($1);`, [result.rows[0].id]);
  // return motors.rows[0].id;
  console.log(result.rows);
  console.log(motors.rows);
};
const routeparam = `/api/v1/car/${testuser()}`; */
//  PARENT BLOCK
describe('car', () => {
  // Test Post/Create new Car sale ad
  describe('POST/api/v1/car', () => {
    it('it should create a new car ad', (done) => {
      const car = {
        state: "new",
        status: "available",
        price: 3500000,
        manufacturer: "xxxxx",
        model: "yyyyy",
        bodytype: "sedan",
      };
      request(server)
        .post('/api/v1/car')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM4LCJfZW1haWwiOiJvcGVAbXNuLmNvbSIsIl9pc2FkbWluIjpmYWxzZSwiaWF0IjoxNTYxMTQ0OTA2fQ.UJVn8TwsZLiTjVvtWiRaf6iy0qnXKreeDSMCzdQ5apQ')
        .send(car)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('validation logic should kick in', (done) => {
      const car = {
        state: "new",
        status: "available",
        price: "trow",
        manufacturer: "toyota",
        model: "avensis",
        bodytype: "sedan",
      };
      request(server)
        .post('/api/v1/car')
        // .set('x-auth-token', token)
        .send(car)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  // End Of POST a New Message Route
  // ***********************************
  //    Test the /GET car route
  describe('/GET car', () => {
    it('it should GET all recieved car', (done) => {
      request(server)
        .get('/api/v1/car')
        .end((err, res) => {
          res.should.have.status(200);
          // console.log(res.body.data);
          done();
        });
    });
  });
  // end of get car test suite
  // **********************
  // Test Get a Specific Message by it's id Route
  describe('/GET/car/:id ', () => {
    it('it should GET a car by the given id', (done) => {
      request(server)
        .get('/api/v1/car/6')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it give an error when wrong id is sent', (done) => {
      request(server)
        .get('/api/v1/car/463')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // End of Get specific car route
  // ****************************************
  // Test DELETE A Message Route
  describe('/DELETE/car/:id', () => {
    it('it should DELETE succesfully', (done) => {
      request(server)
        .delete('/api/v1/car/6')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should throw an error', (done) => {
      request(server)
        .delete('/api/v1/car/27')
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
        .patch('/api/v1/car/10/status')
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
        .patch('/api/v1/car/2/status')
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
        .patch('/api/v1/car/1/status')
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
        .patch('/api/v1/car/10/price')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      chai.request(server)
        .patch('/api/v1/car/2/price')
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
        .patch('/api/v1/car/1/price')
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

/* eslint-disable prefer-template */
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
    _isadmin: res.rows[0].isadmin,
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
let parameter;
let parameter2;
let parameter3;
//  PARENT BLOCK
describe('car', () => {
  before(async () => {
    try {
      await dbConnection.query(`DELETE FROM cars WHERE model = 'yyyyy';`);
    } catch (error) {
      console.log("Error boom");
    }
  });
  afterEach(async () => {
    try {
      const res = await dbConnection.query(`SELECT * FROM cars WHERE model = 'yyyyy';`);
      console.log(res.rows[0].id);
      // eslint-disable-next-line prefer-template
      parameter = '/api/v1/car/' + res.rows[0].id.toString();
      parameter2 = '/api/v1/car/' + res.rows[0].id.toString() + '/status';
      parameter3 = '/api/v1/car/' + res.rows[0].id.toString() + '/price';
    } catch (error) {
      console.log("Error blam");
    }
  });
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
        .post('/api/v1/car')// .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM4LCJfZW1haWwiOiJvcGVAbXNuLmNvbSIsIl9pc2FkbWluIjpmYWxzZSwiaWF0IjoxNTYxMTQ0OTA2fQ.UJVn8TwsZLiTjVvtWiRaf6iy0qnXKreeDSMCzdQ5apQ')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
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
        .set('x-auth-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjg4LCJfZW1haWwiOiJib25kQGdtYWlsLmNvbSIsIl9pc2FkbWluIjpmYWxzZSwiaWF0IjoxNTYxMjY4MDcwfQ.zAkmvycrrzCUpUrO4RpLHUfnTeqvGIjmp9y59Cttj-I")
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
        .get(parameter)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it give an error when wrong id is sent', (done) => {
      request(server)
        .get('/api/v1/car/4789')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // End of Get specific car route
  // ****************************************
  // Test PATC route block
  describe('PATCH/:car-id/status', () => {
    it('it should throw an error wen resource is not available', (done) => {
      request(server)
        .patch('/api/v1/car/7890/status')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      request(server)
        .patch(parameter2)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
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
      request(server)
        .patch(parameter2)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .send({
          status: "sold",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // End of Patc/ Update status Route block
  // ***************************
  // Test PATC / UPDATE price block
  describe('PATCH/:car-id/price', () => {
    it('it should throw an error wen resource is not available', (done) => {
      request(server)
        .patch('/api/v1/car/7890/price')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should throw an error wen input is invalid', (done) => {
      request(server)
        .patch(parameter3)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .send({
          price: "2.5million",
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should PATCH succesfully', (done) => {
      request(server)
        .patch(parameter3)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .send({
          price: 2750000,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // Test DELETE A Message Route
  describe('/DELETE/car/:id', () => {
    it('it should DELETE succesfully', (done) => {
      request(server)
        .delete(parameter)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should throw an error', (done) => {
      request(server)
        .delete('/api/v1/car/2767')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjM3LCJfZW1haWwiOiJsYWdiYWphQGdtYWlsLmNvbSIsIl9pc2FkbWluIjp0cnVlLCJpYXQiOjE1NjEyNzA0ODN9.HF1IZeR69O3S4ffvFbPm37tBIpUOH--Nr3DpmkDBYTI')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // End of DELETE Route block
  // ***************************
});

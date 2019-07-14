import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';
import dbConnection from '../server/models/dbConnection';

should();
use(chaiHttp);

process.env.NODE_ENV === 'test';

let buyertoken;
let sellertoken;
let vehicleid;

describe('CREATE NEW USERS', () => {
  context('signup new users', () => {
    specify('it should signup a new user(seller)', (done) => {
      const user = {
        email: "seller@gmail.com",
        first_name: "seller",
        last_name: "seller",
        password: "seller007",
        address: "gasline",
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          // const { sellertoken: 'x-auth-token' } = res.header;
          // eslint-disable-next-line prefer-destructuring
          sellertoken = Object.values(res.header)[1];
          console.log(sellertoken);
          done();
        });
    });
    specify('it should signup a new user(buyer)', (done) => {
      const user = {
        email: "buyer@gmail.com",
        first_name: "buyer",
        last_name: "buyer",
        password: "buyer007",
        address: "gasline",
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          // eslint-disable-next-line prefer-destructuring
          buyertoken = Object.values(res.header)[1];
          done();
        });
    });
    it('create a new car ad with seller token', (done) => {
      const car = {
        state: "used",
        status: "available",
        price: 444477,
        manufacturer: "cccc",
        model: "dddd",
        body_type: "hatchback",
      };
      request(server)
        .post('/api/v1/car')
        .set('token', sellertoken)
        .send(car)
        .end((err, res) => {
          res.should.have.status(200);
          vehicleid = res.body.data.id;
          done();
        });
    });
  });
});
describe('POST FLAGS ENDPOINT', () => {
  after(async () => {
    try {
      await dbConnection.query(`DELETE FROM users WHERE email = 'buyer@gmail.com' OR
            email = 'seller@gmail.com';`);
    } catch (error) {
      console.log("querying users failed");
    }
  });
  context('post /flag', () => {
    it('return error if token is missing', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: vehicleid, reason: 'a', description: 'b' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('returns error if wrong token provided', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: vehicleid, reason: 'a', description: 'b' })
        .set('token', 'jdhjwFWAVWAV;OAWNV;J')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should not post if request iput are wrong', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: vehicleid, reason: 1, description: 'b' })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('error if car ad owner accesses route', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: vehicleid, reason: 'a', description: 'b' })
        .set('token', sellertoken)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('should create a new flag', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: vehicleid, reason: 'a', description: 'b' })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should throw error when input in body is wrong', (done) => {
      request(server)
        .post('/api/v1/flag')
        .send({ carid: 0, reason: 'a', description: 'b' })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});

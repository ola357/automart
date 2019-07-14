/* eslint-disable prefer-template */
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
let orderId;
const updateCarStatus = (id) => {
  dbConnection.query(
    `UPDATE cars SET status = 'sold'
    WHERE id = ($1)`,
    [id],
  )
    .then()
    .catch();
};
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
describe('ORDERS Route', () => {
  after(async () => {
    try {
      await dbConnection.query(`DELETE FROM users WHERE email = 'buyer@gmail.com' OR
        email = 'seller@gmail.com';`);
    } catch (error) {
      console.log("querying users failed");
    }
  });
  context('Post /order', () => {
    it('return error if token is missing', (done) => {
      request(server)
        .post('/api/v1/order')
        .send({ car_id: vehicleid, amount: 1234567890 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('returns error if wrong token provided', (done) => {
      request(server)
        .post('/api/v1/order')
        .send({ car_id: vehicleid, amount: 1234567890 })
        .set('token', 'jdhjwFWAVWAV;OAWNV;J')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if request is invalid', (done) => {
      request(server)
        .post('/api/v1/order')
        .send({ car_id: vehicleid, amount: '50,000' })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if request is from user who put up ad', (done) => {
      request(server)
        .post('/api/v1/order')
        .set('token', sellertoken)
        .send({ car_id: vehicleid, amount: 1234567 })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('create a new purchase order', (done) => {
      request(server)
        .post('/api/v1/order')
        .set('token', buyertoken)
        .send({ car_id: vehicleid, amount: 1234567 })
        .end((err, res) => {
          orderId = res.body.data.id;
          console.log(orderId);
          res.should.have.status(200);
          done();
        });
    });
  });
  context('PATCH order/:order_id', () => {
    it('return error if token is missing', (done) => {
      const patchPath = '/api/v1/order/' + orderId + '/price';

      request(server)
        .patch(patchPath)
        .send({ amount: 987654321 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('returns error if wrong token provided', (done) => {
      const patchPath = `/api/v1/order/${orderId}/price`;
      request(server)
        .patch(patchPath)
        .send({ amount: 1234567890 })
        .set('token', 'jdhjwFWAVWAV;OAWNV;J')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if request parameter is invalid', (done) => {
      const patchPath = '/api/v1/order/£/price';
      request(server)
        .patch(patchPath)
        .send({ amount: 9856789 })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('return error if user didnt create purchase order', (done) => {
      const patchPath = `/api/v1/order/${orderId}/price`;
      request(server)
        .patch(patchPath)
        .send({ amount: 23456 })
        .set('token', sellertoken)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('return error if vehicle doesnt exist', (done) => {
      const patchPath = '/api/v1/order/9876/price';
      request(server)
        .patch(patchPath)
        .send({ amount: 23456 })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('return error if invalid data in request body', (done) => {
      const patchPath = `/api/v1/order/${orderId}/price`;
      request(server)
        .patch(patchPath)
        .send({ amount: '20,000' })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should patch and update price', (done) => {
      const patchPath = `/api/v1/order/${orderId}/price`;
      request(server)
        .patch(patchPath)
        .send({ amount: 200000.00 })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('return error if car is already sold', (done) => {
      updateCarStatus(vehicleid);
      const patchPath = `/api/v1/order/${orderId}/price`;
      request(server)
        .patch(patchPath)
        .send({ amount: 2090000.00 })
        .set('token', buyertoken)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

/* eslint-disable prefer-template */
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';
import dbConnection from '../server/models/dbConnection';

should();
use(chaiHttp);

process.env.NODE_ENV === 'test';

let admintoken;
let sellertoken;
let vehicleid;
let parameter;

const changeStatus = () => {
  const sql = `UPDATE cars SET status = 'available'
      WHERE model = 'bbbb';`;
  dbConnection.query(sql).then().catch();
};
describe('CREATE NEW USERS', () => {
  context('signup new users', () => {
    specify('it should signup a new user(seller)', (done) => {
      const user = {
        email: "seller@gmail.com",
        firstname: "seller",
        lastname: "seller",
        password: "seller007",
        address: "gasline",
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    specify('it should signup a new user(admin)', (done) => {
      const user = {
        email: "admin@gmail.com",
        firstname: "admin",
        lastname: "admin",
        password: "admin007",
        address: "gasline",
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  context('signin new registered users', () => {
    before(async () => {
      try {
        await dbConnection.query(`UPDATE users SET isadmin = true WHERE email = 'admin@gmail.com';`);
      } catch (error) {
        console.log("querying users failed");
      }
    });
    specify('it should signin admin', (done) => {
      const user = {
        email: "admin@gmail.com",
        password: "admin007",
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.should.be.json;
          console.log(res.body.data.token);
          admintoken = res.body.data.token;
          done();
        });
    });
    specify('it should signin a seller', (done) => {
      const user = {
        email: "seller@gmail.com",
        password: "seller007",
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.should.be.json;
          console.log(res.body.data.token);
          sellertoken = res.body.data.token;
          done();
        });
    });
  });
});
describe('Car Routes', () => {
  context('POST /car', () => {
    it('should send an error response if token is absent', (done) => {
      const car = {
        state: "used",
        status: "available",
        price: 444455,
        manufacturer: "aaaa",
        model: "bbbb",
        bodytype: "sport",
      };
      request(server)
        .post('/api/v1/car')
        .send(car)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should not create a new car ad if token is invalid', (done) => {
      const car = {
        state: "used",
        status: "available",
        price: 444455,
        manufacturer: "aaaa",
        model: "bbbb",
        bodytype: "sport",
      };
      request(server)
        .post('/api/v1/car')
        .set('x-auth-token', 'vxsgsacvscvasvc')
        .send(car)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should create a new car ad', (done) => {
      const car = {
        state: "used",
        status: "available",
        price: 444455,
        manufacturer: "aaaa",
        model: "bbbb",
        bodytype: "sport",
      };
      request(server)
        .post('/api/v1/car')
        .set('x-auth-token', sellertoken)
        .send(car)
        .end((err, res) => {
          res.should.have.status(200);
          vehicleid = res.body.data.id;
          done();
        });
    });
  });
  // Update car ad status route/endpoint
  context('PATCH /car/carid/status', () => {
    it('returns error if no token', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('returns error if wrong token provided', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .set('x-auth-token', 'jdhjwFWAVWAV;OAWNV;J')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if invalid parameter', (done) => {
      const patchRoute = '/api/v1/car/a32/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should return error if user did not put the ad', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .set('x-auth-token', admintoken)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('validation logic should kick in', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/status';
      request(server)
        .patch(patchRoute)
        .send({ status: '#$%^&&*sdg' })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if car ad is not found', (done) => {
      const patchRoute = '/api/v1/car/8932/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('should update car ad status', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/status';
      request(server)
        .patch(patchRoute)
        .send({ status: 'sold' })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // update the price of a car ad
  context('PATCH car/:carId/price', () => {
    it('returns error if no token', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('returns error if wrong token provided', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', 'jdhjwFWAVWAV;OAWNV;J')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if invalid parameter', (done) => {
      const patchRoute = '/api/v1/car/a32/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should return error if user is not the seller', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', admintoken)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('validation logic should kick in', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 'availale' })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('returns error if car ad is not found', (done) => {
      const patchRoute = '/api/v1/car/8932/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('should NOT update car ad price BECAUSE car is sold', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('should update car ad price', (done) => {
      const patchRoute = ('/api/v1/car/' + vehicleid) + '/price';
      changeStatus();
      request(server)
        .patch(patchRoute)
        .send({ price: 123456 })
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // Get a specific car
  context('GET /car/:carId', () => {
    it('should return error if invalid parameter id', (done) => {
      request(server)
        .get('/api/v1/car/a')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('return error if car is not available', (done) => {
      request(server)
        .get('/api/v1/car/9998')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('should get a specific car', (done) => {
      parameter = '/api/v1/car/' + vehicleid;
      request(server)
        .get(parameter)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  // Get cars AND FILTER with queries
  //  .query({name: 'foo', limit: 10}) // /search?name=foo&limit=10
  context('GET /car', () => {
    it('should return error when token absent', (done) => {
      request(server)
        .get('/api/v1/car')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should return error when token is invalid', (done) => {
      request(server)
        .get('/api/v1/car')
        .set('x-auth-token', 'cvsjdcuaUUUIhvcjcjkcjacjkc')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should return error when user is not an admin', (done) => {
      request(server)
        .get('/api/v1/car')
        .set('x-auth-token', sellertoken)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('should return an array of all cars', (done) => {
      request(server)
        .get('/api/v1/car')
        .set('x-auth-token', admintoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return array of cars filtered by STATUS', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ status: 'availale' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return array of cars filtered by STATUS & PRICE', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ status: 'availale', minPrice: 500, maxPrice: 5000000000 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return array of cars filtered by STATUS & STATE', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ status: 'availale', state: 'used' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return array of cars filtered by STATUS & MANUFACTURER', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ status: 'availale', manufacturer: 'aaaa' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return array of cars filtered by BODYTYPE', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ bodytype: 'sports' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return error when query parameters are not taken of', (done) => {
      request(server)
        .get('/api/v1/car')
        .query({ bodytype: 'sports', status: 'availale', manufacturer: 'aaaa' })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // Delete car route/endpoint
  context('DELETE /car', () => {
    before(async () => {
      const { rows: [{ id }] } = await dbConnection.query(`SELECT id FROM cars WHERE model = 'bbbb';`);
      console.log(id);
      parameter = '/api/v1/car/' + id;
    });
    after(async () => {
      try {
        // await dbConnection.query(`DELETE FROM orders WHERE carid = ($1);`, [vehicleid]);
        // await dbConnection.query(`DELETE FROM flags WHERE carid = ($1);`, [vehicleid]);
        await dbConnection.query(`DELETE FROM users WHERE email = 'admin@gmail.com' OR
        email = 'seller@gmail.com';`);
        // await dbConnection.query(`DELETE FROM users WHERE email = 'buyer@gmail.com';`);
        // await dbConnection.query(`DELETE FROM users WHERE email = 'seller@gmail.com';`);
      } catch (error) {
        console.log("querying users failed");
      }
    });
    it('it should DELETE succesfully', (done) => {
      request(server)
        .delete(parameter)
        .set('x-auth-token', admintoken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

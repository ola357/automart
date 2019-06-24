import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';
import dbConnection from '../server/models/dbConnection';

should();
use(chaiHttp);

let admintoken;
let sellertoken;
let buyertoken;
let vehicleid;
let parameter;

describe('/POST auth/signup', () => {
  it('it should signup a administrator', (done) => {
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
  it('it should signup a new seller', (done) => {
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
  it('it should signup a new user', (done) => {
    const user = {
      email: "buyer@gmail.com",
      firstname: "buyer",
      lastname: "buyer",
      password: "buyer007",
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
/** #################################################### */
describe('/POST auth/signin', () => {
  before(async () => {
    try {
      await dbConnection.query(`UPDATE users SET isadmin = true WHERE email = 'admin@gmail.com';`);
    } catch (error) {
      console.log("querying users failed");
    }
  });
  it('it should signin admin', (done) => {
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
  it('it should signin a seller', (done) => {
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
  it('it should signin a buyer', (done) => {
    const user = {
      email: "buyer@gmail.com",
      password: "buyer007",
    };
    request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.should.be.json;
        console.log(res.body.data.token);
        buyertoken = res.body.data.token;
        done();
      });
  });
});
/** #################################################### */
describe('POST/api/v1/car', () => {
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
        done();
      });
  });
});
/** #################################################### */
describe('POST/api/v1/order', () => {
  before(async () => {
    try {
      const result = await dbConnection.query(`SELECT * FROM cars WHERE model = 'bbbb';`);
      vehicleid = result.rows[0].id;
      // eslint-disable-next-line prefer-template
      parameter = '/api/v1/car/' + vehicleid;
      console.log(vehicleid);
    } catch (error) {
      console.log("querying cars failed");
    }
  });
  it('it should create an order', (done) => {
    const order = {
      carid: vehicleid,
      amount: 1000,
    };
    request(server)
      .post('/api/v1/order')
      .set('x-auth-token', buyertoken)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
/** ############################################### */
describe('/POST flags', () => {
  it('it should create a new flags', (done) => {
    const flag = {
      carid: vehicleid,
      reason: "pricing",
      description: "seller demands exorbitant fees",
    };
    request(server)
      .post('/api/v1/flag')
      .set('x-auth-token', buyertoken)
      .send(flag)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
/** ###################################### */
describe('/DELETE/car/:id', () => {
  after(async () => {
    try {
      await dbConnection.query(`DELETE FROM orders WHERE carid = ($1);`, [vehicleid]);
      await dbConnection.query(`DELETE FROM flags WHERE carid = ($1);`, [vehicleid]);
      await dbConnection.query(`DELETE FROM users WHERE email = 'admin@gmail.com';`);
      await dbConnection.query(`DELETE FROM users WHERE email = 'buyer@gmail.com';`);
      await dbConnection.query(`DELETE FROM users WHERE email = 'seller@gmail.com';`);
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

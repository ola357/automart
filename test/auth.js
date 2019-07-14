import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';
import dbConnection from '../server/models/dbConnection';

should();
use(chaiHttp);

process.env.NODE_ENV === 'test';
/* it('it should ', (done) => {
    request(server)
      .get().post().patch()
      .set().send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }); */
describe('/POST auth/signup', () => {
  it('should NOT signup when bad values are inputed', (done) => {
    const user = {
      email: "admincom",
      first_name: "admin",
      last_name: "admin",
      password: "admin007",
      address: "gasline",
    };
    request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('it should signup a new user(seller)', (done) => {
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
        done();
      });
  });
  it('it should NOT signup if user is already registered', (done) => {
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
        res.should.have.status(409);
        done();
      });
  });
});
/** #################################################### */
describe('/POST auth/signin', () => {
  after(async () => {
    try {
      await dbConnection.query(`DELETE FROM users WHERE email = 'seller@gmail.com';`);
    } catch (error) {
      console.log("querying users failed", error);
    }
  });
  it('it should NOT signin if input values are bad', (done) => {
    const user = {
      email: "sellergmail",
      address: "gasline",
    };
    request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('it should NOT signin if email is incorrect', (done) => {
    const user = {
      email: "selr@gmail.com",
      password: "seller007",
    };
    request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('it should NOT signin if password is incorrect', (done) => {
    const user = {
      email: "seller@gmail.com",
      password: "seller001",
    };
    request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
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
        done();
      });
  });
});

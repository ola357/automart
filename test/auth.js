import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server/app';
import db from '../server/models/dbConnection';
// import createTestDb from '../server/models/createTestDb';

// process.env.NODE_ENV = 'test';
should();
use(chaiHttp);

//  PARENT BLOCK
describe('Authentication', () => {
  // Test the /POST auth/signup route
  after(async () => {
    await db.query(`DELETE FROM users;`);
  });
  /** *****BEGINNING POST user signup route****** */
  describe('/POST auth/signup', () => {
    it('it should signup a new user', (done) => {
      const user = {
        email: "lagbaja@gmail.com",
        firstname: "lagbaja",
        lastname: "tamedu",
        password: "testing123",
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
    it('validation logic should kick in', (done) => {
      const user = {
        email: "lagbaja",
        firstname: "lagbaja",
        lastname: "tamedu",
        password: "testing123",
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
    it('throw error if user already registered', (done) => {
      const user = {
        email: "lagbaja@gmail.com",
        firstname: "lagbaja",
        lastname: "tamedu",
        password: "testing123",
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
  /** ******BEGINING of POST user signin route********  */
  describe('/POST auth/signin', () => {
    it('it should signin a user', (done) => {
      const user = {
        email: "lagbaja@gmail.com",
        password: "testing123",
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
    it('validation logic should kick in', (done) => {
      const user = {
        email: "a",
        password: "growing15",
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          // res.should.be.json;
          done();
        });
    });
    it('throw error if user is not registered', (done) => {
      const user = {
        email: "bolatito@epicmail.com",
        password: "abc123",
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          // res.should.be.json;
          done();
        });
    });
    it('throw error if user password is wrong', (done) => {
      const user = {
        email: "lagbaja@gmail.com",
        password: "freebie34",
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          // res.should.be.json;
          done();
        });
    });
  });
});

/* describe('Example Node Server', () => {
  it('should return 200', (done) => {
    http.get('http://127.0.0.1:1337', (res) => {
      assert.equal(404, res.statusCode);
      server.close();
      done();
    });
  });
});
 */

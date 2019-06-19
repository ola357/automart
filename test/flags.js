import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';

should();
use(chaiHttp);

//  PARENT BLOCK
describe('flags', () => {
  // Test Post/Create new purcase flags Route
  describe('/POST flags', () => {
    it('it should create a new flags', (done) => {
      const flag = {
        carid: 1,
        reason: "pricing",
        description: "seller demands exorbitant fees",
      };
      request(server)
        .post('/api/v1/flags')
        .send(flag)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('validation logic should kick in', (done) => {
      const flag = {
        carid: "level",
        reason: "pricing",
        description: "seller demands exorbitant fees",
      };
      request(server)
        .post('/api/v1/flagss')
        .send(flag)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  // End Of POST a New Message Route
});

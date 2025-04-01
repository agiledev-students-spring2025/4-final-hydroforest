const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Leaderboard API', () => {
  it('should return leaderboard data', done => {
    chai.request(app)
      .get('/api/leaderboard')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('hydration');
        done();
      });
  });
});

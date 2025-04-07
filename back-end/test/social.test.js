const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Social API', () => {
  it('should return friends list', done => {
    chai.request(app)
      .get('/api/social')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.friends).to.be.an('array');
        expect(res.body.friends.length).to.be.greaterThan(0);
        done();
      });
  });

  it('should return friend suggestions when query matches', done => {
    chai.request(app)
      .get('/api/social/suggestions?q=d')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.suggestions).to.be.an('array');
        done();
      });
  });

  it('should add a new friend', done => {
    const newFriend = {
      id: 99,
      name: 'Test Friend',
      hydration: 5.5,
      src: 'https://picsum.photos/199'
    };

    chai.request(app)
      .post('/api/social/add')
      .send(newFriend)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Friend added.');
        done();
      });
  });

  it('should remove a friend', done => {
    chai.request(app)
      .post('/api/social/remove')
      .send({ id: 99 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Friend removed.');
        done();
      });
  });
});

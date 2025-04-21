const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../database/User');

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
let userId;
const testUser = {
  username: `socialuser_${Date.now()}`,
  email: `${Date.now()}@social.com`,
  password: "123456"
};

before(done => {
  chai.request(app)
    .post("/api/auth/signup")
    .send(testUser)
    .end((err, res) => {
      chai.request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password })
        .end((err2, res2) => {
          authToken = res2.body.token;
          userId = res2.body.id;
          done();
        });
    });
});

after(async () => {
  await User.deleteOne({ username: testUser.username });
});

describe("Social API", () => {
  it("GET /api/social should return friend list", done => {
    chai.request(app)
      .get('/api/social')
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.friends).to.be.an('array');
        done();
      });
  });

  it("GET /api/social/suggestions should return suggestions", done => {
    chai.request(app)
      .get('/api/social/suggestions?q=a')
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("suggestions").that.is.an("array");
        done();
      });
  });
});


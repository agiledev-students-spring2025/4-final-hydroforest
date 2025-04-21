const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
const testUser = {
  username: `boarduser_${Date.now()}`,
  email: `${Date.now()}@leader.com`,
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
          done();
        });
    });
});

after(async () => {
  await User.deleteOne({ username: testUser.username });
});

describe("Leaderboard API", () => {
  it("GET /api/leaderboard should return leaderboard data", done => {
    chai.request(app)
      .get('/api/leaderboard')
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.leaderboard).to.be.an("array");
        expect(res.body.leaderboard[0]).to.have.property("username");
        expect(res.body.leaderboard[0]).to.have.property("totalWaterLogged");
        done();
      });
  });
});


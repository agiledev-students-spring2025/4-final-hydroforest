const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
const testUser = {
  username: `calendaruser_${Date.now()}`,
  email: `${Date.now()}@calendar.com`,
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

describe("Calendar API", () => {
  it("GET /api/calendar should return hydration data array", (done) => {
    chai.request(app)
      .get("/api/calendar")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("hydrationData").that.is.an("array");
        done();
      });
  });
});


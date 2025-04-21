const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
const testUser = {
  username: `notifyuser_${Date.now()}`,
  email: `${Date.now()}@notify.com`,
  password: "123456"
};

before((done) => {
  chai.request(app)
    .post("/api/auth/signup")
    .send(testUser)
    .end(() => {
      chai.request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password })
        .end((err, res) => {
          authToken = res.body.token;
          done();
        });
    });
});

after(async () => {
  await User.deleteOne({ username: testUser.username });
});

describe("Notification Preferences", () => {
  it("should return 400 if notificationsEnabled is missing", (done) => {
    chai.request(app)
      .post("/api/MyAccount/account/notifications")
      .set("Authorization", `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Missing 'notificationsEnabled' field");
        done();
      });
  });

  it("should enable notifications", (done) => {
    chai.request(app)
      .post("/api/MyAccount/account/notifications")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ notificationsEnabled: true })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("enabled");
        done();
      });
  });

  it("should disable notifications", (done) => {
    chai.request(app)
      .post("/api/MyAccount/account/notifications")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ notificationsEnabled: false })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("disabled");
        done();
      });
  });
});

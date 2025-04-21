const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

const fakeUser = {
  username: `authuser_${Date.now()}`,
  email: `authuser_${Date.now()}@mail.com`,
  password: "secure123"
};

describe("Auth API", () => {
  after(async () => {
    await User.deleteOne({ username: fakeUser.username });
  });

  it("should sign up a new user", (done) => {
    chai.request(app)
      .post("/api/auth/signup")
      .send(fakeUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should not sign up a user with missing fields", (done) => {
    chai.request(app)
      .post("/api/auth/signup")
      .send({ username: "nouser" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should log in the new user", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({ username: fakeUser.username, password: fakeUser.password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should fail to log in with wrong credentials", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({ username: "wronguser", password: "wrongpass" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should return message for forgot password", (done) => {
    chai.request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "someone@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });
});


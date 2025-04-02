const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Auth API", () => {
  it("should sign up a new user", done => {
    chai.request(app)
      .post("/api/auth/signup")
      .send({
        username: "testuser123",
        email: "testuser123@example.com",
        password: "securepassword"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it("should NOT sign up a user with missing fields", done => {
    chai.request(app)
      .post("/api/auth/signup")
      .send({
        username: "noemail"
        // missing email and password
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should log in an existing user", done => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser123",
        password: "securepassword"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it("should fail to log in with wrong credentials", done => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        username: "wronguser",
        password: "wrongpass"
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should return message for forgot password", done => {
    chai.request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "anyemail@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });
});

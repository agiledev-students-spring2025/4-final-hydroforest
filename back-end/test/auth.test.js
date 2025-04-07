const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const path = require("path");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

// Path to the newUser.json file (make sure the filename matches exactly)
const newUserFilePath = path.join(__dirname, '../mock-data/newUser.json');

// Clear newUser.json before each test
beforeEach(() => {
  // Remove newUser.json if it exists, so that login doesn't pick up stale data.
  if (fs.existsSync(newUserFilePath)) {
    fs.unlinkSync(newUserFilePath);
  }
});

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

  it("should log in an existing user (from data.json)", done => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "1234"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it("should log in a newly signed up user", done => {
    // First sign up a new user
    chai.request(app)
      .post("/api/auth/signup")
      .send({
        username: "newuser",
        email: "newuser@example.com",
        password: "newpass"
      })
      .end((err, signupRes) => {
        expect(signupRes).to.have.status(200);
        // Now attempt to log in using the same credentials.
        chai.request(app)
          .post("/api/auth/login")
          .send({
            username: "newuser",
            password: "newpass"
          })
          .end((err, loginRes) => {
            expect(loginRes).to.have.status(200);
            expect(loginRes.body.success).to.be.true;
            done();
          });
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

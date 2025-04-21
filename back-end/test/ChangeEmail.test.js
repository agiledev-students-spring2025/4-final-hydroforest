const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
let currentEmail;
const testUser = {
  username: `emailuser_${Date.now()}`,
  email: `${Date.now()}@email.com`,
  password: "123456"
};

before((done) => {
  currentEmail = testUser.email;
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

describe("Change Email API", () => {
  it("should return 400 if required fields are missing", (done) => {
    chai.request(app)
      .post("/api/ChangeEmail/change-email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should return 400 if currentEmail does not match", (done) => {
    chai.request(app)
      .post("/api/ChangeEmail/change-email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentEmail: "wrong@email.com",
        newEmail: "updated@email.com"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.include("does not match");
        done();
      });
  });

  it("should return 200 and update email successfully", (done) => {
    chai.request(app)
      .post("/api/ChangeEmail/change-email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentEmail: currentEmail,
        newEmail: `updated_${Date.now()}@email.com`
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("Email updated successfully");
        done();
      });
  });
});


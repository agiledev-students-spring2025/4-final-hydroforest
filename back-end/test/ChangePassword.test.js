const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../database/User");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;
const testUser = {
  username: `pwuser_${Date.now()}`,
  email: `${Date.now()}@pw.com`,
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

describe("Change Password API", () => {
  it("should return 400 if required fields are missing", (done) => {
    chai.request(app)
      .post("/api/ChangePassword/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 400 if new password and re-entered password do not match", (done) => {
    chai.request(app)
      .post("/api/ChangePassword/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: testUser.password,
        newPassword: "newpass123",
        reEnterNewPassword: "wrongpass"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 401 if current password is incorrect", (done) => {
    chai.request(app)
      .post("/api/ChangePassword/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "wrongpw",
        newPassword: "newpass123",
        reEnterNewPassword: "newpass123"
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 200 and successfully update the password", (done) => {
    chai.request(app)
      .post("/api/ChangePassword/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: testUser.password,
        newPassword: "newpass123",
        reEnterNewPassword: "newpass123"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("successfully");
        done();
      });
  });
});


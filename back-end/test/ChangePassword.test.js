const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Path to your Express app


chai.use(chaiHttp);
const expect = chai.expect;

describe("Change Password API", () => {
  it("should return 400 if required fields are missing", (done) => {
    chai
      .request(app)
      .post("/api/ChangePassword/change-password")
      .send({}) // Empty body
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("success", false);
        expect(res.body.message).to.equal("Missing fields");
        done();
      });
  });

  it("should return 400 if new password and re-entered password do not match", (done) => {
    const invalidBody = {
      currentPassword: "1234",
      newPassword: "newpassword123",
      reEnterNewPassword: "mismatchpassword",
    };

    chai
      .request(app)
      .post("/api/ChangePassword/change-password")
      .send(invalidBody)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("success", false);
        expect(res.body.message).to.include("do not match");
        done();
      });
  });

  it("should return 401 if the current password is incorrect", (done) => {
    const invalidBody = {
      currentPassword: "wrongpassword",
      newPassword: "newpassword123",
      reEnterNewPassword: "newpassword123",
    };

    chai
      .request(app)
      .post("/api/ChangePassword/change-password")
      .send(invalidBody)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("success", false);
        expect(res.body.message).to.equal("Current password is incorrect");
        done();
      });
  });

  it("should return 200 and successfully update the password", (done) => {
    const validBody = {
      currentPassword: "1234",
      newPassword: "newpassword123",
      reEnterNewPassword: "newpassword123",
    };

    chai
      .request(app)
      .post("/api/ChangePassword/change-password")
      .send(validBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.message).to.equal("Password changed successfully!");
        done();
      });
  });
});

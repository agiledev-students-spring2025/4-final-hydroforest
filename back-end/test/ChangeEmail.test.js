const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); 


chai.use(chaiHttp);
const expect = chai.expect;

describe("Change Email Route", () => {
  it("should return 400 if required fields are missing", (done) => {
    chai
      .request(app)
      .post("/api/ChangeEmail/change-email")
      .send({}) // Empty body
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("success", false);
        expect(res.body.message).to.equal("Missing fields");
        done();
      });
  });

  it("should return 404 if current email is not found", (done) => {
    const invalidBody = {
      currentEmail: "wrongemail@example.com",
      newEmail: "newemail@example.com",
    };

    chai
      .request(app)
      .post("/api/ChangeEmail/change-email")
      .send(invalidBody)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("success", false);
        expect(res.body.message).to.equal("Current email not found");
        done();
      });
  });

  it("should return 200 and update the email successfully", (done) => {
    const validBody = {
      currentEmail: "test@example.com",
      newEmail: "newemail@example.com",
    };

    chai
      .request(app)
      .post("/api/ChangeEmail/change-email")
      .send(validBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.message).to.include("Verification email has been sent to:");
        done();
      });
  });
});

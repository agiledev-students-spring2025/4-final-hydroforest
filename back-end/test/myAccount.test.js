const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Ensure your app exports the Express instance

chai.use(chaiHttp);
const expect = chai.expect;

describe("My Account API Additional Branch Tests", () => {
  // Test for update route when both email and password are missing
  it("POST /api/MyAccount/account/update should return 400 when neither email nor password is provided", (done) => {
    chai.request(app)
      .post("/api/MyAccount/account/update")
      .send({}) // no email or password provided
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Missing fields. Provide 'email' or 'password' to update.");
        done();
      });
  });

  // Test for update route when only password is provided (to cover password branch)
  it("POST /api/MyAccount/account/update should update the password successfully", (done) => {
    const requestBody = { password: "newsecurepassword" };
    chai.request(app)
      .post("/api/MyAccount/account/update")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("Profile updated successfully");
        done();
      });
  });

  // Test for notifications route when notificationsEnabled is missing
  it("POST /api/MyAccount/account/notifications should return 400 when notificationsEnabled is not provided", (done) => {
    chai.request(app)
      .post("/api/MyAccount/account/notifications")
      .send({}) // missing notificationsEnabled
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Missing 'notificationsEnabled' field");
        done();
      });
  });
});




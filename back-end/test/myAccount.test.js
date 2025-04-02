const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); 


chai.use(chaiHttp);
const expect = chai.expect;

describe("My Account API", () => {
  it("GET /api/MyAccount/account should return account details", (done) => {
    chai
      .request(app)
      .get("/api/MyAccount/account")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").to.be.true;
        expect(res.body.data).to.have.property("username", "LiTheLegend");
        done();
      });
  });

  it("POST /api/MyAccount/account/notifications should toggle notifications", (done) => {
    const requestBody = { notificationsEnabled: false }; // Example data

    chai
      .request(app)
      .post("/api/MyAccount/account/notifications")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").to.be.true;
        expect(res.body.message).to.include("disabled");
        done();
      });
  });

  it("POST /api/MyAccount/account/update should update profile", (done) => {
    const requestBody = { email: "newemail@example.com" };

    chai
      .request(app)
      .post("/api/MyAccount/account/update")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").to.be.true;
        expect(res.body.message).to.include("Profile updated successfully!");
        done();
      });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Ensure your app exports the Express instance

chai.use(chaiHttp);
const expect = chai.expect;

describe("My Account API", () => {
  it("GET /api/MyAccount/account should return account details", (done) => {
    chai
      .request(app)
      .get("/api/MyAccount/account")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").that.is.true;
        // Adjust expected username to match the first user in your data (e.g., "testuser")
        expect(res.body.data).to.have.property("username").that.equals("testuser");
        expect(res.body.data).to.have.property("email").that.equals("testuser1234@gmail.com");
        expect(res.body.data).to.have.property("plantLevel");
        expect(res.body.data).to.have.property("longestStreak");
        expect(res.body.data).to.have.property("currentStreak");
        expect(res.body.data).to.have.property("totalWaterLogged");
        expect(res.body.data).to.have.property("notificationsEnabled");
        done();
      });
  });

  it("POST /api/MyAccount/account/notifications should toggle notifications", (done) => {
    const requestBody = { notificationsEnabled: false };
    chai
      .request(app)
      .post("/api/MyAccount/account/notifications")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").that.is.true;
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
        expect(res.body).to.have.property("success").that.is.true;
        expect(res.body.message).to.include("Profile updated successfully");
        done();
      });
  });
});



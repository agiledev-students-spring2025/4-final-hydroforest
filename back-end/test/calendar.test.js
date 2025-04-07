const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Make sure this points to where your Express app is

chai.use(chaiHttp);
const expect = chai.expect;

describe("Calendar API", () => {
  it("GET /api/calendar should return hydration data array", (done) => {
    chai
      .request(app)
      .get("/api/calendar")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("hydrationData");
        expect(res.body.hydrationData).to.be.an("array");
        done();
      });
  });

  it("POST /api/calendar should accept new hydration data", (done) => {
    const requestBody = {
      date: "2025-04-06",
      cups: 5
    };

    chai
      .request(app)
      .post("/api/calendar")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include("Mock hydration data received");
        done();
      });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe("Home API", function() {
  describe("GET /api/Home/data", function() {
    it("should return home data with user, trees, selectedTree, totalIntake, currentStage, and hasUnlockedTree", function(done) {
      chai.request(app)
        .get("/api/Home/data")
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("user");
          expect(res.body).to.have.property("trees");
          expect(res.body).to.have.property("selectedTree");
          expect(res.body).to.have.property("totalIntake");
          expect(res.body).to.have.property("currentStage");
          expect(res.body).to.have.property("hasUnlockedTree");
          done();
        });
    });
  });

  describe("POST /api/Home/log-water", function() {
    it("should return 400 for an invalid water amount", function(done) {
      chai.request(app)
        .post("/api/Home/log-water")
        .send({ amount: -100 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("should update hydration data for a valid water amount", function(done) {
      // Sending 240 ml (1 cup) as a valid amount.
      chai.request(app)
        .post("/api/Home/log-water")
        .send({ amount: "240" })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("totalIntake");
          expect(res.body).to.have.property("currentStage");
          expect(res.body).to.have.property("hasUnlockedTree");
          // Optionally, check that totalIntake is a number
          expect(res.body.totalIntake).to.be.a("number");
          done();
        });
    });
  });

  describe("POST /api/Home/select-tree", function() {
    it("should return 400 for an invalid tree selection", function(done) {
      chai.request(app)
        .post("/api/Home/select-tree")
        .send({ selectedTree: "InvalidTreeName" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("should update the tree selection for a valid tree", function(done) {
      // Use a valid tree name from your unlockableTrees list (e.g., "Misty Bonsai")
      chai.request(app)
        .post("/api/Home/select-tree")
        .send({ selectedTree: "Misty Bonsai" })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("selectedTree").that.equals("Misty Bonsai");
          done();
        });
    });
  });
});



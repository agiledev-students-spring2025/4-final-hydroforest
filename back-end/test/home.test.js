const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../app"); // Ensure this is your Express app
const home = require("../routes/home"); // Now contains { router, getTreeStage, ... }

chai.use(chaiHttp);

const today = require("../routes/home").getTodayDate();

beforeEach(() => {
 const userData = require("../mock-data/data.json");
  // Remove any hydration record for today.
  userData.hydrationData = userData.hydrationData.filter(record => record.date !== today);
  // Reset the selected tree so that it doesn’t conflict with the test.
  delete userData.selectedTree;
});

describe("Home Routes & Helper Functions", function() {
  // ---------------------------
  // Helper Function Tests
  // ---------------------------
  describe("Helper Functions", () => {
    it("should return correct tree stage based on water intake (in ml)", () => {
      // Using exported helper: getTreeStage
      expect(home.getTreeStage(200)).to.equal("seed");
      expect(home.getTreeStage(500)).to.equal("sprout");
      expect(home.getTreeStage(1000)).to.equal("seedling");
      expect(home.getTreeStage(1500)).to.equal("sapling");
      expect(home.getTreeStage(2000)).to.equal("adult tree");
    });

    it("should return today's date in format YYYY-MM-DD", () => {
      const dateStr = home.getTodayDate();
      expect(dateStr).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  // ---------------------------
  // Endpoint Tests
  // ---------------------------
  describe("GET /api/Home/data", function() {
    it("should return an object with user, trees, selectedTree, totalIntake, currentStage, and hasUnlockedTree", function(done) {
      chai.request(app)
        .get("/api/Home/data")
        .end((err, res) => {
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
        .send({ amount: "-100" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error");
          done();
        });
    });

    it("should update hydration record with valid amount", function(done) {
      // Sending 500 ml as a valid amount.
      chai.request(app)
        .post("/api/Home/log-water")
        .send({ amount: "500" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("totalIntake");
          expect(res.body.totalIntake).to.be.at.least(500);
          expect(res.body).to.have.property("currentStage");
          done();
        });
    });

    it("should unlock tree when reaching 1920ml", function(done) {
      // Log enough water to cross the threshold.
      chai.request(app)
        .post("/api/Home/log-water")
        .send({ amount: "1920" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.hasUnlockedTree).to.be.true;
          expect(res.body.justUnlocked).to.be.true;
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
      // Use a valid tree from your unlockableTrees array.
      chai.request(app)
        .post("/api/Home/select-tree")
        .send({ selectedTree: "Misty Bonsai" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.selectedTree).to.equal("Misty Bonsai");
          done();
        });
    });

    it("should prevent changing tree after unlock", function(done) {
      // First, log water to unlock the tree.
      chai.request(app)
        .post("/api/Home/log-water")
        .send({ amount: "1920" })
        .end(() => {
          // Then attempt to change the tree.
          chai.request(app)
            .post("/api/Home/select-tree")
            .send({ selectedTree: "Maple" })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.have.property("error");
              done();
            });
        });
    });
  });
});





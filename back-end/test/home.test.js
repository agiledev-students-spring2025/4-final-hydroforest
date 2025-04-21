const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../app");
const User = require("../database/User");
const { getTodayDate, getTreeStage } = require("../routes/home");

chai.use(chaiHttp);

const today = getTodayDate();
let authToken;
const testUser = {
  username: `fakeuser_${Date.now()}`,
  email: `${Date.now()}@test.com`,
  password: "123456"
};

before((done) => {
  chai.request(app)
    .post("/api/auth/signup")
    .send(testUser)
    .end((err, res) => {
      expect(res).to.have.status(200);
      chai.request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password })
        .end((err2, res2) => {
          expect(res2).to.have.status(200);
          authToken = res2.body.token;
          done();
        });
    });
});

after(async () => {
  await User.deleteOne({ username: testUser.username });
});

describe("Home API Routes", () => {
  describe("Helper Functions", () => {
    it("should return correct tree stage", () => {
      expect(getTreeStage(200)).to.equal("seed");
      expect(getTreeStage(800)).to.equal("sprout");
      expect(getTreeStage(1200)).to.equal("seedling");
      expect(getTreeStage(1700)).to.equal("sapling");
      expect(getTreeStage(2000)).to.equal("adultTree");
    });

    it("should return today's date in YYYY-MM-DD format", () => {
      expect(today).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("/api/Home/data", () => {
    it("should return user hydration and tree data", (done) => {
      chai.request(app)
        .get("/api/Home/data")
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.keys(["user", "trees", "selectedTree", "totalIntake", "currentStage", "hasUnlockedTree", "treeImage"]);
          done();
        });
    });
  });

  describe("/api/Home/log-water", () => {
    it("should reject negative amount", (done) => {
      chai.request(app)
        .post("/api/Home/log-water")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ amount: -100 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("should log valid amount", (done) => {
      chai.request(app)
        .post("/api/Home/log-water")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ amount: 480 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("totalIntake");
          expect(res.body).to.have.property("treeImage");
          done();
        });
    });
  });

  describe("/api/Home/select-tree", () => {
    it("should return 400 for invalid tree name", (done) => {
      chai.request(app)
        .post("/api/Home/select-tree")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ selectedTree: "FakeTree" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});

describe("Forest API Route", () => {
  it("should return hydrationData", (done) => {
    chai.request(app)
      .get("/api/forest")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("hydrationData");
        expect(res.body.hydrationData).to.be.an("array");
        done();
      });
  });
});






const chai = require("chai");
const chaiHttp = require("chai-http");
const path = require("path");
const fs = require("fs");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

const dataFilePath = path.join(__dirname, "../mock-data/data.json");

describe("GET /api/forest", function () {
  // Clear the require cache for the data file to force a fresh load
  beforeEach(() => {
    delete require.cache[require.resolve("../mock-data/data.json")];
  });

  it("should return the hydration data from the JSON file", done => {
    // Create mock hydration data in the same format as expected by forest.js
    const mockData = {
      hydrationData: [
        { date: "2025-04-01", amount: 2000, unlockedPlant: "Sunleaf" },
        { date: "2025-04-02", amount: 1500, unlockedPlant: "Aqua Fern" },
        { date: "2025-04-03", amount: 1800, unlockedPlant: "Hydro Cactus" },
        { date: "2025-04-04", amount: 2200, unlockedPlant: "Blooming Berry" },
        { date: "2025-04-05", amount: 1800, unlockedPlant: "Misty Bonsai" }
      ]
    };

    // Write the mock data to the file that forest.js reads from
    fs.writeFileSync(dataFilePath, JSON.stringify(mockData, null, 2), "utf8");

    chai.request(app)
      .get("/api/forest")
      .end((err, res) => {
        expect(res).to.have.status(200);
        // The response should exactly match the mock data we wrote.
        expect(res.body).to.deep.equal(mockData);
        done();
      });
  });

  // If you want to simulate error handling, you'll need to modify forest.js.
  // Since forest.js currently doesn't handle file read errors, we omit an error test.
});


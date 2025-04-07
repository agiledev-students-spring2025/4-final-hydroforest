const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /api/forest", function () {
  it("should return the data from the JSON file", done => {
    const mockData = { key: "value" };

    fs.writeFileSync("./data.json", JSON.stringify(mockData));

    chai.request(app)
      .get("/api/forest")  
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.body).to.deep.equal(mockData); 
        done();
      });
  });

  it("should handle errors when reading the file", done => {
    fs.renameSync("./data.json", "./data.json.bak");

    chai.request(app)
      .get("/api/forest")  
      .end((err, res) => {
        expect(res).to.have.status(500);  
        expect(res.body).to.have.property("error", "Failed to read file"); // Expected error message

        fs.renameSync("./data.json.bak", "./data.json");
        done();
      });
  });
});

// tests/home.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app
const homeRoutes = require('../routes/home');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Home Routes', () => {
  // Test helper functions
  describe('Helper Functions', () => {
    it('should return correct tree stage based on water intake', () => {
      const { getTreeStage } = homeRoutes;
      expect(getTreeStage(200)).to.equal('seed');
      expect(getTreeStage(500)).to.equal('sprout');
      expect(getTreeStage(1000)).to.equal('seedling');
      expect(getTreeStage(1500)).to.equal('sapling');
      expect(getTreeStage(2000)).to.equal('adult tree');
    });

    it('should get today\'s date in correct format', () => {
      const { getTodayDate } = homeRoutes;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(getTodayDate()).to.match(dateRegex);
    });
  });

  // Test GET /data endpoint
  describe('GET /api/Home/data', () => {
    it('should return user and tree data', (done) => {
      chai.request(app)
        .get('/api/Home/data')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('user');
          expect(res.body).to.have.property('trees');
          expect(res.body).to.have.property('selectedTree');
          expect(res.body).to.have.property('totalIntake');
          expect(res.body).to.have.property('currentStage');
          done();
        });
    });
  });

  // Test POST /log-water endpoint
  describe('POST /api/Home/log-water', () => {
    it('should update hydration record with valid amount', (done) => {
      chai.request(app)
        .post('/api/Home/log-water')
        .send({ amount: '500' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('totalIntake');
          expect(res.body).to.have.property('currentStage');
          expect(res.body.totalIntake).to.be.at.least(500);
          done();
        });
    });

    it('should return error with invalid amount', (done) => {
      chai.request(app)
        .post('/api/Home/log-water')
        .send({ amount: '-100' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should unlock tree when reaching 1920ml', (done) => {
      // First log enough water to unlock
      chai.request(app)
        .post('/api/Home/log-water')
        .send({ amount: '1920' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.hasUnlockedTree).to.be.true;
          expect(res.body.justUnlocked).to.be.true;
          done();
        });
    });
  });

  // Test POST /select-tree endpoint
  describe('POST /api/Home/select-tree', () => {
    it('should update selected tree', (done) => {
      chai.request(app)
        .post('/api/Home/select-tree')
        .send({ selectedTree: 'oak' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.selectedTree).to.equal('oak');
          done();
        });
    });

    it('should prevent changing tree after unlock', (done) => {
      // First log enough water to unlock
      chai.request(app)
        .post('/api/Home/log-water')
        .send({ amount: '1920' })
        .end(() => {
          // Then try to change tree
          chai.request(app)
            .post('/api/Home/select-tree')
            .send({ selectedTree: 'maple' })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error');
              done();
            });
        });
    });
  });
});




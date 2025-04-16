const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  stages: {
    seed: { type: String, required: true },
    sprout: { type: String, required: true },
    seedling: { type: String, required: true },
    sapling: { type: String, required: true },
    adultTree: { type: String, required: true }
  }
});

module.exports = mongoose.model('Tree', treeSchema);

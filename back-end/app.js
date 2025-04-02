const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const socialRoutes = require('./routes/social');
const leaderboardRoutes = require('./routes/leaderboard');

app.use('/api/social', socialRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;


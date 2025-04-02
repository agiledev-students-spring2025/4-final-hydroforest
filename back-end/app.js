const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Config
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }));

app.use(express.json());

const socialRoutes = require('./routes/social');
const leaderboardRoutes = require('./routes/leaderboard');
const changeEmailRoutes = require('./routes/ChangeEmail');
const changePasswordRoutes = require('./routes/ChangePassword');
const myAccountRoutes = require('./routes/MyAccount');


app.use('/api/social', socialRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ChangePassword', changePasswordRoutes);
app.use('/api/ChangeEmail', changeEmailRoutes);
app.use('/api/MyAccount', myAccountRoutes);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }  

module.exports = app;


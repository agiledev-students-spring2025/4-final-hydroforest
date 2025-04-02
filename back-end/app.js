import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configurations
dotenv.config();
const app = express();

// CORS Config
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to HydroForest')
});
// Routes
import socialRoutes from './routes/social.js';
import leaderboardRoutes from './routes/leaderboard.js';
import changeEmailRoutes from './routes/ChangeEmail.js';
import changePasswordRoutes from './routes/ChangePassword.js';
import myAccountRoutes from './routes/MyAccount.js';

app.use('/api/social', socialRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ChangePassword', changePasswordRoutes);
app.use('/api/ChangeEmail', changeEmailRoutes);
app.use('/api/MyAccount', myAccountRoutes);




export default app;

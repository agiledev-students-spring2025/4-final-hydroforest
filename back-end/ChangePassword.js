// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // For environment variables

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock user data (for demonstration purposes)
let userEmail = "junli123@email.com"; // Current email stored in the mock data

// GET route to fetch current email
app.get('/api/current-email', (req, res) => {
    res.status(200).send({ email: userEmail });
});

// POST route to update email
app.post('/api/change-email', (req, res) => {
    const { currentEmail, newEmail } = req.body;

    // Check if current email matches the stored email
    if (currentEmail === userEmail) {
        // Update the email
        userEmail = newEmail;

        // Send a response (e.g., confirmation message)
        res.status(200).send({
            success: true,
            message: `Verification email sent to: ${newEmail}`
        });
    } else {
        // Respond with an error if current email does not match
        res.status(400).send({
            success: false,
            message: "Current email does not match our records."
        });
    }
});

// Instructions to start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

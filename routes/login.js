let express = require('express');
let router = express.Router();

// Import the pool variable from app.js
const { pool } = require('../app');
const bcrypt = require("bcrypt");



router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the incoming data (You can add more validation as per your requirements)
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required fields.' });
        }

        // Retrieve the hashed password from the database using the provided email
        const connection = await pool.getConnection();
        const query = 'SELECT password FROM users WHERE email = ?';
        const [rows] = await connection.query(query, [email]);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const hashedPassword = rows[0].password;

        // Compare the user-provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Password is valid, so proceed with the login logic
        // ... (e.g., generate a JWT token, set session, etc.)

        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error occurred during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
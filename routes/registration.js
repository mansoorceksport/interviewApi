let express = require('express');
let router = express.Router();

// Import the pool variable from app.js
const { pool } = require('../app');
const bcrypt = require("bcrypt");

// Regular expression for valid email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression for valid password format (minimum 8 characters, with alphabet, number, and special character)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the incoming data (You can add more validation as per your requirements)
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required fields.' });
        }

        // Validate email format using regular expression
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Validate password format using regular expression
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Invalid password format. Password must be at least 8 characters long and must contain at least one alphabet, one number, and one special character.' });
        }

        // Check if the email already exists in the database
        const connection = await pool.getConnection();
        let query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await connection.query(query, [email]);
        connection.release();

        if (rows.length > 0) {
            return res.status(409).json({ error: 'Email already exists. Please choose a different email.' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10); // Using salt rounds = 10

        // Insert the user data into the database
        query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        await connection.query(query, [email, hashedPassword]);
        connection.release();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;
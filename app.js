const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '0.0.0.0',
    port: 3307,
    user: 'root',
    password: 'Admin123',
    database: 'hex_test',
};

// Create a pool of connections to MySQL
const pool = mysql.createPool(dbConfig);

// Export the pool variable
module.exports.pool = pool;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to handle ping-pong request (for testing server and database connection)
app.get('/ping', async (req, res) => {
    try {
        // Attempt to execute a simple query to the database
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();

        res.json({ message: 'pong' });
    } catch (error) {
        console.error('Error occurred during ping-pong request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);

module.exports = app;

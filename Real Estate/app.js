// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8081;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost", // Change this if your database is hosted elsewhere
    user: "root", // Your MySQL username
    password: "Jana@9047", // Your MySQL password
    database: "Student" // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// Welcome route
app.get('/', (req, res) => {
    res.send("Welcome to the Real Estate API!");
});

// GET all properties
app.get('/api/properties', (req, res) => {
    const sql = "SELECT * FROM Estate";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST a new property
app.post('/api/properties', (req, res) => {
    const { name, address, price } = req.body;
    const sql = "INSERT INTO Estate (name, address, price) VALUES (?, ?, ?)";
    db.query(sql, [name, address, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Property added', propertyId: result.insertId });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

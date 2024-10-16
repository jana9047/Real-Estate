const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 9091;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Use your MySQL username
    password: 'Jana@9047', // Use your MySQL password
    database: 'Student' // Ensure the 'Student' database is created in MySQL
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// GET properties (Read)
app.get('/api/properties', (req, res) => {
    db.query('SELECT * FROM Estate', (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// POST property (Create)
app.post('/api/properties', (req, res) => {
    const { propertyName, propertyAddress, propertyPrice } = req.body;
    db.query('INSERT INTO Estate (name, address, price) VALUES (?, ?, ?)',
        [propertyName, propertyAddress, propertyPrice],
        (err, results) => {
            if (err) {
                console.error('Error adding property:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Property added successfully', id: results.insertId });
            }
        });
});

// DELETE property (Delete)
app.delete('/api/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    db.query('DELETE FROM Estate WHERE id = ?', [propertyId], (err, results) => {
        if (err) {
            console.error('Error deleting property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property deleted successfully' });
        }
    });
});

// Server listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

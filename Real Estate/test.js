const express = require('express');
const app = express();
const PORT = 8081;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory (if your HTML files are in there)
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Real Estate API!');
});

// Add your other CRUD routes here
app.get('/api/properties', (req, res) => {
    // Code to fetch properties from the database
});

app.post('/api/properties', (req, res) => {
    // Code to add a property to the database
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

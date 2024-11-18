const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'portfolio', // Database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// API to Save User Data
app.post('/api/save-user', (req, res) => {
    const { name, age, image } = req.body;

    if (!name || !age || !image) {
        return res.status(400).send('Missing required fields');
    }

    // Save Base64 image as a file
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(__dirname, 'uploads', `${name}-${Date.now()}.png`);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Failed to save image:', err);
            return res.status(500).send('Failed to save image');
        }

        // Save data to MySQL
        const query = 'INSERT INTO visitors (name, age, image) VALUES (?, ?, ?)';
        db.query(query, [name, age, filePath], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Failed to save data');
            }
            res.send('User data saved successfully!');
        });
    });
});

// API to Retrieve All Users
app.get('/api/get-users', (req, res) => {
    const query = 'SELECT * FROM visitors';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Failed to retrieve data');
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());


const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',  
    password: 'Test4091', 
    database: 'new'
});


connection.connect();


app.post('/create', (req, res) => {
    const { name, domain } = req.body;
    const subdomainURL = `${name}.${domain}`;

    connection.query('INSERT INTO users (name, domain) VALUES (?, ?)', [name, subdomainURL], (error, results) => {
        if (error) throw error;
        res.json({ message: 'User created successfully.' });
    });
});


app.use((req, res, next) => {
    const subdomain = req.subdomains[0];
    if (subdomain) {
        connection.query('SELECT name FROM users WHERE domain = ?', [subdomain], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.json({ name: results[0].name });
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        });
    } else {
        next(); 
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

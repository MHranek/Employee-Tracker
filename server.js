// Requires
const express = require('express');
const mysql = require('mysql2');
const index = require('./index');

// server setup
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mysql database connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'B00tc@mp',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db database')
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
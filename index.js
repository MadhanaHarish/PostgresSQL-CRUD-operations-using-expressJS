const express = require('express');
const port = 8000;
const Pool = require('pg').Pool;
const bodyparser = require('body-parser');
const path = require('path');

const app = express();


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'harish@2005',
    port: 5432
});

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

pool.query(
    `CREATE TABLE IF NOT EXISTS student (name VARCHAR(50),rollnumber VARCHAR(50),email VARCHAR(50),department VARCHAR(50))`,
    (err, result) => {
        if (err) {
            console.error('Error creating table', err.stack);
        } else {
            console.log('Table is ready or already exists');
        }
    }
);


app.post('/submit', (req, res) => {
    const { name, rollnumber, email, department } = req.body;
    pool.query('INSERT INTO student (name, rollnumber, email, department) VALUES ($1, $2, $3, $4)', [name, rollnumber, email, department], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting data');
            return console.error('Error executing query', err.stack);
        }
        res.send('Data inserted successfully');
    });
});



app.listen(port, ()=> {
    console.log(`server is running on http://localhost:${port}`);
});
const express = require('express');
const port = 8000;
const Pool = require('pg').Pool;
const bodyparser = require('body-parser');
const path = require('path');
const parse = require('parse');

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
    `CREATE TABLE IF NOT EXISTS student (name VARCHAR(50),rollnumber VARCHAR(50) PRIMARY KEY,email VARCHAR(50),department VARCHAR(50))`,
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
    let details;
    pool.query('INSERT INTO student (name, rollnumber, email, department) VALUES ($1, $2, $3, $4)', [name, rollnumber, email, department], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting data');
            return console.error('Error executing query', err.stack);
        }
        res.send('Inserted successfully');
    });
});

app.get('/students', (req, res) => {
    pool.query(`SELECT * FROM student`, (err, result) => {
        if(err){
            res.send('Error occured while displaying');
        }
        res.json(result.rows);
    });
});


app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'responce', 'view.html'));
});

app.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname, 'responce', 'deleteElement.html'));
});

app.get('/exit', (req, res) => {
    pool.query(`drop table student`, (err, result) => {
        if (err) {
            console.error('Error creating table', err.stack);
        } else {
            console.log('Table is ready or already exists');
        }
    });
    res.send('Thank you for accessing our webpage');
});


app.listen(port, ()=> {
    console.log(`server is running on http://localhost:${port}`);
});
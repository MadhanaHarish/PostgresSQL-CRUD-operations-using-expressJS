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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'responce'));


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
    pool.query('INSERT INTO student (name, rollnumber, email, department) VALUES ($1, $2, $3, $4)', [name, rollnumber, email, department], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting data duplicate key value');
            return console.error('Error executing query', err.stack);
        }
        res.sendFile(path.join(__dirname,'./responce','view.html'));
    });
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'responce', 'view.html'));
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

app.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname, 'responce', 'deleteElement.html'));
});

app.get("/deleteElement/:id", (req, res) => {
    pool.query(`DELETE FROM student WHERE rollnumber = $1;`,[req.params.id], (err, result) => {
       if (err) {
           res.send('Error Occured in /deleteElement/:id');
       }
       else {
           res.sendFile(path.join(__dirname, './responce' , 'deleteElement.html'))
       }
    });
});

let updatepart;
app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, 'responce', 'updateElements.html'));
});

app.get('/updateForm/:id', (req, res) => {
    const rollnumber = req.params.id;
    pool.query('SELECT * FROM student WHERE rollnumber = $1', [rollnumber], (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching student data');
        }
        const student = result.rows[0];
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('updateForm', { student });  // Using a template engine like EJS to render the form
    });
});

app.post('/updateElement/:id', (req, res) => {
    const rollnumber = req.params.id;
    const { name, email, department } = req.body;

    pool.query(
        'UPDATE student SET name = $1, email = $2, department = $3 WHERE rollnumber = $4',
        [name, email, department, rollnumber],
        (err, result) => {
            if (err) {
                return res.status(500).send('Error updating student data');
            }
            res.sendFile(path.join(__dirname, './responce', 'updateElements.html'));
        }
    );
});


app.get('/students', async (req, res) => {
    await pool.query(`SELECT * FROM student`, (err, result) => {
        if(err){
            res.send('Error occured while displaying');
        }
        res.json(result.rows);
    });
});

app.get('/findElement', async (req, res) => {
    await pool.query(`SELECT * FROM student`, (err, result) => {
        if(err){
            res.send('Error occured while displaying');
        }
        res.json(result.rows);
    });
});

app.get("/updateElement/:id", (req, res) => {
    pool.query(`DELETE FROM student WHERE rollnumber = $1;`,[req.params.id], (err, result) => {
        if (err) {
            res.send('Error Occured in /deleteElement/:id');
        }
        else {
            res.sendFile(path.join(__dirname, './responce' , 'updateElement.html'))
        }
    });
});

app.listen(port, ()=> {
    console.log(`server is running on http://localhost:${port}`);
});
// create web server
// npm install express
// npm install body-parser
// npm install mysql
// npm install cors
// npm install nodemon
// npm install dotenv
// npm install express-validator

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((error) => {
    if (error) {
        console.log(error.message);
    }
    console.log('MySQL connected...');
});

app.get('/', (req, res) => {
    res.send('Welcome to the comments API');
});

// get all comments
app.get('/comments', (req, res) => {
    const sql = 'SELECT * FROM comments';
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error.message);
        }
        res.send(result);
    });
});

// get a comment
app.get('/comments/:id', (req, res) => {
    const sql = 'SELECT * FROM comments WHERE id = ?';
    db.query(sql, [req.params.id], (error, result) => {
        if (error) {
            console.log(error.message);
        }
        res.send(result);
    });
});

// add a comment
app.post('/comments', [
    check('name').isLength({ min: 3 }),
    check('email').isEmail(),
    check('comment').isLength({ min: 3 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const sql = 'INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)';
    db.query(sql, [req.body.name, req.body.email, req.body.comment], (error, result) => {
        if (error) {
            console.log(error.message);
        }
        res.send(result);
    });
});

// update
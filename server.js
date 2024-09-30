// DEclare dependences / variables

const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const { threadId } = require('worker_threads');
const cors = require('cors')

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database ***

const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

// check if db connection works
db.connect((err) => {
    // No wedding today
    if(err) return console.log("Error connecting to the database");

    // Yes wedding conneted
    console.log("Conneted to mysql successfully as id: ", db.threadId);

    // Main code
    // Get Method
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    

    app.get('/providers', (req,res) => {
        db.query('SELECT * FROM providers', (err, results) => {
            if (err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else {
                // DIsplay records
                res.render('providers', {results: results});
            }
        });
    });


    app.get('/patients', (req,res) => {
        db.query('SELECT * FROM patients', (err, results) => {
            if (err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else {
                // DIsplay records
                res.render('patients', {results: results});
            }
        });
    });
   


    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Send a message to the browser
        console.log('Sending message to browser...');
        app.get('/', (req,res) => {
            res.send('Server started successfully! Wedding can go on')
        })
    });
})


const express = require('express');
const mariadb = require('mariadb');
const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1695', // Change your password for your database here.
    database: 'miniblog'
});

async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database ' + err);
    }
};

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static('views'));

app.set('view engine', 'ejs');

// The Home page, where the user enters in their post
app.get('/', (req, res) => {
    console.log("Homepage - server!");
    
    res.render('home');
});

app.post('/submit', async (req, res) => {
    //Vars
    const data = req.body;
    console.log(data);
    const conn = await connect();
    const errors = {
        title: null,
        content: null,
    };
    //Functions
    let validationBools = {
        title: true, content: true, author: true,
        check: function(errors) {
            if(this.title === true && this.content === true) {
                return true;
            }
            else {
                if(this.title === false) {
                    errors.title = "Title must be a least six characters."
                }
                if(this.content === false) {
                    errors.content = "Content cannot be empty."
                }
                return false;
            }
        }

    }

    let validationChecks = function(data, validationObject) {
        
        if(data.title.trim().length > 5) {
            validationObject.title = false;
        }
        if(data.content.length > 0) {
            validationObject.content = false;
        }
        if(data.author.trim() == "") {
            validationObject.author = false;
            data.author = null;
        }

    }

    let localInsert = async function(connection) {
        /*
        Eventually, this will need to REALLY be sanitized. 
        We could whitelist operations and sanitize inputs on the server-side.
        My encapsulation will allow for this.
        */
        await connection.query(
        `INSERT INTO posts (author, title, content)
        VALUES ('${data.author}','${data.title}','${data.content}');
        `);
    }

    let updateDB = function(connection, data, validationObject, insertFunction) {
        validationChecks(data, validationObject);
        
        if(validationObject.check() === true) {
            insertFunction(connection);
        }
        else {
            if(!validationObject.title) {
                console.log("Invalid Title");
            }
            if(!validationObject.content) {
                console.log("Invalid Content");
            }
            return;
        }
    }
    //Code

    updateDB(conn, data, validationBools, localInsert);

    res.render('confirmation', { details: data, errors: errors });
});

app.get('/entries' , (req, res) => {
    res.render('entries', { data: posts });
});

app.get('/posts' , (req,res) => {
    res.render('posts', { data: posts });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
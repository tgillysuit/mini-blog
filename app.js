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
    
    const data = req.body;
    console.log(data);

    const conn = await connect();

    await conn.query(`INSERT INTO posts (author, title, content)
    VALUES ('${data.author}','${data.title}','${data.content}');
    `);

    res.render('confirmation', { details: data });
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
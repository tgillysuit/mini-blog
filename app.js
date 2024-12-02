const express = require('express');
const mariadb = require('mariadb');
const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '****',
    database: 'miniblog'
});

async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.error('Error connecting to the database', err);
        throw err;
    }
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('views'));
app.set('view engine', 'ejs');

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Submit a new post
app.post('/submit', async (req, res) => {
    const data = req.body;
    let errors = [];
    const conn = await connect();

    const validationBools = {
        title: true,
        content: true,
        author: true,
        check(errors) {
            if (this.title && this.content) {
                return true;
            }
            if (!this.title) errors.push("Title must be at least six characters.");
            if (!this.content) errors.push("Content cannot be empty.");
            return false;
        }
    };

    function validationChecks(data, validationObject) {
        if (data.title.trim().length <= 5) validationObject.title = false;
        if (data.content.trim().length === 0) validationObject.content = false;
        if (data.author.trim() === "") data.author = null;
    }

    async function localInsert(connection) {
        try {
            await connection.query(
                `INSERT INTO posts (author, title, content)
                VALUES (?, ?, ?)`,
                [data.author, data.title, data.content]
            );
        } catch (err) {
            console.error('Error inserting into database:', err);
            throw err;
        }
    }

    try {
        validationChecks(data, validationBools);

        if (validationBools.check(errors)) {
            await localInsert(conn);
            res.render('confirmation', { details: data, errors: [] });
        } else {
            res.render('home', { details: data, errors });
        }
    } catch (err) {
        console.error('Error during post submission:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release();
    }
});

// Display all entries
app.get('/entries', async (req, res) => {
    const conn = await connect();

    try {
        const posts = await conn.query(`SELECT * FROM posts ORDER BY created_at DESC;`);
        res.render('entries', { data: posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

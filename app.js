const express = require('express');
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static('views'));

app.set('view engine', 'ejs');

// The Home page, where the user enters in their post
app.get('/', (req, res) => {
    console.log("Homepage - server!");
    
    res.render('home');
});

// The Submission page
let posts = [];

app.post('/submit', (req, res) => {
    
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date(Date.now()),
    };

    posts.push(newPost);

    res.render('confirmation', { post: newPost });
});


app.get('/entries' , (req, res) => {
    res.render('entries', { data: posts });
});

app.get('/admin-posts' , (req, res) => {
    res.render('admin-posts', { data: posts });
});

app.get('/posts' , (req,res) => {
    res.render('posts', { data: posts });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
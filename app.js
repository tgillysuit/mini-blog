const express = require('express');
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

let posts = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

});

app.get('/confirm', (req, res) => {
    
});

app.post('/submit', (req, res) => {
    let newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    };
});

app.get('/posts' , (req,res) => {
    res.render('posts', { data : posts });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
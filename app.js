const express = require('express');
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));

// uses for styles sheet
app.use(express.static('public'));

let confirmations = [];

// Setting our view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

});

app.get('/confirm', (req, res) => {
    
});

app.post('/confirm', (req, res) => {
    // Getting input info specfically in html body.
    // console.log(req.body);

    let details = req.body;
    // Sending the confirm page 

    confirmations.push(details);

    console.log(confirmations);

    res.render('confirm', { details: details });
    //res.sendFile(__dirname + '/confirm.html');
});

app.get('/confirmations' , (req,res) => {
    res.render('confirmations', { data : confirmations });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
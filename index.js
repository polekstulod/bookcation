// ? Node modules
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

// ? variables
const app = express();
const port = 3000;

// ? Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ? Database connection
mongoose.connect('mongodb://localhost:27017/bookcation');
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// ? EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ? Routes
// >> Home Route
app.get('/', (req, res) => res.render('home', { title: 'Home' }));

// ? Handle 404
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// ? Server
app.listen(port, () => console.log(`App listening on port ${port}!`));

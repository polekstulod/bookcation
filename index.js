// ? Node modules
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

// ? variables
const app = express();
const port = 3000;
const Listing = require('./models/listing');

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
app.get('/', (req, res) => {
  res.redirect('/listings');
  // res.render('home', { title: 'Home' })
});

// >> Listings Route
app.get('/listings', async (req, res) => {
  const data = await Listing.find();
  res.render('listings', { title: 'Listings', data });
});

app.get('/listing/:id', async (req, res) => {
  const data = await Listing.findById(req.params.id);
  res.render('listings/listing', { title: data.name, data });
});

app.get('/listings/new', (req, res) => {
  res.render('listings/new', { title: 'New Listing' });
});

app.post('/listings', async (req, res) => {
  const listing = new Listing(req.body);

  await listing.save();
  res.redirect('/listings');
});

app.get('/listings/:id/edit', async (req, res) => {
  const data = await Listing.findById(req.params.id);
  res.render('listings/edit', { title: data.name, data });
});

app.put('/listings/:id', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/listing/${listing._id}`);
});

app.delete('/listings/:id', async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
});

app.post('/listings/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  listing.review.push(req.body);
  await listing.save();
  res.redirect(`/listing/${listing._id}`);
});

// ? Handle 404
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// ? Server
app.listen(port, () => console.log(`App listening on port ${port}!`));

const mongoose = require('mongoose');
const Listing = require('../models/listing');
const fetch = require('node-fetch');

mongoose.connect('mongodb://localhost:27017/bookcation');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error...'));
db.once('open', () => {
  console.log('Database connected...');
});

const imageLinks = [];
const generateImageLinks = async () => {
  const response = await fetch(
    'https://api.unsplash.com/search/photos?query=house&per_page=30&page=2&orientation=squarish&client_id=3aMQRxjBt6wDmx77QdlJLwF932G_THjeniRrwsr-2TU'
  );
  const data = await response.json();

  data.results.forEach(result =>
    imageLinks.push({
      image: result.urls.regular,
      description: result.description,
    })
  );
};

const seedDB = async () => {
  await Listing.deleteMany({});

  for (let i = 0; i < 30; i++) {
    const response = await fetch('https://random-data-api.com/api/v2/users');
    const data = await response.json();

    const listing = new Listing({
      name: `${data.first_name} ${data.last_name}`,
      username: data.username,
      description:
        imageLinks[i].description === null
          ? 'mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget felis eget nunc'
          : imageLinks[i].description,
      price: Math.floor(Math.random() * 10000) + 10,
      image: imageLinks[i].image,
      address: `${data.address.street_name} ${data.address.street_address} ${data.address.city} ${data.address.state} ${data.address.zip_code} ${data.address.country}`,
      lat: data.address.coordinates.lat,
      lng: data.address.coordinates.lng,
      createdAt: data.date_of_birth,
    });
    await listing.save();
  }
};

generateImageLinks().then(() =>
  seedDB().then(() => {
    mongoose.connection.close();
    console.log('Database seeded...');
  })
);

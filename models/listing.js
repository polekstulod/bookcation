const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  name: String,
  username: String,
  description: String,
  price: String,
  image: String,
  address: String,
  lat: Number,
  lng: Number,
  review: Array,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);

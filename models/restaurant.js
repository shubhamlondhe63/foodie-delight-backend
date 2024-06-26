
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  openingHours: { // Added opening hours field
    type: String
  },
  contactNumber: { // Added contact number field
    type: String
  },
  category: { // Added category field
    type: String
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu' // Reference the Menu model
  }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

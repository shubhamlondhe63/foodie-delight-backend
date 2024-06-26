const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menu: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Menu', menuSchema);
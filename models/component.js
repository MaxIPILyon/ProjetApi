const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: String,
  title: String,
  specs: String,
  price: Number,
  imageUrl: String,
});

module.exports = mongoose.model('Component', componentSchema);
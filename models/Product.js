const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  numReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);

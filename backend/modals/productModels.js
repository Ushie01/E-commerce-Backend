const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
      type: String
    },
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true
    },
    image: {
      type: String,
      required: [true, 'A product must have an image']
    },
    brand: {
      type: String,
      required: [true, 'A product must have a brand']
    },
    category: {
      type: String,
      required: [true, 'A product must have a category']
    },
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true
    },
    // reviews: [reviewSchema],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    collectionsData: {
      type: String,
    },
    size: [
      {
        type: String,
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    gallery: [
      {
        type: String,
      },
    ],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
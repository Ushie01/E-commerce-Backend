const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String
    },
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true
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
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      default: 0,
    },
    collectionsData: {
      type: String,
    },
    size: {
      type: String,
    },
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
    productGallery: [
      {
        type: String,
        required: [true, 'A product must have an image']
      } 
    ],
    createAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: {virtuals: true}
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});


// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'reviews',
//     select: '-__v -product'
//   });

//   next();
// })

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
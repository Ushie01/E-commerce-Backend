const mongoose = require('mongoose');


const reviewScheme = new mongoose.Schema(
    {
        review: {
            type: String,
            review: [true, 'Review can not be empty']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to a product!']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    }
);

reviewScheme.index({ product: 1, user: 1}, { unique: true });


const Review = mongoose.model('Review', reviewScheme);
module.exports = Review;


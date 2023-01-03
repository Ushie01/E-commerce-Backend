const mongoose = require('mongoose');
const Product = require('./productModels');

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

reviewScheme.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    });

    next();
})

reviewScheme.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRatings: { $avg: '$rating' }
            }
        }
    ]);
    
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRatings
        })   
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
};

reviewScheme.index({ product: 1, user: 1 }, { unique: true });

reviewScheme.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

reviewScheme.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewScheme.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewScheme);
module.exports = Review;


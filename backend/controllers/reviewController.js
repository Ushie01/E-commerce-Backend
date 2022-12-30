const Review = require('../modals/reviewModels');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.setToUserIds = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
}

exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: review
        }
    })
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const review = await Review.find();

    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
            data: review
        }

    })


})

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No document found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError('No document found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: null
        }
    })

});

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new AppError('No document found with that id', 404))
    };

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    });
})
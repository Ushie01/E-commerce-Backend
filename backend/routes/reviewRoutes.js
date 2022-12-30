const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

router.route('/')
    .post(
        // authController.restrictTo('user'),
        reviewController.createReview
    )
    .get(reviewController.getAllReviews);

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(
        // authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )
    .patch(
        // authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    );

module.exports = router;
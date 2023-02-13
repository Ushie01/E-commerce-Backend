const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });


router.use(authController.protect);

router
    .route('/')
    .post(
        authController.restrictTo('user'),
        reviewController.setProductUserIds,
        reviewController.createReview
    )
    .get(
        reviewController.getAllReviews
    );

router
    .route('/:id')
    .delete(
        authController.restrictTo('user'),
        reviewController.deleteReview
    )
    .patch(
        authController.restrictTo('user'),
        reviewController.updateReview
    );

module.exports = router;
const express = require('express');
// const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getImage,
    uploadProductImage
} = require('./../controllers/productController');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router
    .route('/')
    .get(getAllProduct)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        createProduct);
router
    .route('/:id')
    .get(getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        updateProduct)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteProduct);
router.get('/upload', getImage);
router.patch('/upload', uploadProductImage);

router
    .route('/:productId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

module.exports = router;
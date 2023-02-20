const express = require('express');
// const multer = require('multer');
const reviewRouter = require('./../routes/reviewRoutes');
const upload = require('../../upload');
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
} = require('./../controllers/productController');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router();
// const upload = multer({ dest: './../uploads' });


router.use('/:productId/reviews', reviewRouter);
router
    .route('/')
    .get(getAllProduct)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        upload.single('image'),
        createProduct
);
    
router
    .route('/:id')
    .get(getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        upload.array('gallery', 4),
        updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteProduct
    );

router
    .route('/:productId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );


module.exports = router;

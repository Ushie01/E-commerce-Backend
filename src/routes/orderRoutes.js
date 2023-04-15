const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .post(
        authController.restrictTo('user'),
        orderController.setOrderUserIds,
        orderController.createOrder
    )
    .get(orderController.getAllOrders);

router.route('/userOrder/:id').get(orderController.getOrder)

module.exports = router;
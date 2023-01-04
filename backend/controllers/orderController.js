const Order = require('../modals/orderModels');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.setOrderUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            data: order
        }
    });

});

exports.getAllOrders = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };
    const order = await Order.find(filter);
    console.log(order);
    res.status(200).json({
        status: 'success',
        orders: order.length,
        data: {
            data: order
        }
    })
});
const Order = require('../modals/orderModels');
const catchAsync = require('./../utils/catchAsync');


exports.setOrderUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
}


// CREATE ORDER CONTROLLER
exports.createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            data: order
        }
    });

});


// GETTING BOTH SINGLE AND ALL ORDER CONTROLLER
exports.getAllOrders = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };
    const order = await Order.find(filter);
    res.status(200).json({
        status: 'success',
        orders: order.length,
        data: {
            data: order
        }
    })
});